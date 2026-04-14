# ETAPA 1: Compilación
FROM maven:3.9.6-eclipse-temurin-21 AS build
# Copiamos todo el contenido de la raíz al contenedor
COPY . /home/app
USER root
# Ejecutamos la compilación desde la carpeta donde está el pom.xml
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# ETAPA 2: Imagen de ejecución
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime:1.24

ENV LANGUAGE='en_US:en'

# Copiamos los resultados desde la etapa de build
COPY --from=build --chown=185 /home/app/target/quarkus-app/lib/ /deployments/lib/
COPY --from=build --chown=185 /home/app/target/quarkus-app/*.jar /deployments/
COPY --from=build --chown=185 /home/app/target/quarkus-app/app/ /deployments/app/
COPY --from=build --chown=185 /home/app/target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]