FROM openjdk:17-jdk-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*
COPY gradlew ./
COPY gradle gradle
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew
COPY build.gradle settings.gradle ./
COPY src ./src
RUN ./gradlew --no-daemon -x test bootJar

FROM eclipse-temurin:17-jre-jammy AS final
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring:spring
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=docker \
    SERVER_PORT=8080 \
    EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://sc-eureka:8761/eureka

COPY --from=build /app/build/libs/*.jar /app/app.jar

HEALTHCHECK --interval=10s --timeout=3s --retries=20 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health | grep -q UP || exit 1

EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
