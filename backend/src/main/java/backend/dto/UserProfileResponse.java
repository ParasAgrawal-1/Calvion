package backend.dto;

import backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;

    private String name;

    private String email;

    private String digitalIdentity;

    private UserRole role;

    private LocalDateTime createdAt;
}