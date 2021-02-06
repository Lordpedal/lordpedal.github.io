---
title:  "HASS: Docker"
date:   2021-02-06 23:30:00
last_modified_at: 2021-02-06T23:45:00
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
**Home Assistant** es un software de gestión de domótica para nuestro hogar capaz de integrar gran cantidad de dispositivos y servicios, tanto de terceros como propios. 

Lo mejor es, que aunque de evolución lenta, es un software de código abierto muy vivo desarrollado sobre **Python3**, con una comunidad enorme, potente y con una curva de aprendizaje muy buena.

Home Assistant es compatible con cientos de dispositivos, los más importantes son los siguiente:

 * Amazon Echo
 * Arduino
 * Belkin
 * Google Assistant y Google Cast (se pueden activar a través de Google Home)
 * IFTTT
 * IKEA
 * Xiaomi
 * Kodi
 * MQTT
 * nest
 * Philips Hue
 * PLEX
 * Dispositivos Z-Wave
 * ...

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/hass/config && \
cd $HOME/docker/hass
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/hass/docker-compose.yml
version: "2.1"
services:
  homeassistant:
    image: ghcr.io/linuxserver/homeassistant
    container_name: HomeAssistant
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - ~/docker/hass/config:/config
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `~/docker/hass/config:/config` | Ruta donde almacenamos los datos |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

A continuación debemos de entrar en el asistente de configuración, en mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:8123](https://lordpedal.github.io/gnu/linux/docker/hass-docker/){: .btn .btn--inverse .btn--small}

<figure class="half">
    <a href="/assets/images/posts/hass1.png"><img src="/assets/images/posts/hass1.png"></a>
    <a href="/assets/images/posts/hass2.png"><img src="/assets/images/posts/hass2.png"></a>
</figure>

<figure class="half">
    <a href="/assets/images/posts/hass3.png"><img src="/assets/images/posts/hass3.png"></a>
    <a href="/assets/images/posts/hass4.png"><img src="/assets/images/posts/hass4.png"></a>
</figure>


Por defecto viene configurado para *autodescubrir* configuraciones y automatizaciones, eso significa qué si integramos algún dispositivo por medio del asistente de integraciones, o mediante el archivo de configuración, automáticamente se nos mostrarán tarjetas e información en la pantalla principal (**Resumen**).

A parte, y desde el menú de la izquierda, dispondremos por defecto de las siguientes características:

 * Mapa: Un mapa a pantalla completa donde tendremos disponibles todos los dispositivos o personas que hayamos marcado para rastrear, así como distintas zonas que configuremos. Por ejemplo, una zona podría ser nuestra casa, y otra la oficina de trabajo. De esta manera, en Home Assistant nuestra pareja podría saber si estamos llegando a casa o estamos en un atasco.
 * Registro: Página para ver todos los cambios que han ocurrido en nuestras entidades a lo largo del tiempo a modo de log. Se puede filtrar para tener una visión más clara.
 * Historial: Página parecida a la pestaña Registro pero muestra los cambios de manera más gráfica en el tiempo.
 * Herramientas para desarrolladores: Es la parte más avanzada de este menú. Contiene registros y opciones para cambiar los distintos servicios, entidades, estados de las entidades, así como para crear plantillas y la propia información de Home Assistant como versión actual, log, e información del sistema.
 * Configuración: Desde aquí realizaremos toda la configuración de Home Assistant de una manera más gráfica. Tanto usuarios, como integraciones, áreas, personalización de entidades

> Y listo!
