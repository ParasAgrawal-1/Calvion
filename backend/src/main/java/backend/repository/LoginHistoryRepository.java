package backend.repository;

import backend.entity.LoginHistory;
import backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    List<LoginHistory> findByUserOrderByTimestampDesc(User user);

    @Modifying
    @Query("DELETE FROM LoginHistory l WHERE l.user = :user AND l.isCurrent = false")
    void deleteByUserAndIsCurrentFalse(@Param("user") User user);
}
