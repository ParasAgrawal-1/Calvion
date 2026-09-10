package backend.service;

import backend.dto.ActivityResponse;
import backend.entity.Activity;
import backend.entity.DigitalAsset;
import backend.entity.User;

import backend.repository.ActivityRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ActivityService {

        private final ActivityRepository activityRepository;

        private final UserRepository userRepository;

        public ActivityService(
                        ActivityRepository activityRepository,
                        UserRepository userRepository) {
                this.activityRepository = activityRepository;

                this.userRepository = userRepository;
        }

        // =========================================================
        // CREATE ACTIVITY
        // =========================================================

        public void createActivity(
                        User user,
                        DigitalAsset asset,
                        String action,
                        String description) {

                Activity activity = Activity.builder()

                                .user(user)

                                .asset(asset)

                                .action(action)

                                .description(description)

                                .build();

                activityRepository.save(activity);
        }

        // =========================================================
        // GET MY ACTIVITIES
        // =========================================================

        public List<ActivityResponse> getMyActivities(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                return activityRepository
                                .findByUserOrderByCreatedAtDesc(user)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =========================================================
        // GET RECENT ACTIVITIES
        // =========================================================

        public List<ActivityResponse> getRecentActivities(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                return activityRepository
                                .findTop20ByUserOrderByCreatedAtDesc(user)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =========================================================
        // MAP ENTITY → RESPONSE
        // =========================================================

        private ActivityResponse mapToResponse(
                        Activity activity) {

                DigitalAsset asset = activity.getAsset();

                return new ActivityResponse(

                                activity.getId(),

                                activity.getAction(),

                                activity.getDescription(),

                                asset != null
                                                ? asset.getId()
                                                : null,

                                asset != null
                                                ? asset.getTitle()
                                                : null,

                                activity.getCreatedAt());

        }

        @Transactional
        public void detachActivitiesFromAsset(
                        Long assetId) {

                activityRepository.detachActivitiesFromAsset(
                                assetId);
        }

}