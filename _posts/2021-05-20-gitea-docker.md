---
title:  "Gitea: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-05-20 22:30:00
last_modified_at: 2021-05-20T22:45:00
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
[Gitea](https://gitea.io/en-us/){: .btn .btn--warning .btn--small}{:target="_blank"} es una aplicación que permite desplegar un servicio **Git** del estilo de *Github, Gitlab, Bitbucket* en tu propio servidor.

`Gitea` es multiplataforma y dispone de versiones precompiladas para los principales **Sistemas Operativos**, es una aplicación desarrollado en **Go**.

`Gitea` soporta autenticación de doble factor (two factor authentication), más funcionalidades relativas a la gestión del código, granularidad en los roles, firma de commits con GPG, restricción de push y merge a usuarios específicos, estado de integración con pipelines CI/CD externas, etc…

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/gitea/{config,bd} && \
cd $HOME/docker/gitea
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/gitea/docker-compose.yml
version: '3.7'
services:
  gitea:
    image: gitea/gitea:latest
    container_name: Gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - DB_TYPE=postgres
      - DB_HOST=db:5432
      - DB_NAME=gitea
      - DB_USER=gitea
      - DB_PASSWD=gitea
    restart: always
    volumes:
      - '~/docker/gitea/config:/data'
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "3022:22"
  db:
    image: postgres:alpine
    container_name: GiteaDB
    environment:
      - POSTGRES_USER=gitea
      - POSTGRES_PASSWORD=gitea
      - POSTGRES_DB=gitea
    restart: always
    volumes:
      - '~/docker/gitea/bd:/var/lib/postgresql/data'
    expose:
      - 5432
volumes:
  db_data:
  git_data:
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `USER_UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `USER_GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `3000:3000` | Puerto de acceso interfaz Web `:3000` |
| `3022:22` | Puerto de acceso gestión SSH `:3022` |
| `~/docker/gitea/config:/data` | Ruta donde almacena la **configuración** |
| `~/docker/gitea/bd:/var/lib/postgresql/data` | Ruta donde almacena la **base datos** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:3000](http://localhost:3000){: .btn .btn--inverse .btn--small}{:target="_blank"} y continuar con el asistente:

<figure>
    <a href="/assets/images/posts/gitea1.png"><img src="/assets/images/posts/gitea1.png"></a>
</figure>

Tras hacer clic en **Instalar Gitea**, lo próximo que veremos será la pantalla de Login con una bienvenida. 

Lo que hay que hacer es darle un clic en **Registro** y registrar una nueva cuenta. 

Importante definir que el primer usuario que se registre será administrador de Gitea:

<figure>
    <a href="/assets/images/posts/gitea2.png"><img src="/assets/images/posts/gitea2.png"></a>
</figure>

Adicionalmente podremos configurar ciertas opciones adicionales editando el fichero de configuración:

```bash
nano $HOME/docker/gitea/config/gitea/conf/app.ini
```

Entre algunas destaco las siguientes:

| Parámetro | Función |
| ------ | ------ |
| `DISABLE_REGISTRATION` | Deshabilitamos la opción de registrar nuevos usuarios, por defecto: `false` |
| `ENABLE_CAPTCHA` | Habilitamos la opción de código CAPTCHA, por defecto: `false` |
| `DEFAULT_KEEP_EMAIL_PRIVATE` | Habilitamos la opción de ocultar email, por defecto: `false` |
{: .notice--info}

Una vez configurado nuevas opciones, tendremos que reiniciar el contenedor:

```bash
docker-compose restart
```

<figure>
    <a href="/assets/images/posts/gitea3.png"><img src="/assets/images/posts/gitea3.png"></a>
</figure>

> Y listo!
