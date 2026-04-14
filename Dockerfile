# ETAPA 1: Compilación
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /home/app

# Copiamos todo el contenido del repositorio
COPY . .

USER root

# Corregimos la ejecución: Buscamos el POM y entramos a su carpeta
RUN POM_PATH=$(find . -name "pom.xml" | head -n 1) && \
    cd $(dirname $POM_PATH) && \
    mvn clean package -DskipTests

# ETAPA 2: Imagen de ejecución
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime:1.24
ENV LANGUAGE='en_US:en'

# Copia recursiva buscando los archivos generados por Quarkus
RUN mkdir -p /deployments
COPY --from=build /home/app/**/target/quarkus-app/ /deployments/

EXPOSE 8080
USER 185
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]