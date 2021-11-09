https://gokapi.readthedocs.io/en/latest/index.html---
title:  "Gokapi: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-11-09 23:30:00
last_modified_at: 2021-11-09T23:45:00
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
[Gokapi](https://gokapi.readthedocs.io/en/latest/index.html){: .btn .btn--warning .btn--small}{:target="_blank"} es un servidor ligero para compartir archivos, que caducan después de una cantidad fija de descargas o días.

Es similar al descontinuado [Firefox Send](https://github.com/mozilla/send){:target="_blank"}, con la diferencia de que solo el administrador puede cargar archivos.

Esto nos permite compartir archivos muy fácilmente y eliminarlos después, ahorrando así espacio en disco y teniendo control sobre quién descarga el archivo desde el servidor.

Las principales características son las siguientes:

 * Subir y compartir inmediatamente varios archivos usando tu propio VPS privado.
 * Hacer que los archivos estén disponibles o no para su descarga con un solo clic.
 * API disponible para interactuar con Gokapi.
 * Protege tu panel de administración detrás de una ruta URL secreta e inicia sesión de forma segura con tu propio nombre de usuario y contraseña.

## Instalación

### Traefik

[Requisito obligatorio tener instalado **Docker: Traefik Maroilles**](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-traefik-maroilles){: .btn .btn--warning}{:target="_blank"}

### Gokapi

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/gokapi/{config,datos} && \
cd $HOME/docker/gokapi
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/gokapi/docker-compose.yml
version: '3'
services:
  gokapi:
    image: f0rc3/gokapi:latest
    container_name: GOkapi
    ports:
      - 53842:53842
    volumes:
      - '~/docker/gokapi/config:/app/config'
      - '~/docker/gokapi/datos:/app/data'
    environment:
      - GOKAPI_USERNAME=Empalador
      - GOKAPI_PASSWORD=nocturno
      - GOKAPI_PORT=53842
      - GOKAPI_EXTERNAL_URL=https://gokapi.lordpedal.duckdns.org
      - GOKAPI_REDIRECT_URL=https://lordpedal.github.io
      - GOKAPI_LOCALHOST=no
      - GOKAPI_USE_SSL=no
    networks:
      - traefik
    labels:
      - traefik.backend=gokapi
      - traefik.frontend.rule=Host:gokapi.lordpedal.duckdns.org
      - traefik.docker.network=traefik
      - traefik.port=53842
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
| `53842:53842` | Puerto gestión web `53842` |
| `~/docker/gokapi/config:/app/config` | Ruta donde almacenamos la configuración |
| `~/docker/gokapi/datos:/app/data` | Ruta donde almacenamos los datos |
| `GOKAPI_USERNAME=Empalador` | Usuario que definimos de acceso **Admin** |
| `GOKAPI_PASSWORD=nocturno` | Contraseña de usuario que definimos de acceso **Admin** |
| `GOKAPI_PORT=53842` | Puerto de escucha |
| `GOKAPI_EXTERNAL_URL=https://gokapi.lordpedal.duckdns.org` | La URL que se utilizará para generar enlaces de descarga |
| `GOKAPI_REDIRECT_URL=https://lordpedal.github.io` | De forma predeterminada, Gokapi redirige a otra URL en lugar de mostrar una página genérica si no se ha pasado ningún enlace de descarga |
| `GOKAPI_LOCALHOST=no` | Podriamos limitar el uso a la red interna |
| `GOKAPI_USE_SSL=no` | Generar certificados SSL, en nuestro caso los gestiona **Traefik** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
| `traefik.frontend.rule=Host:gokapi.lordpedal.duckdns.org` | Sustituimos la variable `lordpedal` por nuestro ID de DuckDNS |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [https://gokapi.lordpedal.duckdns.org/admin](https://lordpedal.github.io/gnu/linux/docker/gokapi-docker/#gokapi){: .btn .btn--inverse .btn--small}

NOTA: Importante comentar que si no añadimos la variable **/admin** al enlace seremos redigiridos a la dirección que hubiesemos definido en la variable **GOKAPI_REDIRECT_URL**.
{: .notice--info}

<figure class="half">
    <a href="/assets/images/posts/gokapi1.jpg"><img src="/assets/images/posts/gokapi1.jpg"></a>
    <a href="/assets/images/posts/gokapi2.jpg"><img src="/assets/images/posts/gokapi2.jpg"></a>
</figure>

> Y listo!
