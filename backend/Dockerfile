# =========================================================
# BUILD STAGE
# =========================================================

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app


# Copy Maven configuration first
# so dependencies can be cached.

COPY pom.xml .


RUN mvn dependency:go-offline -B


# Copy source code

COPY src ./src


# Build application

RUN mvn clean package -DskipTests



# =========================================================
# RUNTIME STAGE
# =========================================================

FROM eclipse-temurin:21-jre

WORKDIR /app


# Copy generated Spring Boot jar

COPY --from=build /app/target/*.jar app.jar


# Render normally provides PORT=10000

EXPOSE 10000


# Start Spring Boot

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-10000} -Dserver.address=0.0.0.0 -jar app.jar"]