package backend.service;

import backend.dto.UpdateProfileRequest;
import backend.dto.UserProfileResponse;
import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ProfileService(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    // =========================================================
    // GET CURRENT USER PROFILE
    // =========================================================

    public UserProfileResponse getProfile(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return mapToResponse(user);
    }


    // =========================================================
    // UPDATE CURRENT USER PROFILE
    // =========================================================
    //
    // Currently only NAME is editable.
    // Email and Digital Identity stay unchanged.
    //
    // =========================================================

    @Transactional
    public UserProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        if (
                request == null ||
                        request.getName() == null ||
                        request.getName().trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Name is required"
            );
        }


        String updatedName =
                request.getName().trim();


        if (
                updatedName.length() >
                        100
        ) {

            throw new RuntimeException(
                    "Name cannot exceed 100 characters"
            );
        }


        user.setName(
                updatedName
        );


        User savedUser =
                userRepository.save(
                        user
                );


        return mapToResponse(
                savedUser
        );
    }


    // =========================================================
    // MAP USER → RESPONSE
    // =========================================================

    private UserProfileResponse mapToResponse(
            User user
    ) {

        return new UserProfileResponse(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getDigitalIdentity(),

                user.getRole(),

                user.getCreatedAt()
        );
    }
}