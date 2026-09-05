package backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    @Value("${mail.from:onboarding@resend.dev}")
    private String mailFrom;

    public EmailService(
            @Value("${RESEND_API_KEY:}") String apiKey
    ) {

        if (apiKey != null && !apiKey.isBlank()) {
            this.resend = new Resend(apiKey);
        } else {
            this.resend = null;
        }
    }

    public void sendOtp(String email, String otp) {

        if (resend == null) {
            throw new IllegalStateException(
                    "RESEND_API_KEY is not configured."
            );
        }

        String subject = "Calvion - Email Verification OTP";

        String html = """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Calvion Email Verification</h2>

                    <p>Your OTP for Calvion registration is:</p>

                    <h1 style="letter-spacing: 6px;">%s</h1>

                    <p>This OTP will expire in <strong>10 minutes</strong>.</p>

                    <p>Do not share this OTP with anyone.</p>

                    <p>Regards,<br>
                    <strong>Calvion Team</strong></p>
                </body>
                </html>
                """.formatted(otp);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(mailFrom)
                .to(email)
                .subject(subject)
                .html(html)
                .build();

        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            throw new RuntimeException(
                    "Failed to send OTP email",
                    e
            );
        }
    }
}