---
title:  "Docker: Debian GNU/Linux"
date:   2019-07-08 10:00:00 -0300
last_modified_at: 2020-12-15T17:00:00-05:00
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

![DockerLinux]({{ site.url }}{{ site.baseurl }}/assets/images/DockerLinux.png)
{: .full}
La idea detrás de `Docker` es la de poder crear portables, para que las aplicaciones de software puedan ejecutarse **en cualquier máquina con Docker instalado**, independientemente del sistema operativo y de que máquina tenga por debajo, facilitando así también su expansión.

Te preguntaras, si ya hemos instalado [KVM para poder correr máquinas virtuales](https://lordpedal.github.io/gnu/linux/debian-servidores-virtuales/){:target="_blank"} ¿**que me aporta Docker**? Pues realmente el concepto es algo similar, pero **un contenedor no es lo mismo que una máquina virtual**. Un contenedor es más ligero, ya que mientras que a una máquina virtual necesitas instalarle un sistema operativo para funcionar, un contenedor de Docker funciona utilizando el sistema operativo que tiene la máquina en la que se ejecuta el contenedor.

## Docker Hub: Fix GNU/Linux

[Docker Hub](https://hub.docker.com/){:target="_blank"} recientemente actualizo su política de cuentas y accesos, limitando especialmente la creación de servicios Docker sin cuenta de usuario y nos podríamos encontrar con este fallo:

```bash
docker: Error response from daemon: toomanyrequests: You have reached your pull rate limit. 
You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit.
See 'docker run --help'.
```

Por lo que si no queremos tener excesivas limitaciones, crearemos una cuenta [FREE](https://www.docker.com/pricing){:target="_blank"}, con la cual tendremos las siguientes ventajas:

- Repositorios públicos ilimitados
- Gestión de usuarios con controles de acceso basados en roles
- 1 equipo y 3 miembros del equipo
- 200 solicitudes de imágenes de contenedores cada 6 horas
- Autenticación de dos factores

> Proceso de configuración:

**1º** Creamos una cuenta: Elegimos un usuario, vinculamos un correo electrónico y definimos una contraseña de acceso

**2º** Dentro del servicio, hacemos clic en nuestra configuración de cuenta

**3º** Hacemos clic en Seguridad y proporcionamos un nuevo Token de acceso

**4º** Asignamos un nombre al acceso Token y lo creamos

**5º** Anotamos el Token generado y cerramos la web **(recordar que el Token no podremos volver a visionarlo)**

Sobre la terminal de nuestro sistema GNU/Linux en el que queremos configurar la cuenta de Docker, lanzamos la siguiente estructura de comando en la terminal:  

```bash
docker login -u usuario -p token
```

> Muestro ejemplo de configuración:

```bash
docker login -u lordpedal \
-p d5587907-4519-4519-4519-d55879074519
```
## Docker CE + docker-compose

### Instalación AMD64

Realizada esta pequeña introducción vamos a meternos en faena, para ello empezaremos con actualizar repositorios e instalar dependencias y utilidades necesarias:

```bash
sudo apt-get update && sudo apt-get -y install apt-transport-https ca-certificates \
curl gnupg2 software-properties-common htop multitail locate net-tools \
open-vm-tools python3-pip
```

A continuación, vamos a agregar el repositorio de Docker y la clave GPC:

```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && \
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
```

Volvemos a actualizar repositorios del sistema e instalamos Docker:

```bash
sudo apt-get update && \
sudo apt-get -y install docker-ce docker-ce-cli containerd.io && \
sudo pip3 install docker-compose
```

Activamos permisos de ejecución a nuestro usuario del sistema evitando tener que elevar privilegios root para su ejecución:

```bash
sudo usermod -aG docker $USER
```

### Instalación ARM

Proceso de instalación docker en un placa SBC con procesador *ARM*. El proceso es casí identico al de un procesador x64 pero con un leve cambio.

```bash
sudo apt-get update && \
sudo apt-get -y install apt-transport-https \
ca-certificates curl gnupg2 software-properties-common
```

Obtenemos la clave de firma Docker para paquetes:

```bash
sudo curl -fsSL https://download.docker.com/linux/\
$(. /etc/os-release; echo "$ID")/gpg | \
sudo apt-key add -
```

Añadimos los repositorios oficiales:

```bash
sudo echo "deb [arch=armhf] \
https://download.docker.com/linux/\
$(. /etc/os-release; echo "$ID") \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list
```

Volvemos a actualizar repositorios del sistema e instalamos Docker:

```bash
sudo apt-get update && \
sudo apt-get -y install docker-ce && \
sudo pip3 install docker-compose
```

Confirmamos la creación del grupo Docker y activamos permisos de ejecución a nuestro usuario del sistema evitando tener que elevar privilegios root para su ejecución:

```bash
sudo groupadd docker && \
sudo usermod -aG docker $(whoami)
```

Y reiniciamos la placa **SBC (Raspberry, Odroid, ...)**:

```bash
sudo reboot
```

### GRUB: Fix Docker AMD64

Una vez instalado, tendremos que configurar nuestro Grub de arranque del sistema para habilitar la memoria compartida y swap del sistema:

```bash
sudo nano /etc/default/grub
```

Y debemos de buscar la linea `GRUB_CMDLINE_LINUX_DEFAULT`, muestro ejemplo en mi caso:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet"
```

Y **añadirle** en el texto entrecomillado `cgroup_enable=memory swapaccount=1`, quedando de la siguiente forma:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet cgroup_enable=memory swapaccount=1"
```

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, activamos los cambios en Grub:

```bash
sudo update-grub
```

Y reiniciamos el Servidor:

```bash
sudo reboot
```

Tras el reinicio podemos comprobar que esta todo debidamente instalado y disponible ejecutando `docker info`:

```bash
pi@overclock:~$ groups $USER
pi : pi adm tty dialout cdrom floppy sudo audio dip video plugdev netdev kvm libvirt libvirt-qemu docker

pi@overclock:~$ docker info
Containers: 3
 Running: 3
 Paused: 0
 Stopped: 0
Images: 3
Server Version: 18
Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Native Overlay Diff: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: bb75rjiervuvi9gjv9u043j
runc version: 2vfkdvnfvuf8v0vuj2i0j245ñlkñw97854ko
init version: fec1981
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.19.0-5-amd64
Operating System: Debian GNU/Linux 10 (buster)
OSType: linux
Architecture: x86_64
CPUs: 8
Total Memory: 31.31GiB
Name: overclock
Docker Root Dir: /var/lib/docker
Debug Mode (client): false
Debug Mode (server): false
Registry: https://index.docker.io/v1/
Labels:
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
Product License: Community Engine

pi@overclock:~$
```

Con el sistema preparado para emular entornos **Docker**, vamos a realizar unos preparativos para almacenar configuraciones y entornos en nuestra carpeta de usuario y posterior ejecución **scripts**.

```bash
cd $HOME && mkdir docker && cd $HOME/docker
```
## Docker: [Portainer CE](https://hub.docker.com/r/portainer/portainer-ce/){:target="_blank"}

La gestión de Docker en un comienzo se realiza desde **TTY**, pero vamos a habilitar un Docker para la gestión de forma web.

Portainer CE es una herramienta web open-source la cual se ejecuta ella misma como un container.

Tras ello vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/portainer_ce
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Portainer-CE \
	-v $HOME/docker/portainer_ce:/data \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-p 9000:9000 \
	--restart=always \
	portainer/portainer-ce
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/portainer_ce` | Ruta donde se almacena el contenido |
| `-v /var/run/docker.sock` | Ruta donde lee la configuración Dockers |
| `-p 9000` | Puerto de acceso Web `9000` |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio `Portainer CE` |

Tras haber lanzado el script, ya tendriamos el servicio disponible, y accederiamos con un navegador web a la ip:9000

Ahora debemos de configurarlo vía web, para ello entramos en un navegador web de nuestra red doméstica y apuntamos a la **dirección IP del servidor y el puerto 9000**, en mi caso:

```bash
http://192.168.1.90:9000
```

Se nos solicitara la creación de un **usuario y su contraseña**, tras rellenar los datos, hacemos click en `Create User`. En la siguiene pestaña que nos aparece, hacemos click en `Manage the local Docker environment` y posteriormente en `Connect`. 

Y listo, ya estara debidamente configurado para poder gestionar (**Arrancar, Detener, Reiniciar, Borrar, SSH, ...**) los Dockers futuros desde la web.

## Docker: [Watchtower](https://hub.docker.com/r/containrrr/watchtower/){:target="_blank"}

Watchtower es una aplicación que controlará tus contenedores Docker en funcionamiento y observará los cambios en las imágenes a partir de los cuales se iniciaron originalmente esos contenedores. Si la Watchtower detecta que una imagen ha cambiado, se reiniciará automáticamente el contenedor utilizando la nueva imagen.

```bash
docker run -d \
	--name=Watchtower \
	-v /var/run/docker.sock:/var/run/docker.sock \
	--restart=always \
	containrrr/watchtower
```

Los parámetros son mínimos pero vamos a detallarlos:

| Parámetro | Función |
| ------ | ------ |
| `-v /var/run/docker.sock` | Ruta donde lee la configuración Dockers |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio `Watchtower` |

## Docker: [Wireguard](https://hub.docker.com/r/linuxserver/wireguard/){:target="_blank"}

Wireguard es un aplicación de software completamente gratuita que nos permitirá establecer túneles VPN.

Este completo software incorpora todos los protocolos de comunicación y criptografía necesarios, para levantar una red privada virtual entre varios clientes y un servidor.

WireGuard proporciona mejor rendimiento que el protocolo **IPsec** y que **OpenVPN** (tanto en velocidad como en latencia de las conexiones).

```bash
docker run -d \
	--name=Wireguard \
	--cap-add=NET_ADMIN \
	--cap-add=SYS_MODULE \
	-e PUID=1000 \
	-e PGID=1000 \
	-e TZ=Europe/Madrid \
	-e SERVERURL=lordpedal.duckdns.org \
	-e SERVERPORT=51820 \
	-e PEERS=1 \
	-e PEERDNS=1.1.1.1 \
	-e INTERNAL_SUBNET=10.13.13.0 \
	-p 51820:51820/udp \
	-v $HOME/docker/wireguard:/config \
	-v /lib/modules:/lib/modules \
	--sysctl="net.ipv4.conf.all.src_valid_mark=1" \
	--restart=always \
	ghcr.io/linuxserver/wireguard
 ```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-p 51820/udp` | Puerto comunicación y protocolo
| `-e PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `-e SERVERURL=lordpedal.duckdns.org` | IP externa (nuestra DNS pública), si no tienes ninguna puedes usar la variable auto, entonces el contenedor tratata de determinar tu IP externa de forma automatica |
| `-e SERVERPORT=51820` | Puerto externo para el host de Docker. Usado en el servidor |
| -`e PEERS=1` | Numero de clientes VPN a crear.  Puedes usar el valor que necesites |
| `-e PEERDNS=1.1.1.1` | Servidor de DNS a usar, en el caso he configurado el de Cloudflare `1.1.1.1`, si el valor especificado es auto, entonces se usaran las DNS de CoreDNS |
| `-e INTERNAL_SUBNET=10.13.13.0` | Rango de subred interna para la comunicación entre el servidor y los clientes |
| `-v $HOME/docker/wireguard:/config` | Carpeta donde alojaremos los clientes (peers) creados |
| `-v /lib/modules:/lib/modules` | Mapea los modulos de nuestro sistema al contenedor |
| `--sysctl="...` | Requerido para el modo cliente. Si lo agregamos a sysctl.conf del sistema no sería necesario ejecutar esta orden |

Tras haber lanzado el servicio, navegamos a la carpeta donde se han creado los clientes de la *VPN*, si te fijas entre los ficheros dispones de uno de imagen que es un código [QR](https://es.wikipedia.org/wiki/C%C3%B3digo_QR){:target="_blank"}. Para facilitar por ejemplo la integración con la **App** de tu dispositivos móvil.

```bash
pi@overclock:~$ ls $HOME/docker/wireguard/peer1/
peer1.conf peer1.png privatekey-peer1 publickey-peer
```

Tan solo nos faltaría abrir el puerto en nuestro **Router** de y tendríamos de forma sencilla acceso `VPN` a nuestra casa.

## Docker: [OctoPrint](https://hub.docker.com/r/octoprint/octoprint/){:target="_blank"}

OctoPrint es una aplicación de controlador de impresión 3D de código abierto creada por Gina Häußge, desarrollada en Python.

OctoPrint fue bifurcado del laminador de impresión Cura y está disponible bajo la misma licencia AGPL.

Aunque en principio fue diseñado para ser ejecutado sobre una Raspberry Pi (**ARM**) es posible disfrutar de esta genial aplicación con otros medios.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/octoprint
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Octoprint \
	--device /dev/ttyACM0:/dev/ttyACM0
	-p 5000:5000 \
	-v $HOME/docker/octoprint:/home/octoprint \ 
 	--restart=always \
	octoprint/octoprint
 ```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `--device /dev/ttyACM0:/dev/ttyACM0` | Puerto comunicación, para poder identificarlo, en la terminal de nuestro sistema ejecutamos: `ls /dev | grep tty` y nos devolverá seguramente  **/dev/ttyACM0** o **/dev/ttyUSB0** |
| `-p 5000:5000` | Puerto de acceso Web |
| `-v $HOME/docker/octoprint:/home/octoprint` | Carpeta donde alojaremos nuestros ficheros de la `VirtualSD` |

Tras haber lanzado el servicio, en nuestra intranet navegamos hacia la IP del servidor donde hemos instalado el servicio y el puerto que le hemos asignado `http://ip_servidor:5000` y completamos el asistente de configuración.

## Docker: [PrivateBin](https://hub.docker.com/r/privatebin/nginx-fpm-alpine/){:target="_blank"}

PrivateBin es un `«pastebin»` en línea minimalista de código abierto, donde el servidor no tiene ningún conocimiento de los datos guardados. 

Los datos son **cifrados/descifrados en el navegador usando un encriptado 256 bits AES**.

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/privatebin
```

Seguidamente descargamos el fichero de configuración del servicio:

```bash
curl -o $HOME/docker/privatebin/config.php \
https://raw.githubusercontent.com/PrivateBin/PrivateBin/master/cfg/conf.sample.php
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=PrivateBin \
	-e TZ=Europe/Madrid \
	-p 8080:8080 \
	-v $HOME/docker/privatebin/config.php:/srv/cfg/conf.php:ro \
	--read-only \
	--restart=always \
	privatebin/nginx-fpm-alpine
 ```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:


| Parámetro | Función |
| ------ | ------ |
| `-e TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `-p 8080:8080` | Puerto de acceso Web `8080` |
| `-v $HOME/docker/privatebin/config.php:/srv/cfg/conf.php:ro` | Fichero donde se aloja la configuración del servicio web |
| `--read-only` | Protege el servicio en modo lectura |

Tras haber lanzado el servicio, en nuestra intranet navegamos hacia la IP del servidor donde hemos instalado el servicio y el puerto que le hemos asignado `http://ip_servidor:8080`

## Docker: [Shaarli](https://hub.docker.com/r/shaarli/shaarli/){:target="_blank"}

Shaarli es un gestor de notas y enlaces que para uso personal.

Su principal uso podría ser:

- Para compartir, comentar y guardar enlaces y noticias interesantes
- Para marcar enlaces útiles / frecuentes y compartirlos entre computadoras
- Como una plataforma mínima de blog / microblog / escritura
- Como una lista para leer más tarde
- Para redactar y guardar artículos / publicaciones / ideas
- Para guardar notas, documentación y fragmentos de código
- Como un portapapeles / bloc de notas / pastebin compartido entre máquinas
- Como una lista de tareas pendientes
- Para almacenar listas de reproducción multimedia
- Para mantener extractos / comentarios de páginas web que puedan desaparecer
- Para realizar un seguimiento de las discusiones en curso
- Para alimentar otros blogs, agregadores, redes sociales … utilizando feeds RSS

Es un software muy ligero ya que no necesita de bases de datos para almacenar las entradas sino que es una aplicación de contenido estatico basada en PHP.

```bash
docker run -d \
	--name=Shaarli \
	-p 8000:80 \
	-e PUID=1000 \
	-e PGID=1000 \
	--restart=always \
	shaarli/shaarli:latest
 ```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-p 8000:80` | Puerto comunicación Externo:Interno |
| `-e PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |

Tras haber lanzado el servicio, accedemos `http://ip_servidor:8000` para completar el asistente de configuración.

## Docker: [Gossa](https://hub.docker.com/r/pldubouilh/gossa/){:target="_blank"}

Gossa es un microservicio que nos permite crear un servidor web «**colaborativo**» en línea minimalista de código abierto, desarrollado en lenguaje Go.

Desde la interfaz de usuario podremos entre otros:

- Navegar entre archivos/directorios
- Arrastrar y soltar para subir archivos/directorios
- Interactuar con archivos/carpeta: moverlos, renombrarlos, borrarlos
- Visualizar imágenes
- Reproducción video en streaming
- Editor de texto simple

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/gossa
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Gossa \
	-v $HOME/docker/gossa:/shared \
	-p 8001:8001 \
	--restart=always \
	pldubouilh/gossa
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/gossa:/shared` | Ruta donde se almacena el contenido |
| `-p 8001:8001` | Puerto de acceso Web `8001` |

Tras haber lanzado el servicio, tendriamos el servicio disponible en la dirección `http://ip_servidor:8001`.

| Teclas combinación | Acción |
| ------ | ------ |
| Ctrl/Meta + H | Muestra esta ayuda |
| Flechas dirección/Intro | Navega por ficheros/carpetas browse files/folders |
| Ctrl/Meta + C | Copia la URL al portapapeles |
| Ctrl/Meta + E | Renombra fichero/carpeta |
| Ctrl/Meta + Del | Borra fichero/carpeta |
| Ctrl/Meta + U | Subir nuevo fichero/carpeta |
| Ctrl/Meta + M | Crear un nuevo directorio |
| Ctrl/Meta + X | Corta la ruta seleccionada |
| Ctrl/Meta + V | Pegar la ruta prevamente cortada |
| Ctrl/Meta + Enter | Descargar fichero seleccionado |
| Click icono nueva carperta | Crear una nueva carpeta |
| Click icono editor textos | Editor fichero texto |
| Click icono fichero | Renombrar elemento |
| Doble click icono fichero | Borrar elemento |
| Arrastrar y soltar sobre UI | Mover elemento |
| Arrastrar y soltar contenido externo | Subir ficheros/carpetas |
| Cualquier otra letra 	Búsqueda |

## Docker: [Nginx](https://hub.docker.com/r/amd64/nginx/){:target="_blank"}

Nginx es un servidor web de código abierto que, desde su éxito inicial como servidor web, ahora también es usado como proxy inverso, cache de HTTP, y balanceador de carga.

Entre sus características podriamos destacar:

- Servidor de archivos estáticos, índices y autoindexado.
- Proxy inverso con opciones de caché.
- Balanceo de carga.
- Tolerancia a fallos.
- Soporte de HTTP y HTTP2 sobre SSL.
- Soporte para FastCGI con opciones de caché.
- Servidores virtuales basados en nombre y/o en dirección IP.
- Streaming de archivos FLV y MP4.
- Soporte para autenticación.
- Compatible con IPv6
- Soporte para protocolo SPDY
- Compresión gzip.
- Habilitado para soportar más de 10.000 conexiones simultáneas.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/nginx
```

Ahora vamos a crear un ejemplo básico de web:

```bash
cat << EOF > $HOME/docker/nginx/index.html
<HTML>
<HEAD>
<TITLE>Hola mundo</TITLE>
</HEAD>
<BODY>
<P>Hola Mundo</P>
</BODY>
</HTML>
EOF
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Nginx \
	-v $HOME/docker/nginx:/usr/share/nginx/html:ro \
	-p 8002:80 \
	--restart=always \
	amd64/nginx:alpine
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/nginx:/usr/share/nginx/html:ro` | Ruta donde se almacena el contenido de la web |
| `-p 8002:80` | Puerto de acceso Web `8002` |

Tras haber lanzado el servicio, accederiamos con un navegador web a la `http://ip_servidor:8002`

## Docker: [RSS Bridge](https://hub.docker.com/r/rssbridge/rss-bridge/){:target="_blank"}

RSS Bridge te permite obtener las novedades de servicios/webs que a priori no tienen esta opción habilitada.

Lo que te permite este genial microservicio es de poder acceder a la posibilidad de poder seguir usando tu **lector RSS favorito**.

Así podremos estar informados de las novedades sin necesidad de estar pendientes de visitar el sitio para ver si hay nuevas publicaciones.

Como por ejemplo:

- Telegram: Devuelve las últimas publicaciones de un canal
- Wikileaks: Recibir los últimos articulos publicados
- DuckDuckGo: Los resultados más recientes de búsquedad de este buscador
- Google: Los resultados más recientes de búsquedad de este buscador
- Thingiverse: Busqueda de contenido por categorías
- Github: Estar al día sobre los cambios en el servicio
- … (+260 "plugins" disponibles, consulta [Github](https://github.com/RSS-Bridge/rss-bridge/tree/master/bridges){:target="_blank"})

Vamos a crear las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/rss
```

Ahora vamos a crear una lista de plugins por defecto, a posterior editando el fichero podremos añadir/borrar otros

```bash
cat << EOF > $HOME/docker/rss/plugins.txt
TelegramBridge
WikiLeaksBridge
DuckDuckGoBridge
GoogleSearchBridge
WikipediaBridge
ThingiverseBridge
GithubSearchBridge
EOF
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=RSS-Bridge \
	-v $HOME/docker/rss/plugins.txt:/app/whitelist.txt \
	-p 8003:80 \
	--restart=always \
	rssbridge/rss-bridge:latest
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/rss/plugins.txt:/app/whitelist.txt` | Ruta donde se almacena el contenido de la web |
| `-p 8003:80` | Puerto de acceso Web `8003` |

Tras haber lanzado el servicio, accederiamos con un navegador web a la `http://ip_servidor:8003`

## Docker: [Calibre](https://hub.docker.com/r/linuxserver/calibre/){:target="_blank"}

Calibre es un **gestor y organizador de libros electrónicos** libre, que permite la conversión de numerosos formatos de archivos para libros electrónicos.

Lo que hace es almacenar los libros en una base de datos y nos permite a continuación buscar de manera muy precisa lo que estamos buscando.

Generalmente podemos almacenar los libros en base a muchos parámetros diferentes como el título, autor, editor o la fecha de publicación, de esta forma, nos resulta mucho más sencillo tener todo bien organizado.

Es un programa gracias al cual podemos convertir eBooks a diversos formatos.

- Formatos de entrada: **ePub, HTML, PDF, RTF, txt, cbc, fb2, lit, MOBI, ODT, prc, pdb, PML, RB, cbz y cbr**
- Formatos de salida: **ePub, fb2, OEB, lit, lrf, MOBI, pdb, pml, rb.3**

Vamos a crear las carpetas donde alojar el proyecto::

```bash
mkdir -p $HOME/docker/calibre
```

A continuación, vamos a crear una contraseña codificada en formato md5 para poder acceder a la gestión remota, recuerda sustituir la palabra contraseña por la contraseña que quieras usar:

```bash
echo -n contraseña | openssl md5
```

Adjunto ejemplo de mi sistema y apuntamos el valor para anotarlo en la variable -e GUAC_PASS:

```bash
pi@overclock:~$ echo -n calibre | openssl md5
(stdin)= fccc8f9fde7b6108c5f1932d7e9da5b1
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Calibre \
	-e PUID=1000 \
	-e PGID=1000 \
	-e TZ=Europe/Madrid \
	-e GUAC_USER=calibre \
	-e GUAC_PASS=fccc8f9fde7b6108c5f1932d7e9da5b1 `#MD5` \
	-p 8085:8080 \
	-p 8086:8081 \
	-v $HOME/docker/calibre/config:/config \
	--restart=always \
	ghcr.io/linuxserver/calibre
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-e UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `-e GUAC_USER=calibre` | Usuario `calibre` para entorno de gestión |
| `-e GUAC_PASS=fccc...` | Contraseña `calibre` en formato md5 para entorno de gestión |
| `-p 8085:8080` | Puerto de acceso Escritorio `8085` |
| `-p 8086:8081` | Puerto configuración Servidor `8086` |
| `-v $HOME/docker/calibre/config` | Ruta donde almacenaremos la **base de datos** y la **librería** |
|  `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio `Calibre` |

Tras haber lanzado el servicio, accederiamos con un navegador web a la `http://ip_servidor:8005` para completar el asistente de instalación.

## Docker: [Shairport-sync](https://hub.docker.com/r/kevineye/shairport-sync/){:target="_blank"}

Shairport-sync es un reproductor de audio AirPlay, que reproduce el audio transmitido por iTunes, iOS, Apple TV, … y su vez desde fuentes AirPlay como Quicktime Player y Forked-daapd, entre otros.

El audio reproducido por un dispositivo alimentado por Shairport-sync se mantiene sincronizado con la fuente y, por lo tanto, con dispositivos similares que reproducen la misma fuente.

Funciona en GNU/Linux, FreeBSD y OpenBSD, basado en la versión 1.0 del protocolo no es compatible con la transmisión de vídeo, fotos ni audio multiroom (implementado en protocolo AirPlay 2.0)

La creación del servicio es muy sencilla, tan solo ejecutaremos:

```bash
docker run -d \
	--name=Shairport-sync \
	--net host \
	--device /dev/snd \
	-e AIRPLAY_NAME=Overclock \
	--restart=always \
	kevineye/shairport-sync 
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `--net host` | Habilitamos el uso de la red host en vez de una virtual para docker |
| `--device /dev/snd` | Damos privilegios a docker para usar la salida de sonido del host |
| `-e AIRPLAY_NAME=Overclock` | Nombre personalizado para identificar servicio AirPlay |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrión vuelva a cargar el servicio |

Tras haber lanzado el script, ya tendríamos disponible el servicio en nuestra red WiFi.

## Docker: [P3DNS](https://github.com/Lordpedal/p3dns/){:target="_blank"}

Es un proyecto en el que he estado trabajando, para segurizar nuestras conexiones domésticas a nivel de DNS.

Es un docker que integra las siguientes herramientas:

- [Pi-Hole](https://pi-hole.net/){:target="_blank"}: Conjunto de aplicaciones de entornos GNU/Linux, que van a darnos lugar a proveer una capa extra de seguridad en la web: **bloqueo de publicidad y entornos maliciosos de la red**.
- [DNScrypt-Proxy](https://github.com/DNSCrypt/dnscrypt-proxy){:target="_blank"}: Aplicación **proxy de cifrado mediante diferentes protocolos de criptogafía** de las peticiones DNS.
- [Cloudflared](https://github.com/cloudflare/cloudflared){:target="_blank"}: Aplicación de **cifrado DoH (DNS over HTTPS)** de las peticiones DNS.

Primeramente vamos a preparar el entorno, en primer lugar satisfacemos dependencias y creamos la carpeta donde alojar el proyecto:

```bash
sudo apt-get update && \
sudo apt-get -y install curl && \
mkdir -p $HOME/docker && \
cd $HOME/docker
```
Clonamos el repositorio de P3DNS alojado en Github:

```bash
git clone https://github.com/Lordpedal/p3dns
```

Accedemos a la carpeta, le damos permisos de ejecución al script de configuración y lo ejecutamos:

```bash
cd p3dns && chmod +x configurar.sh && ./configurar.sh
```

El script nos va a preguntar por el puerto web que usara para su gestión y posteriormente la contraseña de acceso admin, dejo ejemplo:

```bash
pi@overclock:~/docker/p3dns$ ./configurar.sh
Configurando Docker: Pi-hole
Puerto web para gestion Pi-hole (recomendado 83): 83
Contraseña web para gestion Pi-hole (por defecto lordpedal): lordpedal
P3DNS: Configurado
```

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Ahora para activar nuestro servidor de DNS, asignamos nuestro localhost como servidor de resolución DNS y protegemos el fichero contra escritura:

```bash
sudo mv /etc/resolv.conf /etc/resolv.conf.p3 && \
echo "nameserver 127.0.0.1" | sudo tee -a /etc/resolv.conf && \
sudo chattr +i /etc/resolv.conf
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de `http://IP_Servidor:83` en mi caso.

**Opcionalmente** dejo las listas de anti-publicidad que uso en Pi-Hole por si os interesan:

```bash
https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
https://mirror1.malwaredomains.com/files/justdomains
http://sysctl.org/cameleon/hosts
https://s3.amazonaws.com/lists.disconnect.me/simple_tracking.txt
https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt
https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-gambling/hosts
https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt
https://raw.githubusercontent.com/anudeepND/blacklist/master/CoinMiner.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt
https://zerodot1.gitlab.io/CoinBlockerLists/list.txt
https://zerodot1.gitlab.io/CoinBlockerLists/list_browser.txt
https://zerodot1.gitlab.io/CoinBlockerLists/list_optional.txt
https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardMobileAds.txt
https://raw.githubusercontent.com/r-a-y/mobile-hosts/master/AdguardMobileSpyware.txt
https://raw.githubusercontent.com/jerryn70/GoodbyeAds/master/Hosts/GoodbyeAds.txt
https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt
https://ransomwaretracker.abuse.ch/downloads/RW_DOMBL.txt
https://ransomwaretracker.abuse.ch/downloads/CW_C2_DOMBL.txt
https://ransomwaretracker.abuse.ch/downloads/LY_C2_DOMBL.txt
https://ransomwaretracker.abuse.ch/downloads/TC_C2_DOMBL.txt
https://ransomwaretracker.abuse.ch/downloads/TL_C2_DOMBL.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/adaway.org/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/adblock-nocoin-list/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/adguard-simplified/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/anudeepnd-adservers/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/disconnect.me-ad/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/disconnect.me-malvertising/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/disconnect.me-malware/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/disconnect.me-tracking/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/easylist/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/easyprivacy/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/eth-phishing-detect/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/fademind-add.2o7net/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/fademind-add.dead/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/fademind-add.risk/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/fademind-add.spam/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/kadhosts/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/malwaredomainlist.com/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/malwaredomains.com-immortaldomains/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/malwaredomains.com-justdomains/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/matomo.org-spammers/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/mitchellkrogza-badd-boyz-hosts/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/pgl.yoyo.org/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/ransomwaretracker.abuse.ch/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/someonewhocares.org/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/spam404.com/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/stevenblack/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/winhelp2002.mvps.org/list.txt
https://raw.githubusercontent.com/hectorm/hmirror/master/data/zerodot1-coinblockerlists-browser/list.txt
https://www.stopforumspam.com/downloads/toxic_domains_whole.txt
```

Una forma de saber que todo esta debidamente trabajando, podemos consultar la web de [Cloudflare](https://www.cloudflare.com/ssl/encrypted-sni/){:target="_blank"} realizar un test al navegador y realizar un test en [DNS Leak Test](https://www.dnsleaktest.com/){:target="_blank"} para consultar la seguridad de nuestra DNS.

## Docker: [File Browser](https://hub.docker.com/r/filebrowser/filebrowser/){:target="_blank"}

File Browser es un tipo de software que crea una propia nube en nuestro servidor, dirigirlo a una ruta y luego acceder a sus archivos a través de una interfaz web agradable.

Al usar el *Servidor* en modo `headless` quizas una de las cosas que cierta gente echa en falta, es tener un explorador de archivos con el que poder realizar tareas básicas, en resumen una forma cómoda y visual de trabajar.

File Browser suple esa necesidad permitiendo el acceso a los archivos del servidor mediante el navegador web:

- **Crear/renombrar/copiar/mover/visualizar/editar y eliminar archivos**
- **Crear/renombrar/copiar/mover y eliminar carpetas**
- **Buscar/descargar/subir y compartir contenido**
- **Terminal de sistema**

La creación del servicio es muy sencilla, tan solo ejecutaremos:

```bash
docker run -d \
	--name=Filebrowser \
	-p 84:80 \
	-v /home/$USER:/srv \
	-e TZ="Europe/Madrid" \
	--restart=always \
	filebrowser/filebrowser:latest 
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-p 84:80` | Puerto de gestión Web `84` |
| `-v /home/$USER:/srv` | Ruta base de navegación home de nuestro usuario del sistema |
| `-e TZ="Europe/Madrid"` | Zona horaria `Europa/Madrid` |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrión vuelva a cargar el servicio |

Tras haber lanzado el comando, ya tendriamos el servicio disponible, y accederiamos con un navegador web a la dirección `http://IP_Servidor:84`, los datos de acceso iniciales son **admin:admin**

## Docker: [Heimdall](https://hub.docker.com/r/linuxserver/heimdall/){:target="_blank"}

Heimdall es una forma de organizar todos esos enlaces a sus sitios web y aplicaciones web más utilizados de una manera sencilla.

La simplicidad es la clave de Heimdall. ¿Por qué no utilizarlo como página de inicio de su navegador? Incluso tiene la capacidad de incluir una barra de búsqueda usando DuckDuckGo, Google o Bing.

Una vez que agregas una aplicación al tablero a través de su interfaz fácil, puedes arrastrar y soltar para mover los botones como mejor te parezca, incluso también puedes crear diferentes páginas para ordenar las aplicaciones aún más.

Preparamos el entorno de trabajo:

```bash
mkdir -p $HOME/docker/heimdall
```

Y lanzamos la creación del servicio, tan solo ejecutaremos:

```bash
docker run -d \
	--name=Heimdall \
	-e PUID=1000 \
	-e PGID=1000 \
	-e TZ=Europe/Madrid \
	-p 88:80 \
	-p 448:443 \
	-v $HOME/docker/heimdall:/config \
	--restart always \
	ghcr.io/linuxserver/heimdall
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-e PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e TZ="Europe/Madrid"` | Zona horaria `Europa/Madrid` |
| `-p 88:80` | Puerto de gestión Web `88` |
| `-p 448:443` | Puerto de gestión Web SSL `448` |
| `-v $HOME/docker/heimdall:/config` | Ruta base de navegación home de nuestro usuario del sistema |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrión vuelva a cargar el servicio |

Tras haber lanzado el comando, ya tendriamos el servicio disponible, y accederiamos con un navegador web a la dirección `http://IP_Servidor:88`

## Docker: [Jellyfin](https://hub.docker.com/r/linuxserver/jellyfin/){:target="_blank"}

Jellyfin es un **servidor Multimedia** donde podremos tener todas nuestras películas, series, música, etc… Organizados y centralizados en un único lugar.

La gran ventaja de Jellyfin, no solo es que sea **100% Software Libre y gratuito**, sino que tenemos la total garantía que todo nuestro contenido Multimedia, así como nuestras fotos o vídeos domésticos, mantienen la total privacidad, ya que nuestro servidor de Jellyfin, en ningún caso se conectará a servidores de terceros del mismo modo que lo hace `Plex` o `Emby`.

Vamos a detallar como personalizar la creación y la posibilidad de utilizar la **aceleración por hardware**. 

En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/jellyfin
```

Consultamos el dispositivo de video disponibles en el sistema, para poder habilitar la aceleración por hardware, anotamos la ruta que posteriormente usaremos:

```bash
sudo lshw -c video && ls -l /dev/dri/
```

Adjunto ejemplo de mi sistema:

```bash
pi@overclock:~$ sudo lshw -c video && ls -l /dev/dri/
*-display
  description: VGA compatible controller
  product: HD Graphics 530
  vendor: Intel Corporation
  physical id: 2
  bus info: pci@0000:00:02.0
  version: 06
  width: 64 bits
  clock: 33MHz
  capabilities: pciexpress msi pm vga_controller bus_master cap_list rom
  configuration: driver=i915 latency=0
  resources: irq:137 memory:de000000-deffffff memory:c0000000-cfffffff ioport:f000(size=64) memory:c0000-dffff
total 0
crw-rw---- 1 root video 226, 0 sep 2 17:59 card0
crw-rw---- 1 root video 226, 64 sep 2 17:59 controlD64
crw-rw---- 1 root video 226, 128 sep 2 17:59 renderD128
```

Y ya podriamos lanzar la creación y activación del servicio para un Procesador de PC 64bits:

```bash
docker run -d \
	--name=Jellyfin \
	-e UID=1000 \
	-e GID=1000 \
	-p 8096:8096 \
	--device /dev/dri/renderD128:/dev/dri/renderD128 \
	--device /dev/dri/card0:/dev/dri/card0 \
	-v /media/rednas/NAS/LXC:/media \
	-v $HOME/docker/jellyfin/config:/config \
	-v $HOME/docker/jellyfin/cache:/cache \
	--restart=always \
	ghcr.io/linuxserver/jellyfin
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-e UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-p 8096:8096` | Puerto de acceso Web `8096` |
| `--device /dev/dri/renderD128` | Ruta resultante de consulta: `ls -l /dev/dri/render*` |
| `--device /dev/card0` | Ruta resultante de consulta: `ls -l /dev/dri/card*` |
| `-v /media/rednas/NAS/LXC` | Ruta donde tenemos almacenado el contenido multimedia y compartimos en Jellyfin |
| `-v $HOME/docker/jellyfin/config` | Ruta donde almacenaremos la **configuración** |
| `-v $HOME/docker/jellyfin/cache` | Ruta donde almacenaremos la **cache** |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio Jellyfin |

Tras haber lanzado el script, ya tendriamos el servicio disponible, y accederiamos con un navegador web a la `http://ip_Servidor:8096` para iniciar el asistente de configuración.

Para habilitar acceleración por hardware, hacemos **login** con un usuario con privilegios de administrador, entramos en:

> Panel de Control -> Reproducción -> Video Acceleration API (VAAPI) 

Seleccionamos el dispositivo `VAAPI`, en mi caso **/dev/dri/renderD128**

### M3U

Entraremos en `Panel de Control -> Televisión en directo -> Sintonizadores -> M3U Tuner -> Archivo o URL -> añadimos nuestra lista`, en mi caso a modo de ejemplo dejo listas de TDT/Radio en abierto:

```bash
https://www.tdtchannels.com/lists/tvradio.m3u8
```

Y hacemos click en **guardar**.

### EPG

Entraremos en `Panel de Control -> Televisión en directo -> Proveedores de guías -> XMLTV -> Archivo o URL -> añadimos nuestra programación`, en mi caso a modo de ejemplo dejo la guía para la lista añadida previamente:

```bash
https://www.tdtchannels.com/epg/TV.xml
```

Y hacemos click en **guardar**.

>  Y listo!
