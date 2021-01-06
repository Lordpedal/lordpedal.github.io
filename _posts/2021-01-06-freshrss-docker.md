---
title:  "FreshRSS: Docker"
date:   2021-01-06 18:30:00
last_modified_at: 2021-01-06T18:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png)
{: .full}

[FreshRSS](https://freshrss.org/){:target="_blank"} nos permitirá leer y seguir las novedades en diferentes sitios web de noticias, sin la necesidad de navegar de un sitio web a otro.

Es un agregador de canales RSS libre y ligero donde mantener al día y sincronizados vuestros feed RSS.

Veamos sus principales características:

 * RSS y agregación atómica.
 * Opción de marcar un enlace como favorito para leerlo más adelante.
 * Funcionalidades de búsqueda y filtro de ayuda.
 * Estadísticas para mostrarnos la frecuencia de publicación de todos los sitios web que seguimos.
 * Posibilidad de importar y exportar nuestros feeds a formato OPML
 * Disponibles de varios temas creados por la comunidad.
 * Se trata de una aplicación `responsive`, por lo que se adapta a todo tipo de pantallas.
 * Auto alojado: el código es libre, ya que utiliza una licencia AGPL3, por lo que podemos alojar nuestra propia instancia, que es justo lo que haremos en esta entrada.
 * Multiusuario.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/freshrss && \
cd $HOME/docker/freshrss
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/freshrss/docker-compose.yml
version: "2.1"
services:
  freshrss:
    image: ghcr.io/linuxserver/freshrss
    container_name: Freshrss
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - ~/docker/freshrss:/config
    ports:
      - 8087:80
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `~/docker/freshrss:/config` | Ruta donde almacenaremos la configuración |
| `8087:80` | Puerto de gestión web `8087` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendriamos el servicio disponible, y accederiamos con un navegador web a `http://ip_servidor:8087` para configurar el servidor como detallo a continuación.

Seleccionamos idioma y hacemos clic en **Ir al siguiente paso**

![FreshRSS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FreshRSS1.jpg)

El contenedor realiza un check de instalación, hacemos clic en **Ir al siguiente paso**

![FreshRSS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FreshRSS2.jpg)

Elegimos como base datos de almacenamiento `SQLite` y hacemos clic en **Enviar**

![FreshRSS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FreshRSS3.jpg)

Creamos un usuario y contraseña de gestión y hacemos clic en **Enviar**

![FreshRSS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FreshRSS4.jpg)

Instalación finalizada, hacemos clic en **Completar instalación**

![FreshRSS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FreshRSS5.jpg)

**TIP:** Si posteriormente queremos agregar extensiones adicionales, debemos de almacenarnos en la siguiente ruta `~/docker/freshrss/www/freshrss/extensions`
{: .notice--info}

> Y listo!
