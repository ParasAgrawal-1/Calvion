package backend.controller;

import backend.dto.ActivityResponse;
import backend.service.ActivityService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ActivityController(
            ActivityService activityService
    ) {

        this.activityService =
                activityService;
    }


    // =========================================================
    // GET ALL ACTIVITIES
    //
    // GET /api/activities
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getActivities(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            List<ActivityResponse> activities =
                    activityService
                            .getMyActivities(
                                    email
                            );


            return ResponseEntity.ok(
                    activities
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
    // GET RECENT ACTIVITIES
    //
    // GET /api/activities/recent
    // =========================================================

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentActivities(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();


            List<ActivityResponse> activities =
                    activityService
                            .getRecentActivities(
                                    email
                            );


            return ResponseEntity.ok(
                    activities
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