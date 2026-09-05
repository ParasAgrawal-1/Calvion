package backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * Production:
         *
         * https://calvion.vercel.app
         *
         * Local:
         *
         * http://localhost:5173
         */

        List<String> originPatterns = new java.util.ArrayList<>();
        originPatterns.add("http://localhost:*");
        originPatterns.add("https://*.vercel.app");

        if (frontendUrl != null && !frontendUrl.isBlank()) {
            for (String origin : frontendUrl.split(",")) {
                String cleanOrigin = origin.trim().replaceAll("/+$", "");
                if (!cleanOrigin.isBlank() && !originPatterns.contains(cleanOrigin)) {
                    originPatterns.add(cleanOrigin);
                }
            }
        }

        configuration.setAllowedOriginPatterns(
                originPatterns
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setExposedHeaders(
                List.of("*")
        );


        configuration.setAllowCredentials(
                true
        );


        configuration.setMaxAge(
                3600L
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}