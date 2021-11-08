# Tarea2-SD-Kafka


## Instalación

Para instalar este projecto se require los siguientes prerequisitos:

* Docker
* make

Ejecutar el comando `make up` iniciará el projecto en docker y levantará dos endpoints principales:

```
127.0.0.1:8000 Servidor web que consume y produce eventos en Kafka.
127.0.0.1:8080 AKHQ, plataforma de monitoreo de los eventos de Kafka.
```


El listado completo de comandos se puede ver con `make help`.

```
up                   run the project
stop                 stop Docker containers without removing them
down                 stop and remove Docker containers without wiping volumes
reset                wipe volumes, then pull
pull                 update Docker images
rebuild              rebuild backend Docker image
rebuild-full         rebuild backend Docker image and wipes volumes
```

## Información de los contenedores de docker

Los contenedores utilizados son los siguiente:

| servicio | imagen | descripción |
| --- |--- | --- |
| kafka | [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) | Kafka | 
| zookeeper | [confluentinc/cp-zookeeper](https://hub.docker.com/r/confluentinc/cp-zookeeper) | clusters de Kafka |
| init-kafka | [conflentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) | crea los topics de kafka en caso que no existan |
| akhq | [tchiotludo/akhq](https://github.com/tchiotludo/akhq) | plataforma de administración de kafka |
| backend | [Node Dockerfile](.docker/Dockerfile) | Servidor web en Node |
