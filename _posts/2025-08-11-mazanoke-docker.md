---
title:  "Mazanoke: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2025-08-11 08:47:00
last_modified_at: 2025-08-11T09:02:00
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
[Mazanoke](https://github.com/civilblur/mazanoke/){: .btn .btn--warning .btn--small}{:target="_blank"} es una aplicación web auto-hospedable para optimizar imágenes directamente en tu navegador, sin necesidad de conexión a internet ni envío de archivos a servidores externos. Es ideal para quienes buscan una alternativa privada y sencilla a herramientas online que pueden comprometer la privacidad.

Características principales:

  - **Optimización local:** todo el procesamiento ocurre en tu dispositivo.
  - **Privacidad total:** no rastrea, no sube archivos, no requiere conexión.
  - **Conversión de formatos:** JPG, PNG, WebP, ICO, HEIC, AVIF, TIFF, GIF, SVG.
  - **Control de calidad:** ajusta compresión, tamaño objetivo, dimensiones máximas.
  - Modo oscuro/claro y diseño responsive.
  - Instalable como PWA (Aplicación Web Progresiva).

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/mazanoke && \
cd $HOME/docker/mazanoke
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/mazanoke/docker-compose.yml
#version: '3'
services:
  mazanoke:
    image: ghcr.io/civilblur/mazanoke:latest
    container_name: Mazanoke
    ports:
      - "1336:80"
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `1336:80` | Puerto de acceso **interfaz Web** `:1336` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:1336](http://localhost:1336){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/mazanoke.jpg"><img src="/assets/images/posts/mazanoke.jpg"></a>
</figure>

> Y listo!
