package backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final String BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate;

    @Value("${brevo.api-key:}")
    private String apiKey;

    @Value("${brevo.from:}")
    private String fromAddress;

    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendOtp(String toEmail, String otp) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "BREVO_API_KEY is not configured.");
        }

        if (fromAddress == null || fromAddress.isBlank()) {
            throw new RuntimeException(
                    "BREVO_FROM is not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", "Calvion",
                        "email", fromAddress),
                "to", List.of(
                        Map.of("email", toEmail)),
                "subject", "Calvion – Email Verification OTP",
                "htmlContent", buildOtpHtml(otp));

        try {

            restTemplate.postForEntity(
                    BREVO_SEND_URL,
                    new HttpEntity<>(body, headers),
                    String.class);

        } catch (org.springframework.web.client.HttpStatusCodeException e) {

            throw new RuntimeException(
                    "BREVO ERROR - Status: "
                            + e.getStatusCode()
                            + " | Response: "
                            + e.getResponseBodyAsString(),
                    e);

        } catch (Exception e) {

            throw new RuntimeException(
                    "BREVO CONNECTION ERROR: "
                            + e.getMessage(),
                    e);
        }
    }

    private String buildOtpHtml(String otp) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">

                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f1f5f9;
                            margin: 0;
                            padding: 0;
                        }

                        .wrapper {
                            max-width: 540px;
                            margin: 36px auto;
                            background: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            border: 1px solid #e2e8f0;
                        }

                        .header {
                            background: linear-gradient(
                                135deg,
                                #0284c7,
                                #0369a1
                            );
                            padding: 36px 24px;
                            text-align: center;
                            color: #ffffff;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 26px;
                        }

                        .header p {
                            margin: 6px 0 0;
                            font-size: 13px;
                        }

                        .content {
                            padding: 36px 32px;
                            color: #1e293b;
                            line-height: 1.6;
                        }

                        .otp-container {
                            background: #f0f9ff;
                            border: 2px dashed #0284c7;
                            border-radius: 12px;
                            padding: 22px;
                            text-align: center;
                            margin: 28px 0;
                        }

                        .otp-label {
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #0369a1;
                            margin-bottom: 8px;
                        }

                        .otp-number {
                            font-size: 38px;
                            font-weight: 800;
                            letter-spacing: 10px;
                            color: #0284c7;
                            font-family: monospace;
                        }

                        .notice {
                            font-size: 14px;
                            color: #64748b;
                            margin-top: 24px;
                            border-top: 1px solid #f1f5f9;
                            padding-top: 18px;
                        }

                        .footer {
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #94a3b8;
                            background-color: #f8fafc;
                            border-top: 1px solid #e2e8f0;
                        }
                    </style>
                </head>

                <body>

                    <div class="wrapper">

                        <div class="header">
                            <h1>Calvion</h1>
                            <p>Digital Asset Manager</p>
                        </div>

                        <div class="content">

                            <h2>Email Verification</h2>

                            <p>Hello,</p>

                            <p>
                                Please use the following One-Time Password
                                (OTP) to verify your email address:
                            </p>

                            <div class="otp-container">

                                <div class="otp-label">
                                    Verification Code
                                </div>

                                <div class="otp-number">
                                    %s
                                </div>

                            </div>

                            <p>
                                This OTP will expire in
                                <strong>10 minutes</strong>.
                                Never share this code with anyone.
                            </p>

                            <div class="notice">

                                <p>
                                    If you didn't request this verification
                                    code, you can safely ignore this email.
                                </p>

                                <p>
                                    Regards,<br>
                                    <strong>Calvion Team</strong>
                                </p>

                            </div>

                        </div>

                        <div class="footer">
                            &copy; Calvion Digital Asset Management.
                            All rights reserved.
                        </div>

                    </div>

                </body>
                </html>
                """.formatted(otp);
    }
}