---
title:  "DockerTG: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-01-14 23:30:00
last_modified_at: 2021-01-14T23:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
En esta entrada voy a compartir un sencillo Docker creado a partir de la base de [Aref Aslani](https://github.com/arefaslani/docker-telegram-notifier){:target="_blank"} que he actualizado y traducido notificaciones al idioma Español.

Este pequeño servicio nos va a notificar de los cambios de estado (**inicio, detención, ...**) en nuestros Dockers vía Telegram.

Para configurarlo sobre nuestra base Debian seguimos este **mini-tutorial**.

**NOTA**: El token de referencia del post no tiene validez, haz de usar tu propio bot u otro token conocido.
{: .notice--info}

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/dockertg && \
cd $HOME/docker/dockertg
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/dockertg/docker-compose.yml
version: "2"
services:
  docker-telegram:
    image: lordpedal/dockertg
    container_name: DockerTG
    environment:
      - PUID=1000
      - PGID=1000
      - TELEGRAM_NOTIFIER_BOT_TOKEN=289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA
      - TELEGRAM_NOTIFIER_CHAT_ID=79593223
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TELEGRAM_NOTIFIER_BOT_TOKEN=289352425:...` | Token de nuestro Bot Telegram |
| `TELEGRAM_NOTIFIER_CHAT_ID=79593223` | Cambiamos por nuestro ID Telegram, se puede consultar en [@Lordpedalbot](https://t.me/lordpedalbot){:target="_blank"} |
| `/var/run/docker.sock:/var/run/docker.sock:ro` | Ruta donde lee la configuración Dockers |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

> Y listo!
