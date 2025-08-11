---
title:  "Pluto TV: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-11-10 23:30:00
last_modified_at: 2021-11-10T23:45:00
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
[Pluto TV](https://pluto.tv/){: .btn .btn--warning .btn--small}{:target="_blank"} es una plataforma para poder ver varios canales de **televisión online**.

Se trata de una plataforma de vídeo bajo demanda con anuncios, lo que quiere decir que mientras vemos el contenido aparecerán anuncios como pasa en la televisión clásica.

El lado positivo del hecho de que haya anuncios es que todo el contenido de la plataforma es totalmente gratuito.

Tiene una amplia variedad de programas de televisión, series y películas por streaming de manera completamente gratuita durante las 24 horas, los 7 días de la semana, con una experiencia de TV lineal y bajo demanda.

Su contenido puede ser visualizado online desde el propio navegador y en su soporte podemos ver que se encuentra portado como aplicación a un amplio espectro de dispositivos entre ellos: **iOS , Android, ...**

Pero quizás te pueda pasar hayas intentado integrarlo en tu servidor sin mucho exito, en ese caso continua leyendo.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/plutotv/datos && \
cd $HOME/docker/plutotv
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/plutotv/docker-compose.yml
version: '3.7'
services:
  plutotv:
    image: jonmaddox/pluto-for-channels
    container_name: PlutoTV
    ports:
      - "8085:80"
    environment:
      - VERSIONS=Casa,Red
    volumes:
      - '~/docker/plutotv/datos:/usr/share/nginx/html'
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8085:80` | Puerto gestión web `53842` |
| `VERSIONS=Casa,Red` | Creamos duplicado de datos para compartir entre diferentes elementos |
| `~/docker/plutotv/datos:/usr/share/nginx/html` | Ruta donde almacenamos los datos de **M3U** y **XML** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:8085](http://localhost:8085){: .btn .btn--inverse .btn--small}{:target="_blank"} y ya podría integrarlo por ejemplo en **Jellyfin** de forma simple.

<figure class="third">
    <a href="/assets/images/posts/plutotv1.jpg"><img src="/assets/images/posts/plutotv1.jpg"></a>
    <a href="/assets/images/posts/plutotv2.jpg"><img src="/assets/images/posts/plutotv2.jpg"></a>
    <a href="/assets/images/posts/plutotv3.jpg"><img src="/assets/images/posts/plutotv3.jpg"></a>
</figure>

> Y listo!
