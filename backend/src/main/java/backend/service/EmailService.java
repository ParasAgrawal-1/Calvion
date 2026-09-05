package backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from:${spring.mail.username:}}")
    private String mailFrom;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            if (mailFrom != null && !mailFrom.isBlank()) {
                helper.setFrom(mailFrom, "Calvion");
            }

            helper.setTo(email);
            helper.setSubject("Calvion - Email Verification OTP");

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; }
                            .wrapper { max-width: 540px; margin: 36px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
                            .header { background: linear-gradient(135deg, #0284c7, #0369a1); padding: 36px 24px; text-align: center; color: #ffffff; }
                            .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                            .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
                            .content { padding: 36px 32px; color: #1e293b; line-height: 1.6; }
                            .otp-container { background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 22px; text-align: center; margin: 28px 0; }
                            .otp-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #0369a1; margin-bottom: 8px; }
                            .otp-number { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0284c7; margin: 0; font-family: monospace; }
                            .notice { font-size: 14px; color: #64748b; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 18px; }
                            .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="header">
                                <h1>Calvion</h1>
                                <p>Digital Asset Manager</p>
                            </div>
                            <div class="content">
                                <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">Email Verification</h2>
                                <p>Hello,</p>
                                <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

                                <div class="otp-container">
                                    <div class="otp-label">Verification Code</div>
                                    <div class="otp-number">%s</div>
                                </div>

                                <p style="font-size: 14px; color: #334155;">This OTP will expire in <strong>10 minutes</strong>. Never share this code with anyone.</p>

                                <div class="notice">
                                    <p style="margin: 0;">If you didn't request this verification code, you can safely ignore this email.</p>
                                    <p style="margin: 12px 0 0 0;">Regards,<br><strong>Calvion Team</strong></p>
                                </div>
                            </div>
                            <div class="footer">
                                &copy; Calvion Digital Asset Management. All rights reserved.
                            </div>
                        </div>
                    </body>
                    </html>
                    """.formatted(otp);

            helper.setText(html, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }
}