---
title:  "Pwndrop: Docker"
date:   2021-01-26 23:30:00
last_modified_at: 2021-01-26T23:45:00
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
**Pwndrop** es un servicio de alojamiento de archivos autodesplegable para enviar cargas útiles o compartir de forma segura sus archivos privados a través de **`HTTP y WebDAV`**.

Las principales características son las siguientes:

 * Subir y compartir inmediatamente varios archivos usando tu propio VPS privado.
 * Hacer que los archivos estén disponibles o no para su descarga con un solo clic.
 * Configurar URLs de descarga personalizadas, para archivos compartidos, sin jugar con la estructura de directorios.
 * Preparar los archivos de fachada, que serán servidos en lugar del archivo original cuando te apetezca.
 * Configurar redirecciones automáticas para falsificar la extensión del archivo en un enlace compartido.
 * Cambiar el tipo de MIME del archivo servido para cambiar el comportamiento del navegador cuando se hace clic en un enlace de descarga.
 * Servir los archivos a través de HTTP, HTTPS y WebDAV. 
 * Protege tu panel de administración detrás de una ruta URL secreta personalizada e inicia sesión de forma segura con tu propio nombre de usuario y contraseña.

## Instalación

### Traefik

[Requisito obligatorio tener instalado **Docker: Traefik Maroilles**](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-traefik-maroilles){: .btn .btn--warning}{:target="_blank"}

### Pwndrop

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/pwndrop/config && \
cd $HOME/docker/pwndrop
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/pwndrop/docker-compose.yml
version: "2.1"
services:
  pwndrop:
    image: ghcr.io/linuxserver/pwndrop
    container_name: PWNDrop
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
      - SECRET_PATH=/lordpedal
    volumes:
      - ~/docker/pwndrop/config:/config
    ports:
      - 8003:8080
    networks:
      - traefik
    labels:
      - traefik.backend=pwndrop
      - traefik.frontend.rule=Host:pwndrop.lordpedal.duckdns.org
      - traefik.docker.network=traefik
      - traefik.port=80
      - traefik.enable=true
    restart: always
networks:
  traefik:
    external: true
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `SECRET_PATH=/lordpedal` | Ruta secreta para el acceso administrador `/lordpedal` |
| `~/docker/pwndrop/config:/config` | Ruta donde almacenamos los datos |
| `8003:8080` | Puerto gestión web `8003` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
| `traefik.frontend.rule=Host:pwndrop.lordpedal.duckdns.org` | Sustituimos la variable `lordpedal` por nuestro ID de DuckDNS |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [https://pwndrop.lordpedal.duckdns.org/lordpedal](https://lordpedal.github.io/gnu/linux/docker/pwndrop-docker/#pwndrop){: .btn .btn--inverse .btn--small}

<figure class="half">
    <a href="/assets/images/posts/pwndrop1.jpg"><img src="/assets/images/posts/pwndrop1.jpg"></a>
    <a href="/assets/images/posts/pwndrop2.jpg"><img src="/assets/images/posts/pwndrop2.jpg"></a>
</figure>

<figure class="half">
    <a href="/assets/images/posts/pwndrop3.jpg"><img src="/assets/images/posts/pwndrop3.jpg"></a>
    <a href="/assets/images/posts/pwndrop4.jpg"><img src="/assets/images/posts/pwndrop4.jpg"></a>
</figure>

> Y listo!
