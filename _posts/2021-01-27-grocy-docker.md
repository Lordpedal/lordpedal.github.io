---
title:  "Grocy: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-01-27 23:30:00
last_modified_at: 2021-01-27T23:45:00
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
**Grocy** es una solución de administración del hogar y comestibles autohospedada basada en la web para su hogar.

Las principales características son las siguientes:

 * Seguimiento de compras: Una interfaz lista para el lector de códigos de barras hace que esta sea una tarea fácil y rápida y siempre sabrá lo que tiene actualmente en casa.
 * Automatiza y optimiza tu lista de la compra: Definir cantidades mínimas de existencias de sus productos favoritos.
 * Desperdiciar menos: Siempre sabrás lo que caduca a continuación.
 * Formularios de entrada hechos para la productividad.
 * Recetas con inteligencia: Mantenga sus recetas y vea de un vistazo si todo lo que necesita está disponible en casa.
 * Planificación de comidas: Planifique sus comidas diarias en base a sus recetas y ponga todo lo necesario.
 * Mantenga todos los manuales de instrucciones y la información importante sobre sus dispositivos en un solo lugar para tenerlos a mano cuando sea necesario.
 * Seguimiento de las tareas del hogar.
 * Maneja tus baterías: Use baterías recargables para todo para proteger nuestro medio ambiente y mantenerlas en buen estado sabiendo cuándo las cargó por última vez.
 * Campos / objetos / listas personalizados:A cualquier entidad (como productos o tareas) se pueden adjuntar campos personalizados.

## Instalación

### Grocy

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/grocy/config && \
cd $HOME/docker/grocy
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/grocy/docker-compose.yml
version: "2.1"
services:
  grocy:
    image: ghcr.io/linuxserver/grocy
    container_name: Grocy
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - ~/docker/grocy/config:/config
    ports:
      - 9283:80
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `~/docker/grocy/config:/config` | Ruta donde almacenamos los datos |
| `9283:80` | Puerto gestión web `9283` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

### Grocy + Traefik

[Requisito obligatorio tener instalado **Docker: Traefik Maroilles**](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-traefik-maroilles){: .btn .btn--warning}{:target="_blank"}

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/grocy/config && \
cd $HOME/docker/grocy
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/grocy/docker-compose.yml
version: "2.1"
services:
  grocy:
    image: ghcr.io/linuxserver/grocy
    container_name: Grocy
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - ~/docker/grocy/config:/config
    ports:
      - 9283:80
    networks:
      - traefik
    labels:
      - traefik.backend=grocy
      - traefik.frontend.rule=Host:despensa.lordpedal.duckdns.org
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
| `~/docker/grocy/config:/config` | Ruta donde almacenamos los datos |
| `9283:80` | Puerto gestión web `9283` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
| `traefik.frontend.rule=Host:despensa.lordpedal.duckdns.org` | Sustituimos la variable `lordpedal` por nuestro ID de DuckDNS |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [https://despensa.lordpedal.duckdns.org](https://lordpedal.github.io/gnu/linux/docker/grocy-docker/#grocy){: .btn .btn--inverse .btn--small}

## Configuración

`Usuario / Contraseña`: **admin**
{: .notice--info}

![Grocy]({{ site.url }}{{ site.baseurl }}/assets/images/posts/grocydock.jpg){: .align-center}

<figure class="third">
    <a href="https://play.google.com/store/apps/details?id=xyz.zedler.patrick.grocy" target="_blank"><img src="/assets/images/posts/googlestore.png"></a>
    <a href="https://f-droid.org/de/packages/xyz.zedler.patrick.grocy/" target="_blank"><img src="/assets/images/posts/fdroidstore.png"></a>
    <a href="https://apps.apple.com/app/pantry-party/id1510485755" target="_blank"><img src="/assets/images/posts/appstore.png"></a>
</figure>

Necesitamos configurar una API para poder interactuar, para ello en la ruta de navegación añadimos la variable `/manageapikeys`

En mi caso queda de la siguiente forma: [https://despensa.lordpedal.duckdns.org/manageapikeys](https://lordpedal.github.io/gnu/linux/docker/grocy-docker/#grocy){: .btn .btn--inverse .btn--small}

<figure>
    <a href="/assets/images/posts/grocyapi.jpg"><img src="/assets/images/posts/grocyapi.jpg"></a>
</figure>

> Y listo!
