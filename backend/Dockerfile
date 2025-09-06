# --- Build Stage ---
# Use a Maven image to build the application
FROM maven:3.9.11-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Compile and package the application, skipping tests for faster builds
RUN mvn clean package -DskipTests

# --- Final Stage ---
# Use a slim Java Runtime Environment for the final image
FROM eclipse-temurin:17-jre-focal

# Set the working directory
WORKDIR /app

# Expose the port your application runs on (e.g., 8080 for Spring Boot)
EXPOSE 8080

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]