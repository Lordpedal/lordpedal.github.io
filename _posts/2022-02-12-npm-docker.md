---
title:  "Nginx Proxy Manager: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2022-02-11 21:30:00
last_modified_at: 2022-02-11T21:45:00
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
[Nginx Proxy Manager](https://nginxproxymanager.com/){: .btn .btn--warning .btn--small}{:target="_blank"} en adelante **NPM**, es un *Proxy inverso* con el cual podremos redirigir las solicitudes a las distintas aplicaciones del sistema a un servicio web.

Integra una sencilla gestión sobre los certificados **SSL**, usando por ejemplo **Let's Encrypt** como autoridad certificadora para acceso *https* y con renovación de forma automatizada de los mismos.

Es una alternativa a [Traefik](https://lordpedal.github.io/docker/traefikv1-docker/){: .btn .btn--info .btn--small}{:target="_blank"} y como ambos usan los mismos puertos de comunicación externos no son compatibles en el mismo sistema.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/npm && \
cd $HOME/docker/npm
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/npm/docker-compose.yml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: NginxProxy
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    environment:
      DB_MYSQL_HOST: "db"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: "npm"
      DB_MYSQL_PASSWORD: "npm"
      DB_MYSQL_NAME: "npm"
    volumes:
      - ./datos:/data
      - ./certificados:/etc/letsencrypt
    restart: always

  db:
    image: 'jc21/mariadb-aria:latest'
    container_name: MariaDB_NPM
    environment:
      MYSQL_ROOT_PASSWORD: 'npm'
      MYSQL_DATABASE: 'npm'
      MYSQL_USER: 'npm'
      MYSQL_PASSWORD: 'npm'
    volumes:
      - ./bdatos:/var/lib/mysql
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `80:80` | Puerto de comunicación público |
| `81:81` | Puerto de acceso **interfaz Web configuración** |
| `443:443` | Puerto de comunicación público con certificados **SSL** |
| `Parametros MYSQL` | Usuario, contraseña, ruta y puerto comunicación **Base de datos** |
| `./datos:/data` | Ruta donde almacena la **configuración** |
| `./certificados:/etc/letsencrypt` | Ruta donde almacena los **certificados SSL** |
| `./bdatos:/var/lib/mysql` | Ruta donde almacena la **Base de datos** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

## Configuración

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:81](http://localhost:81){: .btn .btn--inverse .btn--small}{:target="_blank"}

NOTA: El usuario por defecto para el primer acceso es **admin@example.com** y la contraseña **changeme** 
{: .notice--info}

### General

**En desarrollo**

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm01.mp4" type="video/mp4" />
   </video>
</div>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm02.mp4" type="video/mp4" />
   </video>
</div>

### Certificados

**En desarrollo**

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm03.mp4" type="video/mp4" />
   </video>
</div>

<figure>
    <a href="/assets/images/posts/npm03.png"><img src="/assets/images/posts/npm03.png"></a>
</figure>

### Servicios

**En desarrollo**

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm04.mp4" type="video/mp4" />
   </video>
</div>

<figure class="half">
    <a href="/assets/images/posts/npm04.png"><img src="/assets/images/posts/npm04.png"></a>
    <a href="/assets/images/posts/npm05.png"><img src="/assets/images/posts/npm05.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

> Y listo!
