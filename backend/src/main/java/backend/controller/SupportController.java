package backend.controller;

import backend.dto.SupportTicketRequest;
import backend.dto.SupportTicketResponse;
import backend.entity.SupportTicket;
import backend.entity.User;
import backend.repository.SupportTicketRepository;
import backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    public SupportController(SupportTicketRepository supportTicketRepository, UserRepository userRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> createTicket(
            @Valid @RequestBody SupportTicketRequest request,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            String ticketNumber = "CALV-" + (100000 + new Random().nextInt(900000));

            SupportTicket ticket = SupportTicket.builder()
                    .ticketNumber(ticketNumber)
                    .user(user)
                    .category(request.getCategory())
                    .priority(request.getPriority())
                    .subject(request.getSubject())
                    .message(request.getMessage())
                    .status("OPEN")
                    .build();

            SupportTicket saved = supportTicketRepository.save(ticket);

            SupportTicketResponse response = SupportTicketResponse.builder()
                    .id(saved.getId())
                    .ticketNumber(saved.getTicketNumber())
                    .category(saved.getCategory())
                    .priority(saved.getPriority())
                    .subject(saved.getSubject())
                    .message(saved.getMessage())
                    .status(saved.getStatus())
                    .createdAt(saved.getCreatedAt())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to create support ticket: " + e.getMessage());
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            List<SupportTicketResponse> tickets = supportTicketRepository.findByUserOrderByCreatedAtDesc(user)
                    .stream()
                    .map(t -> SupportTicketResponse.builder()
                            .id(t.getId())
                            .ticketNumber(t.getTicketNumber())
                            .category(t.getCategory())
                            .priority(t.getPriority())
                            .subject(t.getSubject())
                            .message(t.getMessage())
                            .status(t.getStatus())
                            .createdAt(t.getCreatedAt())
                            .build())
                    .toList();

            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to retrieve tickets: " + e.getMessage());
        }
    }
}
