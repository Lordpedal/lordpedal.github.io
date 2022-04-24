---
title:  "Matrix Pushbits Addon: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2022-04-24 17:00:00
last_modified_at: 2022-04-24T22:15:00
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
[Matrix](https://lordpedal.github.io/gnu/linux/docker/matrix-docker/){: .btn .btn--warning .btn--small}{:target="_blank"} vimos que es una red abierta para una comunicación segura y descentralizada.

Lo que vamos a realizar es la integración de [**Pushbits**](https://github.com/pushbits){:target="_blank"} mediante un docker sobre Matrix.

**Pushbits** es un servidor de retransmisión para notificaciones push. Nos va a permitir enviar notificaciones a través de una **API web** simple y las entrega a través de la red **Matrix**.

El proyecto aún continúa en desarrollo pero tiene un enorme potencial, desarrollado en lenguaje `Go`.

Es ideal para incluir notificaciones en nuestros scripts y desarrollar posibles bots. 

Como idea dejo las integraciones configuradas para la red **`Matrix`** en sustitución de *`Telegram`*:

 - Notificaciones del `sistema`
 - Notificaciones `Fail2ban`
 - Descargas `.torrent`
 - Eventos `Home Assistant`
 - `...` 

## Instalación

### Requisitos previos

 - [**Docker: Matrix**](https://lordpedal.github.io/gnu/linux/docker/matrix-docker/){: .btn .btn--info}{:target="_blank"}
 - [**Docker: NPM**](https://lordpedal.github.io/gnu/linux/docker/npm-docker/){: .btn .btn--info}{:target="_blank"}

NOTA: Adicionalmente vamos a crear un usuario en nuestra red **Matrix** que usaremos de mediador informativo, en nuestro caso **Morfeo**.
{: .notice--info}

### Pushbits Addon: Docker

Vamos a tomar la base de configuración del docker de Matrix para configurar el addon. En primer lugar creamos estructura adicional que usaremos para la creación del servicio:

```bash
mkdir -p $HOME/docker/matrix/datos
```

A continuación nos dirigimos a la ruta donde alojamos la configuración adicional:

```bash
cd $HOME/docker/matrix/datos
```

Creamos el fichero de configuración genérico del servicio:

```bash
cat << EOF > $HOME/docker/matrix/datos/config.yml
debug: false

http:
    # The address to listen on. If empty, listens on all available IP addresses of the system.
    listenaddress: ''

    # The port to listen on.
    port: 8080

database:
    # Currently sqlite3 and mysql are supported.
    dialect: 'sqlite3'

    # For sqlite3, specifies the database file. For mysql, specifies the connection string. Check out
    # https://github.com/go-sql-driver/mysql#dsn-data-source-name for details.
    connection: 'pushbits.db'

admin:
    # The username of the initial admin.
    name: 'admin'

    # The password of the initial admin.
    password: 'admin'

    # The Matrix ID of the initial admin, where notifications for that admin are sent to.
    # [required]
    matrixid: ''

matrix:
    # The Matrix server to use for sending notifications.
    homeserver: 'https://matrix.org'

    # The username of the Matrix account to send notifications from.
    # [required]
    username: ''

    # The password of the Matrix account to send notifications from.
    # [required]
    password: ''

security:
    # Wether or not to check for weak passwords using HIBP.
    checkhibp: false

crypto:
    # Configuration of the KDF for password storage. Do not change unless you know what you are doing!
    argon2:
        memory: 131072
        iterations: 4
        parallelism: 4
        saltlength: 16
        keylength: 32

formatting:
    # Whether to use colored titles based on the message priority (<0: grey, 0-3: default, 4-10: yellow, 10-20: orange, >20: red).
    coloredtitle: false
EOF
```

Y creamos el fichero de base de datos con permisos de nuestro usuario de sistema:

```bash
touch pushbits.db
```

Volvemos al directorio raíz de nuestro docker y hacemos un backup del fichero de configuración:

```bash
cd $HOME/docker/matrix && \
cp docker-compose.yml docker-compose.old
```

Definimos un upgrade del mismo con las nuevas variables:

```bash
cat << EOF >> $HOME/docker/matrix/docker-compose.yml

  pushbits:
    image: ghcr.io/pushbits/server:latest
    container_name: Pushbits
    ports:
      - '8080:8080'
    environment:
      PUSHBITS_DATABASE_DIALECT: 'sqlite3'
      PUSHBITS_HTTP_PORT: '8080'
      PUSHBITS_ADMIN_NAME: 'Empalador'
      PUSHBITS_ADMIN_PASSWORD: 'Nocturno'
      PUSHBITS_MATRIX_HOMESERVER: 'https://minipc.lordpedal.duckdns.org'
      PUSHBITS_ADMIN_MATRIXID: '@lordpedal:minipc.lordpedal.duckdns.org'
      PUSHBITS_MATRIX_USERNAME: 'morfeo'
      PUSHBITS_MATRIX_PASSWORD: 'GrOundHOG'
    volumes:
      - '/etc/localtime:/etc/localtime:ro'
      - '/etc/timezone:/etc/timezone:ro'
      - './datos:/data'
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8080:8080` | Puerto de notificaciones **Push** `:8080` |
| `PUSHBITS_DATABASE_DIALECT: sqlite3` | Definimos tipo base datos a usar, `./datos/config.yml` |
| `PUSHBITS_HTTP_PORT: 8080` | Definimos puerto notificaciones a usar, `./datos/config.yml` |
| `PUSHBITS_ADMIN_NAME: Empalador` | Creamos usuario admin Pushbits, `./datos/config.yml` **Recomiendo cambiar** |
| `PUSHBITS_ADMIN_PASSWORD: Nocturno` | Contraseña usuario admin Pushbits, `./datos/config.yml` **Recomiendo cambiar** |
| `PUSHBITS_MATRIX_HOMESERVER: https://minipc.lordpedal.duckdns.org` | Dirección de nuestro servidor Matrix a usar, **Necesario sustituir** |
| `PUSHBITS_ADMIN_MATRIXID: @lordpedal:minipc.lordpedal.duckdns.org` | Usuario de nuestro servidor que va a recibir notificaciones, **Necesario sustituir** |
| `PUSHBITS_MATRIX_USERNAME: morfeo` | Usuario adicional que creamos en los requisitos previos para enviar notificaciones, **Necesario sustituir** |
| `PUSHBITS_MATRIX_PASSWORD: GrOundHOG` | Contraseña usuario adicional para enviar notificaciones, **Necesario sustituir** |
| `/etc/localtime:/etc/localtime:ro` | Clona hora del sistema anfitrión `(solo lectura)` |
| `/etc/timezone:/etc/timezone:ro` | Clona zona horaria del sistema anfitrión `(solo lectura)` |
| `./datos: data` | Ruta donde almacena la base datos y consultas |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos nuevamente el servicio para ser reconfigurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la siguiente dirección [http://192.168.1.90:8080](http://localhost:8080){: .btn .btn--inverse .btn--small}{:target="_blank"}

NOTA: Al consultar el servicio lo único que obtienes es el código de error **404 page not found**, tranquilo en esta fase de desarrollo aún no dispone de interfaz de estado web.
{: .notice--info}

### Nginx Proxy Manager

Configuramos dominios y certificados:

<figure>
    <a href="/assets/images/posts/pushbits.png"><img src="/assets/images/posts/pushbits.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

### Pushbits Addon: CLI

Para poder usar el servicio de notificaciones necesitamos de dos requisitos en Matrix:

 - Una `SALA` de comunicación
 - Un `TOKEN` de dicha sala para poder interactuar con el servicio

Para obtener ambos parámetros usaremos una aplicación de terminal adicional. En el momento de escribir esta entrada la release [**v0.0.2**](https://github.com/pushbits/cli){:target="_blank"} que es la que usaremos.

Nos volvemos a dirigr a la ruta donde alojamos la configuración del proyecto:

```bash
cd $HOME/docker/matrix/datos
```

Descargamos y descomprimimos el paquete compilado elegido, en nuestro caso usaremos arquitectura PC 64bits:

```bash
wget https://github.com/pushbits/cli/releases/download/v0.0.2/cli_0.0.2_linux_amd64.tar.gz && \
tar -xf 'cli_0.0.2_linux_amd64.tar.gz'
```

Damos permisos de ejecución al fichero de configuración:

```bash
chmod +x cli
```

Procedemos a crear la sala y obtener el token con los datos que hemos ido creando en el proyecto:

```bash
./cli application create Matrix --url https://pushbits.lordpedal.duckdns.org --username Empalador
```

Vamos a repasar el comando para poder adaptarlo a nuestro sistema sin problemas:

| Parámetro | Función |
| ------ | ------ |
| `.cli application create Matrix` | Creamos la **Sala** `Matrix` |
| `--url https://pushbits.lordpedal.duckdns.org` | Dirección del servicio `Pushbits` creado en **NPM** |
| `--username Empalador` | Usuario admin de Pushbits que definimos en `docker-compose.yml` |
{: .notice--warning}


Adjunto ejemplo de la ejecución completa del comando previo:

```bash
pi@overclock:~/docker/matrix/datos$ ./cli application create Matrix --url https://pushbits.lordpedal.duckdns.org --username Empalador
Current password of user Empalador: Nocturno
{
	"id": 1,
	"name": "Matrix",
	"token": "Z3JvdW5kaG9kIGRheQ=="
}
```

NOTA: Anotamos el `token` para uso posterior en nuestros scripts.
{: .notice--info}

Tras ejecutarlo en nuestra aplicación de mensajeria Matrix veremos como el usuario que definimos en el `@lordpedal:minipc.lordpedal.duckdns.org` para ser notificados, recibira una invitación a la sala **Matrix** recien creada.

## Notificación

Vamos a enviar un comando de prueba para comprobar que todo esta debidamente configurado:

```bash
curl \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"message":"La IP del dispositivo es '$(hostname -I | awk '{print $1}')'","title":"Overclock Server"}' \
    "https://pushbits.lordpedal.duckdns.org/message?token=Z3JvdW5kaG9kIGRheQ=="
``` 

NOTA: Sustituye el valor `https://pushbits.lordpedal.duckdns.org/message?token=Z3JvdW5kaG9kIGRheQ==` por tu servidor y el token del mismo.
{: .notice--warning}

<figure>
    <a href="/assets/images/posts/pushbits2.png"><img src="/assets/images/posts/pushbits2.png"></a>
</figure>

> Y listo!
