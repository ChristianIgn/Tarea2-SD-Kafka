# Tarea2-SD-Kafka


## Instalación

Para instalar este projecto se require los siguientes prerequisitos:

* Docker
* make
nota: usualmente los sistemas linux tienen instalado make por defecto.

Ejecutar el comando `make up` iniciará el projecto en docker y levantará dos endpoints principales:

```
127.0.0.1:8000 Servidor web que consume y produce eventos en Kafka.
127.0.0.1:8080 AKHQ, plataforma de monitoreo de los eventos de Kafka.
```
### Configuraciones
Para poder enviar emails a través de este sistema se requieren ingresar ciertas credenciales en el archivo [.env](app/.env). Las configuraciones a ingresar son:

| Variable | Default | Descripcion |
| --- | --- | --- |
| NODEMAILER_SMTP_HOST | | Host del servidor SMTP |
| NODEMAILER_SMTP_PORT | | Puerto del servidor SMTP |
| NODEMAILER_AUTH_USERNAME | | Usuario del servidor SMTP |
| NODEMAILER_AUTH_PASSWORD | | Password del servidor SMTP |
| NODEMAILER_DEFAULT_ADDRESS | `noreply@tarea.kafka.com` | Direccion de correo donde se envian los mails|


Para probar el programa, se recomienda ejecutar el ingreso de ordenes, realizando un post a la ruta:

`http://localhost:8000/producer`

Ejemplo de post, con postman, usando raw JSON:
{
      "correo_vendedor": "ejemplo@gmail.com",
      "correo": "ejemplo@gmail.com",
      "cantidad": "50"
}

Para que el topico summaries consuma los datos de las ordenes de un vendedor/cocinero, realizar un get 
especificando el correo del vendedor:

`http://localhost:8000/consumer/ejemplo@gmail.com`

Para enviar por correo el resumen diario, realizar el siguiente get:

`http://localhost:8000/daily`

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
