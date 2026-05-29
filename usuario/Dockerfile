FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
CMD ["java", "-jar", "target/app.jar"]
