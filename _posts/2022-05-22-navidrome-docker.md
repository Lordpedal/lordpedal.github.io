---
title:  "Navidrome: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2022-05-22 10:00:00
last_modified_at: 2022-05-22T21:00:00
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
[Navidrome](https://www.navidrome.org/){: .btn .btn--warning .btn--small}{:target="_blank"} es un servidor de música personal.

Gracias a este microservicio dispondremos de nuestra colección de música de forma sencilla y remota.
 
La dinámica de uso es muy sencilla, tan solo definimos la ruta donde alojamos los audios que queremos reproducir remotamente y listo.

Las principales características son:

 - Consumo de recursos muy bajo, diseñado en lenguaje `Go`.
 - Compatible con cualquiera de los clientes desarrollados para Subsonic o Airsonic.
 - Capaz de gestionar grandes colecciones de música.
 - Reproduce practicamente cualquier formato de audio disponible.
 - Gestiona de forma genial la meta información de cada uno de los archivos.
 - Multi usuario.
 - Monitoriza de forma automática la librería en busca de cambios.
 - Sencillo pero eficaz reproductor web.
 - Soporta el transcodificado al vuelo.
 - Soporta listas y ademas te permite importar listas en formato m3u.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/navidrome/{datos,musica} && \
cd $HOME/docker/navidrome
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/navidrome/docker-compose.yml
version: '3'
services:
  navidrome:
    image: deluan/navidrome:latest
    container_name: Navidrome
    user: 1000:1000
    ports:
      - 4533:4533
    environment:
      ND_SCANSCHEDULE: "1h"
      ND_LOGLEVEL: "info"
      ND_SESSIONTIMEOUT: "24h"
      ND_UIWELCOMEMESSAGE: "Another fine release by Lordpedal"
      ND_DEFAULTTHEME: "Dark"
      ND_ENABLECOVERANIMATION: "true"
      ND_ENABLEDOWNLOADS: "true"
      ND_DEVACTIVITYPANEL: "false"
    volumes:
      - './datos:/data'
      - './musica:/music:ro'
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `user: 1000:1000` | Corresponde al PID y GID de nuestro usuario `id` |
| `4533:4533` | Puerto de acceso **interfaz Web** `:4533` |
| `ND_SCANSCHEDULE: 1h` | Definimos la frecuencia de `refresco base de datos` |
| `ND_LOGLEVEL: info` | Nivel detalle `log` |
| `ND_SESSIONTIMEOUT: 24h` | Tiempo que se mantendra la sesión abierta |
| `ND_UIWELCOMEMESSAGE: Another fine release by Lordpedal` | Mensaje de bienvenida |
| `ND_DEFAULTTHEME: Dark` | Tema `oscuro` por defecto |
| `ND_ENABLECOVERANIMATION: true` | Habilita animación de `portadas` |
| `ND_ENABLEDOWNLOADS: true` | Habilita la opción de `descargas` |
| `ND_DEVACTIVITYPANEL: false` | Desactiva el panel de desarrollo, reduce carga del servicio |
| `./datos:/data` | Ruta donde almacena localmente la base datos |
| `./musica:/music:ro` | Ruta donde almacenamos las canciones |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:4533](http://localhost:4533){: .btn .btn--inverse .btn--small}{:target="_blank"}

Durante el primer acceso se nos solicitara la creación de un usuario con privilegios `admin`, posteriormente podremos añadir más usuarios.

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/navidrome.mp4" type="video/mp4" />
   </video>
</div>

Una vez finalizado el proceso de personalización nos puede quedar algo similar a este ejemplo:

<figure>
    <a href="/assets/images/posts/navi1.png"><img src="/assets/images/posts/navi1.png"></a>
</figure>

## Nginx Proxy Manager

Configuramos dominios y certificados que posteriormente usaremos para conectarnos en remoto:

<figure>
    <a href="/assets/images/posts/navidrome.png"><img src="/assets/images/posts/navidrome.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

## Clientes: iOS / Android

Existen varias aplicaciones compatibles con él pero recomiendo `substreamer` por su perfecta integración.

Tan solo definimos el dominio que usamos en remoto y el usuario para hacer login:

<figure class="half">
    <a href="/assets/images/posts/navi2.png"><img src="/assets/images/posts/navi2.png"></a>
    <a href="/assets/images/posts/navi3.png"><img src="/assets/images/posts/navi3.png"></a>
</figure>

> Y listo!
