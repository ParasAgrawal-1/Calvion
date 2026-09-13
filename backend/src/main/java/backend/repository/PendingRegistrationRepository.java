package backend.repository;

import backend.entity.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PendingRegistrationRepository
        extends JpaRepository<PendingRegistration, Long> {

    Optional<PendingRegistration> findByEmail(String email);

    Optional<PendingRegistration> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);
}