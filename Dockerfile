# ETAPA 1: Compilación
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /home/app

# Copiamos todo
COPY . .

USER root

# Intentamos compilar entrando a la carpeta del proyecto
# Si tu carpeta se llama distinto en el repo, cámbialo aquí:
RUN cd godream-backend && mvn clean package -DskipTests

# ETAPA 2: Imagen de ejecución
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime:1.24

ENV LANGUAGE='en_US:en'

# Ajustamos la ruta de origen para incluir la carpeta intermedia
COPY --from=build --chown=185 /home/app/godream-backend/target/quarkus-app/lib/ /deployments/lib/
COPY --from=build --chown=185 /home/app/godream-backend/target/quarkus-app/*.jar /deployments/
COPY --from=build --chown=185 /home/app/godream-backend/target/quarkus-app/app/ /deployments/app/
COPY --from=build --chown=185 /home/app/godream-backend/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]