---
title:  "TubeSync: Docker"
date:   2021-03-26 23:30:00
last_modified_at: 2021-03-26T23:45:00
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
[TubeSync](https://github.com/meeb/tubesync){: .btn .btn--warning .btn--small}{:target="_blank"} es un `PVR` (*Personal Video Recorder*) diseñado inicialmente para `Youtube`, aunque según he leido en su código pensado para hacerlo más extensible a otras plataformas en un futuro.

`TubeSync` esta diseñado para sincronizar canales y listas de reproducción de Youtube a directorios locales y con posibilidad de actualizar el Servidor de medios (**miniDLNA, Jellyfin, ...**) una vez la descarga ha finalizado.

La aplicación en si, es un contenedor con una `interfaz web` que integra `youtube-dl` y `ffmpeg` con un `programador de tareas`.

La **ventaja** de usar este contenedor es que por ejemplo tiene reintentos graduales de fallos con temporizadores de retroceso para que los medios que no se descarguen se reintentan durante un periodo prolongado.

El **inconveniente** es que en el momento de escribir esta entrada solo esta soportado por arquitecturas AMD64 y no soporta ARM en el momento de publicar la entrada (*en desarrollo*).

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/tubesync/{config,descargas} && \
cd $HOME/docker/tubesync
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/tubesync/docker-compose.yml
version: '2'
services:
  tubesync:
    image: ghcr.io/meeb/tubesync:latest
    container_name: TubeSync
    ports:
      - 4848:4848
    volumes:
      - '~/docker/tubesync/config:/config'
      - '~/docker/tubesync/descargas:/downloads'
    environment:
      - TZ=Europe/Madrid
      - PUID=1000
      - PGID=1000
      - HTTP_USER=empalador
      - HTTP_PASS=nocturno
      - TUBESYNC_DEBUG=True
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `4848:4848` | Puerto de acceso interfaz Web `:4848` |
| `~/docker/tubesync/config:/config` | Ruta donde almacena **Base de datos** |
| `~/docker/tubesync/descargas:/downloads` | Ruta donde almacena las **Descargas** |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `HTTP_USER=empalador` | Usuario de acceso a interfaz web, **recomiendo cambiar** |
| `HTTP_PASS=nocturno` | Contraseña de acceso a interfaz web, **recomiendo cambiar** |
| `TUBESYNC_DEBUG=True` | Habilitamos el modo `Debug`, recordar que es una aplicación en desarrollo |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:4848](http://localhost:4848){: .btn .btn--inverse .btn--small}{:target="_blank"}.

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/tubesync1.jpg"></a>
</figure>

Haciendo clic en `Sources`, añadimos las fuentes de descargas: Canal o lista:

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/tubesync2.jpg"></a>
</figure>

Haciendo clic en `Media` podremos ver las desargas finalizadas:

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/tubesync3.jpg"></a>
</figure>

Haciendo clic en `Tasks` podremos ver la cola de espera y en caso de producirse error el estado en que se encuentra:

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/tubesync4.jpg"></a>
</figure>

Haciendo clic en `Media Servers` podremos integrar las descargas con nuestro Servidor Multimedia (*en desarrollo*):

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/tubesync5.jpg"></a>
</figure>

> Y listo!
