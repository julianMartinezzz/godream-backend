# ETAPA 1: Compilación
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /home/app

# Copiamos todo
COPY . .

USER root

# 1. Buscamos el pom.xml (sin importar mayúsculas) y movemos todo a la raíz de /home/app
# 2. Esto soluciona el problema de las subcarpetas de una vez por todas.
RUN ACTUAL_PATH=$(find . -iname "pom.xml" -exec dirname {} \; | head -n 1) && \
    cp -r $ACTUAL_PATH/. . || true && \
    mvn clean package -DskipTests

# ETAPA 2: Imagen de ejecución
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime:1.24
ENV LANGUAGE='en_US:en'

# Copiamos los artefactos de Quarkus
COPY --from=build /home/app/target/quarkus-app/ /deployments/

EXPOSE 8080
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]