---
title:  "Bitwarden: Docker"
date:   2021-01-20 23:30:00
header:
  image: /assets/images/posts/dockertt.gif
last_modified_at: 2021-01-20T23:45:00
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
Bitwarden es un gestor de **contraseñas gratuito y de código abierto** que se puede albergar en tu propio servidor.

Bitwarden es compatible con los sistemas operativos más populares del mercado: `Windows, MacOS, Linux, iOS y Android`.

Además, cuenta con una extensión con los navegadores más comunes como `Chrome, Firefox, Safari, Opera, Vivaldi` o todo aquel que soporte las `extensiones de Chrome`.

Las principales características son las siguientes:

 * Acceso e instalación de todas las aplicaciones de Bitwarden.
 * Sincronización sin límites con todos tus dispositivos.
 * Almacenamiento ilimitado de tus datos.
 * Verificación de doble factor.
 * Generador de contraseñas seguras.
 * Elementos compartidos ilimitados.

## Instalación

### Traefik

[Requisito obligatorio tener instalado **Docker: Traefik Maroilles**](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-traefik-maroilles){: .btn .btn--warning}{:target="_blank"}

### Bitwarden

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/bitwarden/datos && \
cd $HOME/docker/bitwarden
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/bitwarden/docker-compose.yml
version: "2"
services:
  bitwarden:
    image: bitwardenrs/server
    container_name: Bitwarden
    volumes:
      - '~/docker/bitwarden/datos:/data/'
    ports:
      - 8002:80
    networks:
      - traefik
    labels:
      - traefik.backend=bitwarden
      - traefik.frontend.rule=Host:bitwarden.lordpedal.duckdns.org
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
| `~/docker/bitwarden/datos:/data/` | Ruta donde almacenamos los datos |
| `8002:80` | Puerto gestión web `8002` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
| `traefik.frontend.rule=Host:bitwarden.lordpedal.duckdns.org` | Sustituimos la variable `lordpedal` por nuestro ID de DuckDNS |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [https://bitwarden.lordpedal.duckdns.org](https://lordpedal.github.io/gnu/linux/docker/bitwarden-docker/#bitwarden){: .btn .btn--inverse .btn--small}

![Bitwarden]({{ site.url }}{{ site.baseurl }}/assets/images/posts/bitwardendock.png){: .align-center}

Tan solo faltaría crear una cuenta y empezar a disfrutarlo.

> Y listo!
