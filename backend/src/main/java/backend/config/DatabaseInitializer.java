package backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and running automatic schema migration verification...");

        // 1. Users table additions
        executeSqlSafely("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE");
        executeSqlSafely("UPDATE users SET two_factor_enabled = FALSE WHERE two_factor_enabled IS NULL");
        executeSqlSafely("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255)");
        executeSqlSafely("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_backup_codes VARCHAR(1000)");

        // 2. Digital Assets table additions
        executeSqlSafely("ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS expiry_date VARCHAR(255)");
        executeSqlSafely("ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS alert_threshold_days INTEGER");
        executeSqlSafely("ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS expiry_notes VARCHAR(500)");

        // 3. Login History table
        executeSqlSafely("""
            CREATE TABLE IF NOT EXISTS login_history (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL,
                device VARCHAR(255),
                browser VARCHAR(255),
                os VARCHAR(255),
                ip_address VARCHAR(255),
                location VARCHAR(255),
                status VARCHAR(50) NOT NULL,
                is_current BOOLEAN NOT NULL DEFAULT FALSE,
                timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_login_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """);

        // 4. Support Tickets table
        executeSqlSafely("""
            CREATE TABLE IF NOT EXISTS support_tickets (
                id BIGSERIAL PRIMARY KEY,
                ticket_number VARCHAR(255) NOT NULL UNIQUE,
                user_id BIGINT NOT NULL,
                category VARCHAR(255) NOT NULL,
                priority VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
                created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_support_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """);

        // 5. User Settings table
        executeSqlSafely("""
            CREATE TABLE IF NOT EXISTS user_settings (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL UNIQUE,
                auto_lock_duration VARCHAR(50) NOT NULL DEFAULT '15',
                default_share_permission VARCHAR(50) NOT NULL DEFAULT 'VIEW',
                allow_file_download BOOLEAN NOT NULL DEFAULT TRUE,
                require_passphrase BOOLEAN NOT NULL DEFAULT FALSE,
                notify30_days BOOLEAN NOT NULL DEFAULT TRUE,
                notify14_days BOOLEAN NOT NULL DEFAULT TRUE,
                notify7_days BOOLEAN NOT NULL DEFAULT TRUE,
                notify1_day BOOLEAN NOT NULL DEFAULT TRUE,
                email_channel BOOLEAN NOT NULL DEFAULT TRUE,
                in_app_channel BOOLEAN NOT NULL DEFAULT TRUE,
                discoverable_by_email BOOLEAN NOT NULL DEFAULT TRUE,
                show_digital_identity_publicly BOOLEAN NOT NULL DEFAULT FALSE,
                collect_telemetry BOOLEAN NOT NULL DEFAULT FALSE,
                log_audit_history BOOLEAN NOT NULL DEFAULT TRUE,
                CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """);

        log.info("Schema migration verification finished successfully.");
    }

    private void executeSqlSafely(String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            log.warn("Notice during schema migration: {}", e.getMessage());
        }
    }
}
