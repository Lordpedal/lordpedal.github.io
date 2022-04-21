---
title:  "NPM GoAccess Addon: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2022-04-21 09:00:00
last_modified_at: 2022-04-21T21:15:00
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
[NPM](https://lordpedal.github.io/gnu/linux/docker/npm-docker/){: .btn .btn--warning .btn--small}{:target="_blank"} vimos que es un proxy inverso y sobre dicha base vamos a trabajar esta entrada.

Lo que vamos a realizar es la integración de [**GoAccess**](https://github.com/xavier-hernandez/goaccess-for-nginxproxymanager){:target="_blank"} mediante un docker sobre NPM, para poder consultar de forma detallada los logs de nuestros microservicios.

Los logs que consulta son los que siguen el siguiente patrón:

 - **proxy-host-*_access.log.gz**
 - **proxy-host-*_access.log**
 - **proxy-host-*.log**

Y gracias a ellos tendremos información muy útil de forma visual desde el **estado de consultas, número de visitantes, origen de visitantes, navegador usado, IP's, sistemas operativos, ...**

## Instalación

### NPM

[Requisito obligatorio tener instalado **Docker: NPM**](https://lordpedal.github.io/gnu/linux/docker/npm-docker/){: .btn .btn--warning}{:target="_blank"}

### GoAccess Addon

Vamos a tomar la base de configuración del docker de NPM para configurar el addon. En primer nos dirigimos a la ruta donde alojamos el proyecto:

```bash
cd $HOME/docker/npm
```

Hacemos un backup del fichero de configuración:

```bash
cp docker-compose.yml docker-compose.old
```

Definimos un upgrade del mismo con las nuevas variables:

```bash
cat << EOF >> $HOME/docker/npm/docker-compose.yml

  goaccess:
    image: xavierh/goaccess-for-nginxproxymanager:latest
    container_name: GoACCESS_NPM
    volumes:
      - './datos/logs/:/opt/log/:ro'
    ports:
      - '82:7880'
    environment:
      - PUID=0
      - PGID=0
      - TZ=Europe/Madrid
      - SKIP_ARCHIVED_LOGS=False
      - BASIC_AUTH=True
      - BASIC_AUTH_USERNAME=Empalador
      - BASIC_AUTH_PASSWORD=Nocturno
    restart: always
EOF
```

NOTA: Si quieres montar el servicio en una arquitectura **ARM** sustituye la variable **xavierh/goaccess-for-nginxproxymanager:latest** por **justsky/goaccess-for-nginxproxymanager:latest**
{: .notice--info}

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `./datos/logs/:/opt/log/:ro` | Ruta donde NPM almacena los logs y **consulta en modo lectura** |
| `82:7880` | Puerto de gestión **Web** `:82` |
| `PUID=0` | Habilitamos persmisos de **root** para consultar logs |
| `PGID=0` | Habilitamos persmisos de **root** para consultar logs |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `SKIP_ARCHIVED_LOGS=False` | Habilitamos consultar **todos los logs, incluso los comprimidos** |
| `BASIC_AUTH=True` | Habilitamos acceso con usuario y contraseña al servicio |
| `BASIC_AUTH_USERNAME=Empalador` | Usuario creado para acceso, **recomiendo cambiarlo** |
| `BASIC_AUTH_PASSWORD=Nocturno` | Contraseña creada para acceso, **recomiendo cambiarla** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos nuevamente el servicio para ser reconfigurado y ejecutado:

```bash
docker-compose up -d
```

Si consultamos el estado del docker, veremos que los logs han sido cargados:

<figure>
    <a href="/assets/images/posts/goaccess.png"><img src="/assets/images/posts/goaccess.png"></a>
</figure>

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:82](http://localhost:82){: .btn .btn--inverse .btn--small}{:target="_blank"}

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/goaccess.mp4" type="video/mp4" />
   </video>
</div>

## Nginx Proxy Manager

Configuramos dominios y certificados:

<figure>
    <a href="/assets/images/posts/goaccess2.png"><img src="/assets/images/posts/goaccess2.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

> Y listo!
