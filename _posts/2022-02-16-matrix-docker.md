---
title:  "Matrix: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2022-02-16 20:00:00
last_modified_at: 2022-04-28T21:00:00
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
[Matrix](https://matrix.org/){: .btn .btn--warning .btn--small}{:target="_blank"} una red abierta para una comunicación segura y descentralizada.

Sencillo y contundente eslogan, para presentar un estándar de código abierto en ofrecer sistemas de comunicación descentralizados, cifrados y en tiempo real.

En Matrix, cada mensaje enviado pasa por el servidor local de cada uno de los participantes en la conversación. 

Sus creadores afirman que esta es la mejor forma de democratizar el control de los usuarios sobre sus comunicaciones, sin que haya un único punto de control por el que pasen los mensajes.

En esta entrada vamos a centrarnos en crear un servidor propio de comunicación con acceso a la red federada de forma sencilla.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/matrix/riot && \
cd $HOME/docker/matrix
```

Importante aclarar que antes de continuar, que debemos de elegir un nombre dominio para su alojamiento, en mi caso he seleccionado **minipc.lordpedal.duckdns.org** y el tutorial se basa en él. **Importante** comentar que el proyecto genera claves de cifrado en base a él.
{: .notice--info}

### Configuración Servidor

Comenzamos creando los ficheros de configuración del servicio, para ello usaremos la siguiente plantilla:

NOTA: Si quieres montar el servicio en una arquitectura **ARM** sustituye la variable **matrixdotorg/synapse:latest** por **black0/synapse:latest**
{: .notice--info}

```bash
docker run -it --rm \
        -v $HOME/docker/matrix/config:/data \
        --name=Matrix \
        -e SYNAPSE_SERVER_NAME=minipc.lordpedal.duckdns.org \
        -e SYNAPSE_REPORT_STATS=no \
        -e UID=1000 \
        -e GID=1000 \
        matrixdotorg/synapse:latest generate
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `$HOME/docker/matrix/config:/data` | Ruta donde aloja la **configuración** |
| `SYNAPSE_SERVER_NAME=minipc.lordpedal.duckdns.org` | Dominio elegido para publicar el proyecto, **IMPORTANTE SUSTITUIR** ya que las claves de cifrado se basan en él |
| `SYNAPSE_REPORT_STATS=no` | Desactivamos el reporte **anonimo de estadísticas** |
| `UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
{: .notice--warning}

Ahora llega el turno de cambiar los permisos de estructura, en mi caso a usuario sistema **pi**:

```bash
sudo chown pi:pi -R $HOME/docker/matrix && \
cd $HOME/docker/matrix/config
```

Entramos en la carpeta de configuración del servicio y editamos los parámetros para nuestro servidor:

```bash
cd $HOME/docker/matrix/config && \
nano homeserver.yaml
```

Empezamos buscando el apartado del cliente que posteriormente configuraremos en el fichero `docker-compose.yml`:

```bash
#web_client_location: https://riot.example.com/
```

Descomentamos la linea y especificamos un dominio de nuestro **DuckDNS**:

```bash
web_client_location: https://element.lordpedal.duckdns.org/
```

Activamos el acceso a la red federada mediante **HTTPS**:

```bash
#serve_server_wellknown: true
```

Para ello descomentamos la opción: 

```bash
serve_server_wellknown: true
```

Activamos la política del periodo retención de canales:

```bash
retention:
  #enabled: true
```

Para ello descomentamos la opción:

```bash
retention:
  enabled: true
```
 
Cambiamos la base datos por defecto **SQLite3** a **PostgreSQL** que posteriormente activaremos en `docker-compose.yml`:

```bash
database:
  name: sqlite3
  args:
    database: /data/homeserver.db
```

Comentamos la configuración por defecto y añadimos las siguientes variables:

```bash
#database:
#  name: sqlite3
#  args:
#    database: /data/homeserver.db

database:
  name: psycopg2
  args:
    user: synapse
    password: Matrix2kLordpedal
    database: synapse
    host: postgresql
    cp_min: 5
    cp_max: 10
```

Activamos la opción de registrar usuarios en nuestro servidor:

```bash
#enable_registration: false
```

Descomentamos la opción y cambiamos la orden:

```bash
enable_registration: true
enable_registration_without_verification: true
```

Activamos la opción de cuentas de invitado para consultar canales públicos:

```bash
#allow_guest_access: false
``` 

Descomentamos la opción y cambiamos la orden:

```bash
allow_guest_access: true
```

Activamos la opción de optimización de base datos **Redis**

```bash
redis:
  #enabled: true
  #host: localhost
  #port: 6379
```

Descomentando y configurandolo de la siguiente forma:

```bash
redis:
  enabled: true
  host: redis
  port: 6379
```

Guardamos el fichero con la combinación **CTRL + O** y salimos del editor **CTRL + X**

### Configuración Cliente

Toca el turno de configurar el cliente web que añadiremos a nuestro servidor, lanzando el siguiente comando:

```bash
nano $HOME/docker/matrix/riot/config.json
```

Y le añadimos el siguiente contenido:

```bash
{
  "default_server_config": {
    "m.homeserver": {
      "base_url": "https://minipc.lordpedal.duckdns.org",
      "server_name": "minipc.lordpedal.duckdns.org"
    },
    "m.identity_server": {
      "base_url": "https://vector.im"
    }
  },
  "disable_custom_urls": false,
  "disable_guests": false,
  "disable_login_language_selector": false,
  "disable_3pid_login": false,
  "brand": "Element",
  "integrations_ui_url": "https://scalar.vector.im/",
  "integrations_rest_url": "https://scalar.vector.im/api",
  "integrations_widgets_urls": [
    "https://scalar.vector.im/_matrix/integrations/v1",
    "https://scalar.vector.im/api",
    "https://scalar-staging.vector.im/_matrix/integrations/v1",
    "https://scalar-staging.vector.im/api",
    "https://scalar-staging.riot.im/scalar/api"
  ],
  "bug_report_endpoint_url": "https://riot.im/bugreports/submit",
  "defaultCountryCode": "ES",
  "showLabsSettings": false,
  "features": {
    "feature_new_spinner": "labs",
    "feature_pinning": "labs",
    "feature_custom_status": "labs",
    "feature_custom_tags": "labs",
    "feature_state_counters": "labs"
  },
  "default_federate": true,
  "default_theme": "ligth",
  "roomDirectory": {
    "servers": [
      "matrix.org",
      "gitter.im",
      "libera.chat"
    ]
  },
  "welcomeUserId": "@riot-bot:matrix.org",
  "piwik": {
    "url": "https://piwik.riot.im/",
    "whitelistedHSUrls": [
      "https://matrix.org"
    ],
    "whitelistedISUrls": [
      "https://vector.im",
      "https://matrix.org"
    ],
    "siteId": 1
  },
  "enable_presence_by_hs_url": {
    "https://matrix.org": false,
    "https://matrix-client.matrix.org": false
  },
  "settingDefaults": {
    "breadcrumbs": true
  },
  "jitsi": {
    "preferredDomain": "jitsi.riot.im"
  }
}
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `base_url: https://minipc.lordpedal.duckdns.org` | Ruta acceso servidor **IMPORTANTE CAMBIAR** |
| `server_name: https://minipc.lordpedal.duckdns.org` | Servidor Matrix **IMPORTANTE CAMBIAR** |
{: .notice--warning}

### Configuración docker-compose

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

NOTA: Si quieres montar el servicio en una arquitectura **ARM** sustituye la variable **matrixdotorg/synapse:latest** por **black0/synapse:latest**
{: .notice--info}

```bash
cat << EOF > $HOME/docker/matrix/docker-compose.yml
version: '2'
services:
  redis:
    image: "redis:latest"
    container_name: Redis_Matrix
    restart: always

  matrix:
    image: "docker.io/matrixdotorg/synapse:latest"
    container_name: Matrix
    ports:
      - 8008:8008
      - 8448:8448
    volumes:
      - "./config:/data"
    environment:
      - TZ=Europe/Madrid
      - UID=1000
      - GID=1000
      - SYNAPSE_SERVER_NAME=minipc.lordpedal.duckdns.org
      - SYNAPSE_REPORT_STATS=no
    restart: always

  postgresql:
    image: "postgres:latest"
    container_name: Matrix_DB
    environment:
      POSTGRES_DB: "synapse"
      POSTGRES_PASSWORD: "Matrix2kLordpedal"
      POSTGRES_USER: "synapse"
      POSTGRES_INITDB_ARGS: "--encoding='UTF8' --lc-collate='C' --lc-ctype='C'"
    volumes:
      - "./bdatos:/var/lib/postgresql/data"
    restart: always

  riot:
    image: "vectorim/element-web:latest"
    container_name: Matrix_Rio
    ports:
      - 8009:80
    volumes:
      - "./riot/config.json:/app/config.json:ro"
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8008:8008` | Puerto de comunicación público **SERVIDOR** |
| `8448:8448` | Puerto de comunicación **Red Federada** |
| `./config:/data` | Ruta donde aloja la configuración del **SERVIDOR** |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `SYNAPSE_SERVER_NAME=minipc.lordpedal.duckdns.org` | Dominio elegido para publicar el proyecto, **IMPORTANTE SUSTITUIR** ya que las claves de cifrado se basan en él |
| `SYNAPSE_REPORT_STATS=no` | Desactivamos el reporte **anonimo de estadísticas** |
| `Parametros POSTGRES` | Usuario, contraseña, ruta y puerto comunicación **Base de datos** |
| `./bdatos:/var/lib/postgresql/data` | Ruta donde aloja la **Base de datos** |
| `8009:80` | Puerto de comunicación público **CLIENTE** |
| `./riot/config.json:/app/config.json:ro` | Ruta donde almacena la configuración del **CLIENTE** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:8008/_matrix/static/](http://localhost:8008/_matrix/static/){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/matrix01.png"><img src="/assets/images/posts/matrix01.png"></a>
</figure>

### Nginx Proxy Manager

Configuramos dominios y certificados:

<figure class="half">
    <a href="/assets/images/posts/matrix02.png"><img src="/assets/images/posts/matrix02.png"></a>
    <a href="/assets/images/posts/matrix03.png"><img src="/assets/images/posts/matrix03.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

### Red Federada

Debemos de comprobar que el sistema esta debidamente configurado y con acceso a la red global con el siguiente test:

[Matrix Federation Tester](https://federationtester.matrix.org/){: .btn .btn--info .btn--large}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/matrix04.png"><img src="/assets/images/posts/matrix04.png"></a>
</figure>

### Cuentas usuario

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/matrix.mp4" type="video/mp4" />
   </video>
</div>

#### Desactivar registro cuentas

Una vez creadas las cuentas de usuario que necesitemos, recomiendo volver a desactivar la opción de registro de cuentas.

Para ello volvemos a editar el fichero de configuración del servidor:

```bash
cd $HOME/docker/matrix/config && \
nano homeserver.yaml
```

Buscamos la variable:

```bash
enable_registration: true
```

Y la desactivamos:

```bash
enable_registration: false
#enable_registration_without_verification: true
```

Guardamos el fichero con la combinación **CTRL + O**, salimos del editor **CTRL + X** y reiniciamos el servicio con las nuevas variables:

```bash
cd $HOME/docker/matrix && \
docker-compose restart
```

> Y listo!
