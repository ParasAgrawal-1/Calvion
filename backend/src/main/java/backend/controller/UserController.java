package backend.controller;

import backend.dto.ChangePasswordRequest;
import backend.dto.UpdateProfileRequest;
import backend.dto.UserProfileResponse;
import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
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
                    .body(
                            e.getMessage()
                    );
        }
    }
}