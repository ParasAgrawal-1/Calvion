package backend.controller;

import backend.dto.*;
import org.springframework.beans.factory.annotation.Value;
import java.util.Map;
import backend.entity.User;
import backend.repository.UserRepository;

import backend.service.JwtService;
import backend.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import backend.entity.PendingRegistration;
import backend.repository.PendingRegistrationRepository;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    public AuthController(
            UserRepository userRepository,
            PendingRegistrationRepository pendingRegistrationRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.pendingRegistrationRepository = pendingRegistrationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    @Value("${app.otp.demo-mode:false}")
    private boolean demoOtpMode;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // =========================
// REGISTER
// =========================
@PostMapping("/register")
public ResponseEntity<?> register(
        @RequestBody RegisterRequest request
) {

    // Check if user is already registered
    if (userRepository.existsByEmail(request.getEmail())) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already registered. Please login instead."));
    }

    // Check digital identity
    if (userRepository.existsByDigitalIdentity(
            request.getDigitalIdentity()
    )) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Digital Identity is already taken. Please choose another."));
    }

    // Generate a secure random verification token
    String token = UUID.randomUUID().toString();

    // Token expiry: 24 hours
    LocalDateTime expiryTime =
            LocalDateTime.now().plusHours(24);

    // Find existing pending registration or create new one
    PendingRegistration pendingRegistration =
            pendingRegistrationRepository
                    .findByEmail(request.getEmail())
                    .orElse(
                            PendingRegistration.builder()
                                    .email(request.getEmail())
                                    .build()
                    );

    pendingRegistration.setName(request.getName());
    pendingRegistration.setEmail(request.getEmail());

    // Store encoded password temporarily
    pendingRegistration.setPassword(
            passwordEncoder.encode(request.getPassword())
    );

    pendingRegistration.setDigitalIdentity(request.getDigitalIdentity());
    pendingRegistration.setVerificationToken(token);
    pendingRegistration.setTokenExpiry(expiryTime);

    pendingRegistrationRepository.save(pendingRegistration);

    // =====================================================
    // DEMO MODE
    // =====================================================

    if (demoOtpMode) {
        String demoLink = frontendUrl + "/verify-email?token=" + token;
        return ResponseEntity.ok(
                Map.of(
                        "message", "Demo mode: verification link generated.",
                        "demoLink", demoLink
                )
        );
    }

    // =====================================================
    // REAL EMAIL MODE
    // =====================================================

    String verificationLink = frontendUrl + "/verify-email?token=" + token;
    emailService.sendVerificationLink(
            request.getEmail(),
            request.getName(),
            verificationLink
    );

    return ResponseEntity.ok(
            "Verification link sent to your email. Please check your inbox."
    );
}

    // =========================
    // VERIFY EMAIL (TOKEN LINK)
    // =========================
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestParam("token") String token
    ) {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findByVerificationToken(token)
                        .orElse(null);

        if (pendingRegistration == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid or expired verification link.");
        }

        // Check token expiry
        if (pendingRegistration.getTokenExpiry() == null ||
                pendingRegistration.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                    .body("Verification link has expired. Please register again.");
        }

        // Final check before creating user
        if (userRepository.existsByEmail(pendingRegistration.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already registered.");
        }

        if (userRepository.existsByDigitalIdentity(pendingRegistration.getDigitalIdentity())) {
            return ResponseEntity.badRequest()
                    .body("Digital Identity already exists.");
        }

        // Create the verified user
        User user = User.builder()
                .name(pendingRegistration.getName())
                .email(pendingRegistration.getEmail())
                .password(pendingRegistration.getPassword())
                .digitalIdentity(pendingRegistration.getDigitalIdentity())
                .role(backend.entity.UserRole.USER)
                .build();

        userRepository.save(user);

        // Delete temporary registration data
        pendingRegistrationRepository.delete(pendingRegistration);

        return ResponseEntity.ok(
                "Email verified successfully. Registration complete."
        );
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // Check user
        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        // Verify password
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        // Generate JWT token
        backend.entity.UserRole role = (user.getRole() != null)
                ? user.getRole()
                : backend.entity.UserRole.USER;

        String token = jwtService.generateToken(
                user.getEmail(),
                role
        );

        return ResponseEntity.ok(
                new AuthResponse(
                        "Login successful",
                        token,
                        user.getEmail(),
                        user.getName()

                )
        );
    }


    // =========================
    // FORGOT PASSWORD - SEND OTP
    // =========================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        // Find user using email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        // Generate 6-digit OTP
        String otp = String.format(
                "%06d",
                new Random().nextInt(1_000_000)
        );

        // OTP expires after 15 minutes
        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(15);

        // Save OTP in database
        user.setResetOtp(otp);
        user.setResetOtpExpiry(expiryTime);

        userRepository.save(user);

        // Send OTP to user's email
        emailService.sendOtp(
                user.getEmail(),
                otp
        );

        // Do NOT expose OTP in API response
        return ResponseEntity.ok(
                "OTP sent successfully to your email"
        );
    }


    // =========================
    // RESET PASSWORD USING OTP
    // =========================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        // Find user using email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        // Check OTP
        if (user.getResetOtp() == null ||
                !user.getResetOtp()
                        .equals(request.getOtp())) {

            return ResponseEntity.badRequest()
                    .body("Invalid OTP");
        }

        // Check OTP expiry
        if (user.getResetOtpExpiry() == null ||
                user.getResetOtpExpiry()
                        .isBefore(LocalDateTime.now())) {

            return ResponseEntity.badRequest()
                    .body("OTP has expired");
        }

        // Encode and save new password
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        // Delete OTP after successful use
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }
    // =========================
// VERIFY REGISTRATION OTP
// =========================
    // verify-registration-otp kept for backward-compatibility but is no longer used
    @PostMapping("/verify-registration-otp")
    public ResponseEntity<?> verifyRegistrationOtp(
            @RequestBody VerifyRegistrationOtpRequest request
    ) {
        return ResponseEntity.badRequest()
                .body("OTP verification is no longer supported. Please use the email verification link.");
    }
    // =========================
// VERIFY RESET OTP
// =========================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        // Check OTP
        if (user.getResetOtp() == null ||
                !user.getResetOtp()
                        .equals(request.getOtp())) {

            return ResponseEntity.badRequest()
                    .body("Invalid OTP");
        }

        // Check expiry
        if (user.getResetOtpExpiry() == null ||
                user.getResetOtpExpiry()
                        .isBefore(LocalDateTime.now())) {

            return ResponseEntity.badRequest()
                    .body("OTP has expired");
        }

        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }
}