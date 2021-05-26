---
title:  "Node-RED: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-05-26 22:30:00
last_modified_at: 2021-05-26T22:45:00
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
[Node-RED](https://nodered.org/){: .btn .btn--warning .btn--small}{:target="_blank"} es una herramienta de programación visual. Muestra visualmente las relaciones y funciones, y permite al usuario programar sin tener que escribir una línea.

**Node-RED** es una herramienta de programación que se utiliza para conectar dispositivos de *hardware, APIs y servicios de internet*. 

Adecuado para los equipos dedicados al Internet de las Cosas (**IoT**) y personal dedicado al diseño y prueba de soluciones para la comunicación de equipos de planta con aplicaciones de IT.

Se ha convertido en el estándar **Open-Source** para la gestión y procesado de datos en tiempo real, logrando simplificar los procesos entre productores y consumidores de información.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/nodered/{datos} && \
cd $HOME/docker/nodered
```

Ahora vamos a crear el fichero de configuración docker-compose.yml lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/nodered/docker-compose.yml
version: '3.7'
services:
  node-red:
    image: nodered/node-red:latest
    container_name: NodeRED
    ports:
      - "1880:1880"
    environment:
      - TZ=Europe/Madrid
      - PUID=1000
      - PGID=1000
    volumes:
      - '~/docker/nodered/datos:/data'
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `1880:1880` | Puerto de gestión Web `1880` |
| `TZ=Europe/Madrid` | Zona horaria: `Europa/Madrid` |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `~/docker/nodered/datos:/data` | Ruta donde almacenamos la **configuración** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, ya tendremos nuestro servicio **Node-RED** disponible, en mi caso la ruta [192.168.1.90:1880](localhost:1880){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure class="third">
    <a href="/assets/images/posts/nodered1.png"><img src="/assets/images/posts/nodered1.png"></a>
    <a href="/assets/images/posts/nodered2.png"><img src="/assets/images/posts/nodered2.png"></a>
    <a href="/assets/images/posts/nodered3.png"><img src="/assets/images/posts/nodered3.png"></a>
</figure>

> Y listo!
