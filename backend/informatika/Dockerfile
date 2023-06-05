# Use a base image with Java and Maven pre-installed
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory
WORKDIR /app

# Copy the Maven project file(s)
COPY pom.xml .

# Fetch the dependencies
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Use a minimal base image for running the application
FROM adoptopenjdk/openjdk17:alpine-jre

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/informatika.jar .

# Expose the port on which the application will listen
EXPOSE 8080

# Set the entrypoint command
ENTRYPOINT ["java", "-jar", "informatika.jar"]
