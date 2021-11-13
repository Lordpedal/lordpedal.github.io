---
title:  "Transmission Trackers Addon: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-11-13 21:30:00
last_modified_at: 2021-11-13T21:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
[Transmission](https://lordpedal.github.io/docker/transmission-docker/){: .btn .btn--warning .btn--small}{:target="_blank"} vimos que es un cliente de descargas en redes P2P, el cual vamos a usar como base de esta entrada.

Lo que vamos a realizar es la integración de un sencillo [script bash](https://github.com/AndrewMarchukov/tracker-add){:target="_blank"} a nuestro docker de Transmission, cuya funcionalidad es la de agregar más trackers a las fuentes de descarga.

Este script chequea el servicio de descargas y cuando agregas un **.torrent/magnet** al sistema le añade los trackers de un listado fuente.

## Instalación

### Transmission

[Requisito obligatorio tener instalado **Docker: Transmission**](https://lordpedal.github.io/docker/transmission-docker/){: .btn .btn--warning}{:target="_blank"}

### Trackers Addon

Vamos a tomar la base de configuración del docker de Transmission para configurar el addon. En primer nos dirigimos a la ruta donde alojamos el proyecto:

```bash
cd $HOME/docker/transmission
```

Mostramos el contenido del fichero `docker-compose.yml` lanzando el siguiente comando:

```bash
cat docker-compose.yml
```

Y mostrara la configuración que definimos:

```bash
version: "2.1"
services:
  transmission:
    image: ghcr.io/linuxserver/transmission
    container_name: Transmission
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
      - TRANSMISSION_WEB_HOME=/kettu/
      - USER=empalador
      - PASS=nocturno
    volumes:
      - ~/docker/transmission/config:/config
      - ~/docker/transmission/descargas:/downloads
      - ~/docker/transmission/descargas:/watch
    ports:
      - 9091:9091
      - 51413:51413
      - 51413:51413/udp
    restart: always
```

Hacemos un backup del fichero de configuración:

```bash
cp docker-compose.yml docker-compose.old
```

Definimos un upgrade del mismo con las nuevas variables:

```bash
cat << EOF > $HOME/docker/transmission/docker-compose.yml
version: "2.1"
services:
  transmission:
    image: ghcr.io/linuxserver/transmission
    container_name: Transmission
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
      - TRANSMISSION_WEB_HOME=/kettu/
      - USER=empalador
      - PASS=nocturno
    volumes:
      - ~/docker/transmission/config:/config
      - ~/docker/transmission/descargas:/downloads
      - ~/docker/transmission/descargas:/watch
    ports:
      - 9091:9091
      - 51413:51413
      - 51413:51413/udp
    restart: always

  trackers:
    image: andrewmhub/transmission-tracker-add:latest
    container_name: Trackers
    environment:
      - HOSTPORT=localhost:9091
      - TR_AUTH=empalador:nocturno
      - TORRENTLIST=https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_ip.txt
    network_mode: "host"
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `HOSTPORT=localhost:9091` | Ruta donde interactua con Transmission |
| `TR_AUTH=empalador:nocturno` | **Usuario:Contraseña** de acceso a Transmission |
| `TORRENTLIST=https://raw.githubusercontent.com...` | Lista de Trackers públicos actualizada |
| `network_mode: host` | Habilitamos el uso de acceo a la red no virtualizada |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos nuevamente el servicio para ser reconfigurado y ejecutado:

```bash
docker-compose up -d
```

> Y listo!
