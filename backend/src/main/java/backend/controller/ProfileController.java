package backend.controller;

import backend.dto.UpdateProfileRequest;
import backend.dto.UserProfileResponse;
import backend.service.ProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ProfileController(
            ProfileService profileService
    ) {

        this.profileService =
                profileService;
    }


    // =========================================================
    // GET PROFILE
    //
    // GET /api/profile
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            UserProfileResponse profile =
                    profileService.getProfile(
                            email
                    );


            return ResponseEntity.ok(
                    profile
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
    // UPDATE PROFILE
    //
    // PUT /api/profile
    // =========================================================

    @PutMapping
    public ResponseEntity<?> updateProfile(

            @RequestBody
            UpdateProfileRequest request,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            UserProfileResponse profile =
                    profileService.updateProfile(
                            email,
                            request
                    );


            return ResponseEntity.ok(
                    profile
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