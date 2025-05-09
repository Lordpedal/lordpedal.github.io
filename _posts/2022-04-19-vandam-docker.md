---
title:  "VanDAM 3D: Docker"
date:   2022-04-19 14:00:00
last_modified_at: 2023-11-05T21:00:00
categories:
  - Obsoleto
tags:
  - Obsoleto
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Dockerold.png){: .align-center}
{: .full}
[VanDAM](https://github.com/Floppy/van_dam){: .btn .btn--warning .btn--small}{:target="_blank"} es un gestor de contenido digital, diseñado específicamente para archivos de impresión 3D.

Es una alternativa local y autogestionada a macroservicios online como [Thingiverse](https://www.thingiverse.com/){:target="_blank"}, [Cults3D](https://cults3d.com/){:target="_blank"}, ... 

La dinámica de uso es muy sencilla, tan solo definimos una biblioteca, alojamos los ficheros que hayamos diseñado o bien queramos tener gestionados y listo.

Es proyecto aún en fase de desarrollo y tiene cierto margen de mejora en la gestión, pero realmente merece la pena darle una oportunidad de uso.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/vandam/{stl,bdatos} && \
cd $HOME/docker/vandam
```

Agregamos el paquete `openssl` para generar una clave de cifrado para la base de datos:

```bash
sudo apt-get update && \
sudo apt-get -y install openssl
```

Generamos la clave de forma aleatoria y la anotamos para usarla en la creación del **docker**:

```bash
openssl rand -base64 32
```

Como ejemplo muestro un resultado de la ejecución del comando:

```bash
pi@overclock:~$ openssl rand -base64 32
gED04yiDeyItG6e9GO/OPCd+IBFZOoAIFkM6/3ZllcI=
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/vandam/docker-compose.yml
version: "3"

services:
  app:
    image: ghcr.io/floppy/van_dam:latest
    container_name: VanDAM
    ports:
      - 8993:3214
    volumes:
      - ./stl:/Diseños
    environment:
      DATABASE_URL: postgresql://van_dam:overclockserver@db/van_dam?pool=5
      SECRET_KEY_BASE: gED04yiDeyItG6e9GO/OPCd+IBFZOoAIFkM6/3ZllcI=
      REDIS_URL: redis://redis:6379/1
    restart: always
    depends_on:
      - db
      - redis
    networks:
      - vandam
    links:
      - db
      - redis

  db:
    image: postgres:15
    container_name: VanDAM_DB
    volumes:
      - ./bdatos:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: van_dam
      POSTGRES_PASSWORD: overclockserver
    restart: always
    networks:
      - vandam

  redis:
    image: redis:7
    container_name: VanDAM_REDIS
    restart: always
    networks:
      - vandam

volumes:
  db_data:

networks:
  vandam:
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8993:3214` | Puerto de acceso **interfaz Web** `:8993` |
| `./stl:/Diseños` | Ruta donde alojamos nuestros ficheros 3D `$HOME/docker/vandam/stl` y la ruta de la biblioteca que nos solicitara al iniciarse `/Diseños` |
| `SECRET_KEY_BASE: gED04yiDeyItG6e9GO/OPCd+IBFZOoAIFkM6/3ZllcI=` | Clave de cifrado base datos, **recomiendo cambiarla por la propia generada** |
| `./bdatos:/var/lib/postgresql/data` | Ruta donde almacena localmente la base datos |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:8993](http://localhost:8993){: .btn .btn--inverse .btn--small}{:target="_blank"}

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/vandam.mp4" type="video/mp4" />
   </video>
</div>

## Nginx Proxy Manager

Configuramos dominios y certificados:

<figure>
    <a href="/assets/images/posts/vandam.png"><img src="/assets/images/posts/vandam.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

> Y listo!
