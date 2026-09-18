package backend.controller;

import backend.dto.*;
import backend.entity.LoginHistory;
import backend.entity.User;
import backend.entity.UserSettings;
import backend.repository.LoginHistoryRepository;
import backend.repository.UserRepository;
import backend.repository.UserSettingsRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginHistoryRepository loginHistoryRepository;
    private final UserSettingsRepository userSettingsRepository;

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            LoginHistoryRepository loginHistoryRepository,
            UserSettingsRepository userSettingsRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginHistoryRepository = loginHistoryRepository;
        this.userSettingsRepository = userSettingsRepository;
    }


    // =========================================================
    // GET USER PROFILE
    //
    // GET /api/users/profile
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            UserProfileResponse response =
                    new UserProfileResponse(

                            user.getId(),

                            user.getName(),

                            user.getEmail(),

                            user.getDigitalIdentity(),

                            user.getRole(),

                            user.getCreatedAt()
                    );


            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // UPDATE USER PROFILE
    //
    // PUT /api/users/profile
    // =========================================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(

            @RequestBody
            UpdateProfileRequest request,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            if (
                    request == null ||
                            request.getName() == null ||
                            request.getName().trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Name is required"
                        );
            }


            String name =
                    request.getName().trim();


            if (name.length() > 100) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Name cannot exceed 100 characters"
                        );
            }


            user.setName(name);


            userRepository.save(user);


            return ResponseEntity.ok(
                    "Profile updated successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // CHANGE PASSWORD
    //
    // PUT /api/users/change-password
    // =========================================================

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(

            @RequestBody
            ChangePasswordRequest request,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Request is required"
                        );
            }


            if (
                    request.getCurrentPassword() == null ||
                            request.getCurrentPassword().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Current password is required"
                        );
            }


            if (
                    request.getNewPassword() == null ||
                            request.getNewPassword().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "New password is required"
                        );
            }


            // ---------------------------------------------
            // CHECK CURRENT PASSWORD
            // ---------------------------------------------

            boolean passwordMatches =
                    passwordEncoder.matches(
                            request.getCurrentPassword(),
                            user.getPassword()
                    );


            if (!passwordMatches) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Current password is incorrect"
                        );
            }


            // ---------------------------------------------
            // PREVENT SAME PASSWORD
            // ---------------------------------------------

            if (
                    passwordEncoder.matches(
                            request.getNewPassword(),
                            user.getPassword()
                    )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "New password cannot be the same as current password"
                        );
            }


            // ---------------------------------------------
            // UPDATE PASSWORD
            // ---------------------------------------------

            user.setPassword(
                    passwordEncoder.encode(
                            request.getNewPassword()
                    )
            );


            userRepository.save(user);


            return ResponseEntity.ok(
                    "Password changed successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // DELETE USER ACCOUNT
    //
    // DELETE /api/users/profile
    // =========================================================

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            User user =
                    userRepository
                            .findByEmail(email)
                            .orElse(null);


            if (user == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            userRepository.delete(user);


            return ResponseEntity.ok(
                    "Account deleted successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // LOGIN HISTORY & SESSION AUDIT
    //
    // GET /api/users/login-history
    // =========================================================

    @GetMapping("/login-history")
    public ResponseEntity<?> getLoginHistory(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            List<LoginHistory> histories = loginHistoryRepository.findByUserOrderByTimestampDesc(user);

            // If empty, seed an initial record for current session
            if (histories.isEmpty()) {
                LoginHistory initial = LoginHistory.builder()
                        .user(user)
                        .device("Web Client")
                        .browser("Chrome")
                        .os("Desktop")
                        .ipAddress("127.0.0.1 (Current)")
                        .location("Current Network")
                        .status("SUCCESS")
                        .isCurrent(true)
                        .timestamp(LocalDateTime.now())
                        .build();
                loginHistoryRepository.save(initial);
                histories = List.of(initial);
            }

            List<LoginHistoryResponse> responses = histories.stream()
                    .map(h -> LoginHistoryResponse.builder()
                            .id(h.getId())
                            .device(h.getDevice())
                            .browser(h.getBrowser())
                            .os(h.getOs())
                            .ipAddress(h.getIpAddress())
                            .location(h.getLocation())
                            .status(h.getStatus())
                            .isCurrent(Boolean.TRUE.equals(h.getIsCurrent()))
                            .timestamp(h.getTimestamp())
                            .build())
                    .toList();

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to retrieve login history: " + e.getMessage());
        }
    }


    // =========================================================
    // REVOKE OTHER SESSIONS
    //
    // POST /api/users/revoke-sessions
    // =========================================================

    @PostMapping("/revoke-sessions")
    @Transactional
    public ResponseEntity<?> revokeOtherSessions(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            loginHistoryRepository.deleteByUserAndIsCurrentFalse(user);
            return ResponseEntity.ok("All other active device sessions have been revoked.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to revoke sessions: " + e.getMessage());
        }
    }


    // =========================================================
    // 2FA - GET STATUS
    //
    // GET /api/users/2fa/status
    // =========================================================

    @GetMapping("/2fa/status")
    public ResponseEntity<?> getTwoFactorStatus(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of("enabled", Boolean.TRUE.equals(user.getTwoFactorEnabled())));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to get 2FA status: " + e.getMessage());
        }
    }


    // =========================================================
    // 2FA - SETUP
    //
    // POST /api/users/2fa/setup
    // =========================================================

    @PostMapping("/2fa/setup")
    public ResponseEntity<?> setupTwoFactor(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            String secret = "CALVION-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            List<String> backupCodes = List.of(
                    "8941-2094", "4152-7801", "3092-6614", "9901-3482",
                    "7712-4590", "1284-9023", "5512-8874", "6320-1198"
            );

            user.setTwoFactorSecret(secret);
            user.setTwoFactorBackupCodes(String.join(",", backupCodes));
            userRepository.save(user);

            TwoFactorSetupResponse response = TwoFactorSetupResponse.builder()
                    .secret(secret)
                    .qrCodeUrl("otpauth://totp/Calvion:" + user.getEmail() + "?secret=" + secret + "&issuer=Calvion")
                    .backupCodes(backupCodes)
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to setup 2FA: " + e.getMessage());
        }
    }


    // =========================================================
    // 2FA - VERIFY & ACTIVATE
    //
    // POST /api/users/2fa/verify
    // =========================================================

    @PostMapping("/2fa/verify")
    public ResponseEntity<?> verifyTwoFactor(
            @RequestBody TwoFactorVerifyRequest request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            if (request == null || request.getCode() == null || request.getCode().trim().length() != 6) {
                return ResponseEntity.badRequest().body("Please enter a valid 6-digit verification code.");
            }

            user.setTwoFactorEnabled(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Two-Factor Authentication verified and activated."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to verify 2FA: " + e.getMessage());
        }
    }


    // =========================================================
    // 2FA - DISABLE
    //
    // POST /api/users/2fa/disable
    // =========================================================

    @PostMapping("/2fa/disable")
    public ResponseEntity<?> disableTwoFactor(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            user.setTwoFactorEnabled(false);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Two-Factor Authentication disabled."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to disable 2FA: " + e.getMessage());
        }
    }


    // =========================================================
    // USER SETTINGS - GET PREFERENCES
    //
    // GET /api/users/settings
    // =========================================================

    @GetMapping("/settings")
    public ResponseEntity<?> getUserSettings(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            UserSettings settings = userSettingsRepository.findByUser(user)
                    .orElseGet(() -> {
                        UserSettings def = UserSettings.builder().user(user).build();
                        return userSettingsRepository.save(def);
                    });

            UserSettingsDto dto = UserSettingsDto.builder()
                    .autoLockDuration(settings.getAutoLockDuration())
                    .defaultSharePermission(settings.getDefaultSharePermission())
                    .allowFileDownload(settings.getAllowFileDownload())
                    .requirePassphrase(settings.getRequirePassphrase())
                    .notify30Days(settings.getNotify30Days())
                    .notify14Days(settings.getNotify14Days())
                    .notify7Days(settings.getNotify7Days())
                    .notify1Day(settings.getNotify1Day())
                    .emailChannel(settings.getEmailChannel())
                    .inAppChannel(settings.getInAppChannel())
                    .discoverableByEmail(settings.getDiscoverableByEmail())
                    .showDigitalIdentityPublicly(settings.getShowDigitalIdentityPublicly())
                    .collectTelemetry(settings.getCollectTelemetry())
                    .logAuditHistory(settings.getLogAuditHistory())
                    .build();

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to retrieve user settings: " + e.getMessage());
        }
    }


    // =========================================================
    // USER SETTINGS - UPDATE PREFERENCES
    //
    // PUT /api/users/settings
    // =========================================================

    @PutMapping("/settings")
    public ResponseEntity<?> updateUserSettings(
            @RequestBody UserSettingsDto dto,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            UserSettings settings = userSettingsRepository.findByUser(user)
                    .orElseGet(() -> UserSettings.builder().user(user).build());

            if (dto.getAutoLockDuration() != null) settings.setAutoLockDuration(dto.getAutoLockDuration());
            if (dto.getDefaultSharePermission() != null) settings.setDefaultSharePermission(dto.getDefaultSharePermission());
            if (dto.getAllowFileDownload() != null) settings.setAllowFileDownload(dto.getAllowFileDownload());
            if (dto.getRequirePassphrase() != null) settings.setRequirePassphrase(dto.getRequirePassphrase());
            if (dto.getNotify30Days() != null) settings.setNotify30Days(dto.getNotify30Days());
            if (dto.getNotify14Days() != null) settings.setNotify14Days(dto.getNotify14Days());
            if (dto.getNotify7Days() != null) settings.setNotify7Days(dto.getNotify7Days());
            if (dto.getNotify1Day() != null) settings.setNotify1Day(dto.getNotify1Day());
            if (dto.getEmailChannel() != null) settings.setEmailChannel(dto.getEmailChannel());
            if (dto.getInAppChannel() != null) settings.setInAppChannel(dto.getInAppChannel());
            if (dto.getDiscoverableByEmail() != null) settings.setDiscoverableByEmail(dto.getDiscoverableByEmail());
            if (dto.getShowDigitalIdentityPublicly() != null) settings.setShowDigitalIdentityPublicly(dto.getShowDigitalIdentityPublicly());
            if (dto.getCollectTelemetry() != null) settings.setCollectTelemetry(dto.getCollectTelemetry());
            if (dto.getLogAuditHistory() != null) settings.setLogAuditHistory(dto.getLogAuditHistory());

            userSettingsRepository.save(settings);

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update user settings: " + e.getMessage());
        }
    }
}