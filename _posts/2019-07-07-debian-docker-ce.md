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

Una forma de saber que todo esta debidamente trabajando, podemos consultar la web de [Cloudflare](https://www.cloudflare.com/ssl/encrypted-sni/){:target="_blank"} realizar un test al navegador:

![P3DNS Cloud]({{ site.url }}{{ site.baseurl }}/assets/images/posts/p3dnscloud.jpg)

Y realizar un test en [DNS Leak Test](https://www.dnsleaktest.com/){:target="_blank"} para consultar la seguridad de nuestra DNS:

![P3DNS Leak]({{ site.url }}{{ site.baseurl }}/assets/images/posts/p3dnsleak.jpg)

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

> Lista M3U

Entraremos en `Panel de Control -> Televisión en directo -> Sintonizadores -> M3U Tuner -> Archivo o URL -> añadimos nuestra lista`, en mi caso a modo de ejemplo dejo listas de TDT/Radio en abierto:

```bash
https://www.tdtchannels.com/lists/tvradio.m3u8
```

Y hacemos click en **guardar**.

> Guía EPG

Entraremos en `Panel de Control -> Televisión en directo -> Proveedores de guías -> XMLTV -> Archivo o URL -> añadimos nuestra programación`, en mi caso a modo de ejemplo dejo la guía para la lista añadida previamente:

```bash
https://www.tdtchannels.com/epg/TV.xml
```

Y hacemos click en **guardar**.

## Docker: [TVHeadend](https://hub.docker.com/r/linuxserver/tvheadend/){:target="_blank"}

TVHeadend es una aplicación servidor gestionada por un interface web que puede recibir streams de vídeo de diferentes fuentes:

- Streams de IPTV por Internet.
- Señal de TDT recibida por una tarjeta de TDT PCI/USB.
- Señal de TV analógica recibida por una tarjeta de TV PCI/USB.
- Señal de TV por satélite recibida mediante una tarjeta SAT PCI/USB.
- Señal de televisión por cable.

Una vez configurados los streams de vídeo (que se corresponderían con los canales de TV), podremos entre otros:

- Grabarlos en un dispositivo de almacenamiento, funcionando como un PVR.
- Retransmitirlos a otros puntos de nuestra red o a Internet.
- Transcodificarlos a otro formato de vídeo.

TVHeadend, es software 100% libre y gratuito, cuyo código fuente lo puedes encontrar en [Github](https://github.com/tvheadend/tvheadend){:target="_blank"}.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/tvheadend/\
{config/{data,m3u},grabaciones}
```

Vamos a satisfacer dependencias que posteriormente usaremos:

```bash
sudo apt-get update && \
sudo apt-get -y install ffmpeg curl wget
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=TVHeadend \
	-e PUID=1000 \
	-e PGID=1000 \
	-e TZ=Europe/Madrid \
	-p 9981:9981 \
	-p 9982:9982 \
	-v /etc/timezone:/etc/timezone:ro \
	-v $HOME/docker/tvheadend/config:/config \
	-v $HOME/docker/tvheadend/grabaciones:/recordings \
	--restart=always \
	ghcr.io/linuxserver/tvheadend
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-e UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `-p 9981:9981` | Puerto de acceso Web `9981` |
| `-p 9982:9982` | Puerto de streaming `9982` |
| `-v /etc/timezone:/etc/timezone:ro` | Clonado en modo lectura: hora del host feat. hora del contenedor |
| `-v $HOME/docker/tvheadend/config:/config` | Ruta donde almacenaremos la configuración |
| `-v $HOME/docker/tvheadend/grabaciones:/recordings` | Ruta donde almacenaremos las grabaciones |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio TVHeadend |

Tras haber lanzado el script, ya tendriamos el servicio disponible, y accederiamos con un navegador web a `http://ip_servidor:9981` para configurar el servidor como detallo a continuación.

> **Configuration > General > Base**: Elegimos idioma Español, vista Experto y hacemos click en Guardar

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock1.png)

> **Configuración > Usuarios > Contraseñas**: Click en Añadir, elegimos un usuario/contraseña y hacemos click en Crear

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock2.png)

> **Configuración > Usuarios > Entradas de Acceso**: Editamos la configuración, sustituimos Usuario * por el que habiamos creado (empalador) y hacemos click en Guardar

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock3.png)

### Lista M3U

Dejo dos opciones ejemplo de listas M3U para ser importadas a nuestro servidor.

- M3U Personal:

```bash
curl -o $HOME/docker/tvheadend/config/m3u/lista.m3u \
https://lordpedal.github.io/lordpedal/lordpedal.m3u
```

- M3U TDT - Canales libres:

```bash
wget -qO $HOME/docker/tvheadend/config/m3u/lista.m3u \
https://www.tdtchannels.com/lists/tv.m3u8
```

Para la configuración, voy a usar mi lista personal.

Pero antes voy a desglosar la estructura de un canal de la lista *M3U*, para describir como **«automatizar»** en lo posible, todo el proceso de creación de `Muxes/Servicios/Canales` en TVHeadend.

```bash
#EXTINF:-1 tvh-epg="disable" tvh-chnum="1" tvg-id="1.movistar.tv" tvh-tags="Movistar TV|HDTV|Ocio y cultura" tvg-logo="https://lordpedal.github.io/lordpedal/images/2543.jpg",La 1 HD
http://192.168.1.90:2112/rtp/239.0.0.185:8208
```

| Parámetro | Función |
| ------ | ------ |
| `#EXTINF:-1` | Enlace Streaming |
| `tvh-epg="disable"` | Deshabilita el EPG scan |
| `tvh-chnum="1"` | Número de canal |
| `tvg-id="1.movistar.tv"` | ID interno EPG |
| `tvh-tags="Movistar TV|HDTV|Ocio y cultura"` | Categorías de canal |
| `tvg-logo="https://lordpedal.github.io/lordpedal/images/2543.jpg"` | Picon (logo) de canal |
| `La 1 HD` | Nombre canal |
| `http://192.168.1.90:2112/rtp/239.0.0.185:8208` | Enlace IP canal |

>  **Configuración > Entradas DVB > Redes**: Hacemos click en Añadir y seleccionamos Red automática IPTV

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock4.png)

Configuramos la red IPTV para que pueda realizar un escaneo de la misma y de esa forma agregar los Muxes. Al finalizar de configurar hacemos click en Crear

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock5.png)

El proceso llevara algún tiempo, dependiendo sobre todo del número de canales que incluya la lista

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock6.png)

> **Configuración > Entradas DVB > Redes**: Al finalizar el muxeado de canales, editamos la Red y hacemos click en Guardar

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock7.png)

> **Configuración > Entradas DVB > Servicios**: Hacemos click en Mapear todos los servicios

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock8.png)

En la ventana de dialogo emergente, click en Mapear Servicios

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock9.png)

Mostrara el proceso de convertir los Muxes en Servicios

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock10.png)

> **Configuración > Canal / EPG > Canales**: Hacemos click en Mapear todos los servicios

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock11.png)

En la ventana de dialogo emergente, click en Mapear Servicios

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock12.png)

### Guía EPG

Dejo tres opciones ejemplo de guías compatibles con el módulo Grabber, WebGrab+Plus XML incluido en el Docker.

- **EPG SAT - Movistar+, ServusTV, Sport1 & ZFDinfo**:

```bash
wget -qO $HOME/docker/tvheadend/config/data/\
guide.xml.gz \
https://github.com/MPAndrew/EpgGratis/raw/master/\
guide.xml.gz \
&& gunzip -f $HOME/docker/tvheadend/config/data/\
guide.xml.gz
```

- **EPG Personal**:

```bash
curl -o $HOME/docker/tvheadend/config/data/guide.xml \
https://lordpedal.github.io/lordpedal/guia.xml
```

- **EPG TDT - Canales libres**:

```bash
wget -qO $HOME/docker/tvheadend/config/data/\
guide.xml.gz \
https://www.tdtchannels.com/epg/\
TV.xml.gz && \
gunzip -f $HOME/docker/tvheadend/config/data/\
guide.xml.gz
```

Para la configuración, voy a usar mi EPG Personal. Para ello voy a crear un script para automatizar la alimentación de EPG a TVHeadend, preparamos el entorno de trabajo y abrimos editor:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
nano epg.sh
```

Añadimos el contenido del script:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
curl -o $HOME/docker/tvheadend/config/data/guide.xml \
https://lordpedal.github.io/lordpedal/guia.xml
```

Guardamos el fichero, salimos del editor, le damos permisos de ejecución y los ejecutamos para almacenar nuestra EPG localmente:

```bash
chmod +x epg.sh && ./epg.sh
```

Vamos a crear una tarea programa en cron para su ejecución en segundo plano:

```bash
crontab -e
```

Añadiendo el siguiente código al final del fichero para que sea ejecutado cada día las 9:45am:

```bash
45 9 * * * ~/scripts/epg.sh >/dev/null 2>&1
```

Guardamos, salimos del editor y pasamos nuevamente al navegador para seguir configurando el servidor.

> **Configuración > Canal / EPG > Módulos para Obtención de Guía**: Seleccionamos el grabber WebGrab+Plus XML y lo habilitamos

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock13.png)

Hacemos click en Guardar

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock14.png)

> **Configuración > Canal / EPG > Obtener Guía**: Configuramos el cron de TVHeadend para que la guía EPG la anexe a la programación a las 10am (la descarga la tenemos programada en el servidor a las 9:45am)

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock15.png)

Al finalizar de configurar la tarea cron, hacemos click en Volver a ejecutar los capturadores de EPG internos (el proceso se puede demorar unos minutos)

![TVHeadend Docker]({{ site.url }}{{ site.baseurl }}/assets/images/posts/tvheaddock16.png)

Con estos pasos ya tendremos configurado nuestro propio servidor de Televisión con un sencillo docker.

## Docker: [Transmission](https://hub.docker.com/r/linuxserver/transmission/){:target="_blank"}

[Transmission](https://transmissionbt.com/){:target="_blank"} es un **cliente P2P liviano y de código abierto para la red BitTorrent**.

Entre las principales características destacan:

- Descarga selectiva y priorización de archivos.
- Soporte para transmisiones cifradas.
- Soporte de múltiples trackers.
- Soporte para trackers HTTPS.
- Compatibilidad con enlaces Magnet.
- Bloqueo de IPs.
- Mapeo automático de puertos (usando UPnP/NAT-PMP).
- Auto-Ban de los clientes que envíen datos falsos.
- …

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/transmission/{config,descargas}
```

Y ya podriamos lanzar la creación y activación del servicio:

```bash
docker run -d \
	--name=Transmission \
	-e PUID=1000 \
	-e PGID=1000 \
	-e TZ=Europe/Madrid \
	-e USER=empalador \
	-e PASS=nocturno \
	-e TRANSMISSION_WEB_HOME=/kettu/ \
	-p 9091:9091 \
	-p 51413:51413 \
	-p 51413:51413/udp \
	-v $HOME/docker/transmission/config:/config \
	-v $HOME/docker/transmission/descargas:/downloads \
	-v $HOME/docker/transmission/descargas:/watch \
	--restart=always \
	ghcr.io/linuxserver/transmission
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-e UID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e GID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `-e TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `-e USER=empalador` | Usuario para hacer login en WebUI, te recomiendo modificarla | 
| `-e PASS=nocturno` | Contraseña del usuario para hacer login en WebUI, te recomiendo modificarla |
| `-e TRANSMISSION_WEB_HOME=/kettu/` | Skin que usaremos para gestión web. Disponibles tres skins: `/kettu/` , `/combustion-release/` y `/transmission-web-control/` O bien si no queremos usar ningún Skin extra, borramos la línea para no incluir la opción. |
| `-p 9091:9091` | Puerto de gestión WebUI `9091` |
| `-p 51413:51413` | Puerto descargas Torrents `TCP` |
| `-p 51413:51413/udp` | Puerto descargas Torrents `UDP` |
| `-v $HOME/docker/transmission/config:/config` | Ruta donde almacenaremos la **configuración** |
| `-v $HOME/docker/transmission/descargas:/downloads` | Ruta donde almacenaremos las **descargas**. |
| `-v $HOME/docker/transmission/descargas:/watch` | Ruta donde realiza **monitorizado** futuras descargas, si añadimos fichero .torrent este se descarga de forma automática. |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio Transmission |

Tras haber lanzado el servicio, ya tendriamos el servicio disponible, y accederiamos con un navegador web a `http://ip_Servidor:9091`

Opcionalmente podemos añadirle notificación de descargas, para ello antes debemos detener el contenedor:

```bash
docker stop Transmission
```

Vamos a crear un script en la máquina host para que lea las variables y actuar en consecuencia:

```bash
cd $HOME/docker/transmission/config && \
nano torrents.sh
```

Pegamos el siguiente contenido del script:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# ID Telegram (Consulta @Lordpedalbot)
telegram=79593223
# BOT
token=289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA
url=https://api.telegram.org/bot$token
# Variables
IPServidor=192.168.1.90
Puerto=9091
User=empalador
Pass=nocturno
SERVER="$IPServidor:$Puerto --auth $User:$Pass"
# Inicia secuencia
TORRENTLIST=`transmission-remote $SERVER --list | sed -e '1d;$d;s/^ *//' | cut --only-delimited --delimiter=" " --fields=1`
for TORRENTID in $TORRENTLIST
do
    DL_COMPLETED=`transmission-remote $SERVER --torrent $TORRENTID --info | grep "Percent Done: 100%"`
    STATE_STOPPED=`transmission-remote $SERVER --torrent $TORRENTID --info | grep "State: Seeding\|Stopped\|Finished\|Idle"`
    # Condicionales
    if [ "$DL_COMPLETED" ] && [ "$STATE_STOPPED" ]; then
        transmission-remote $SERVER --torrent $TORRENTID --remove
    else
        echo "Torrent #$TORRENTID no esta completo."
    fi
done
# Notificacion
/usr/bin/curl -s \
        -o /dev/null \
        -F chat_id="$telegram" \
        -F text="$TR_TORRENT_NAME descargado correctamente en la ruta $TR_TORRENT_DIR" \
        $url/sendMessage
```

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x $HOME/docker/transmission/config/torrents.sh
```
Vamos a revisar las variables que debemos de modificar en el script:

| Variable | Comentario |
| ------ | ------ |
| `telegram=79593223` | Sustiuimos el ID de nuestro telegram, puedes consultarlo en [@lordpedalbot](https://t.me/Lordpedalbot){:target="_blank"} |
| `IPServidor=192.168.1.90` | Dirección IP del servidor donde estamos ejecutando el servicio de Transmission |
| `User=empalador` | Usuario que definimos en la creación del **Docker Transmission** |
| `Pass=nocturno` | Contraseña que definimos en la creación del **Docker Transmission** |

Ahora le toca el turno a las opciones de Transmission, para ello editamos la configuración:

```bash
nano $HOME/docker/transmission/config/settings.json
```
Vamos a cambiar los parametros de la configuración stock a la modificada, se tiene que prestar atención a los signos de puntuación para evitar fallos de configuración:

| Configuración Stock | **Configuración Modificada** |
| ------ | ------ |
| `"alt-speed-down": 50,` | `"alt-speed-down": 32768,` |
| `"alt-speed-enabled": false,` | `"alt-speed-enabled": true,` |
| `"alt-speed-up": 50,` | `"alt-speed-up": 4096,` |
| `"blocklist-enabled": false,` | `"blocklist-enabled": true,` |
| `"blocklist-url": "http://www.example.com/blocklist",` | `"blocklist-url": "http://list.iblocklist.com/?list=bt_level1&fileformat=p2p&archiveformat=gz",` |
| `"download-dir": "/downloads/complete",` | `"download-dir": "/downloads",` |
| `"incomplete-dir": "/downloads/incomplete",` | `"incomplete-dir": "/downloads",` |
| `"port-forwarding-enabled": true,` | `"port-forwarding-enabled": false,` |
| `"script-torrent-done-enabled": false,` | `"script-torrent-done-enabled": true,` |
| `"script-torrent-done-filename": "",` | `"script-torrent-done-filename": "/config/torrents.sh",` |
| `"speed-limit-down": 100,` | `"speed-limit-down": 16384,` |
| `"speed-limit-down-enabled": false,` | `"speed-limit-down-enabled": true,` |
| `"speed-limit-up": 100,` | `"speed-limit-up": 2048,` |
| `"speed-limit-up-enabled": false,` | `"speed-limit-up-enabled": true,` |
| `"trash-original-torrent-files": false,` | `"trash-original-torrent-files": true,` |
| `"utp-enabled": false,` | `"utp-enabled": true,` |

Guardamos el fichero, salimos del editor y volvemos a iniciar el Docker ya debidamente configurado:

```bash
docker start Transmission
```

Con estos pasos ya tendremos configurado nuestro gestor de descargas `.Torrents` con un sencillo docker.

## Docker: [Nextcloud](https://hub.docker.com/r/linuxserver/nextcloud/){:target="_blank"}

[Nextcloud](https://nextcloud.com/){:target="_blank"} es un completo software que nos permitirá **sincronizar archivos, carpetas, calendarios y contactos entre múltiples dispositivos**.

Su funcionalidad es similar al software Dropbox, Google, … aunque es de tipo **código abierto**, permitiendo a quien lo desee instalarlo en un **servidor privado** y tener el **control total de todos sus datos**.

Centrado específicamente en **proporcionar a sus usuarios seguridad, privacidad y el control total de todos sus datos**, de tal forma que sean totalmente transparentes, ya que dichos datos se almacenan localmente en nuestra red local, no se suben a ninguna nube pública ni servidor externo si no queremos. 

**Nextcloud** es un proyecto que deriva de [ownCloud](https://owncloud.com/), que también es un software de servicio de alojamiento en la nube.

Entre las principales características destacan:

- Los archivos son almacenados en estructuras de directorio convencionales y se pueden acceder vía WebDAV si es necesario.
- Los archivos son encriptados en la transmisión y opcionalmente durante el almacenamiento.
- Los usuarios pueden manejar calendarios (CalDAV), contactos (CardDAV), tareas programadas y reproducir contenido multimedia (Ampache).
- Permite la administración de usuarios y grupos de usuarios (vía OpenID o LDAP) y definir permisos de acceso.
- Posibilidad de añadir aplicaciones (de un solo clic) y conexiones con Dropbox, Google Drive y Amazon S3.
- Disponibilidad de acceso a diferentes bases de datos mediante SQLite, MariaDB, MySQL y PostgreSQL.
- Posibilidad de integrar los editores en línea ONLYOFFICE mediante la aplicación oficial.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos la carpeta donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/nextcloud && \
cd $HOME/docker/nextcloud
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml`:

```bash
cat << EOF > $HOME/docker/nextcloud/docker-compose.yml
version: "2"
services:
  nextcloud:
    image: ghcr.io/linuxserver/nextcloud
    container_name: Nextcloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - ~/docker/nextcloud/config:/config
      - ~/docker/nextcloud/data:/data
    ports:
      - 9443:443
    restart: always
  mariadb:
    image: ghcr.io/linuxserver/mariadb
    container_name: MariaDB
    environment:
      - PUID=1000
      - PGID=1000
      - MYSQL_ROOT_PASSWORD=overclock_server
      - TZ=Europe/Madrid
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=lordpedal
    volumes:
      - ~/docker/nextcloud/mariadb:/config
    ports:
      - 3306:3306
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `MYSQL_ROOT_PASSWORD=overclock_server` | **Contraseña usuario ROOT** , necesaria para proteger la base de datos, **recomiendo cambiarla** |
| `MYSQL_PASSWORD=lordpedal` | **Contraseña Base de datos** para configurar el servicio y poder interactuar con la base de datos, **recomiendo cambiarla** |

Una vez configurado,  lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras haber lanzado el servicio, ya tendríamos el servicio disponible, y accederíamos con un navegador web a la `https://ip_del_host:9443` para iniciar asistente de instalación.

En mi caso a modo ejemplo:

> https://192.168.1.90:9443

Cuando la página cargue en el navegador nos arrojara la siguiente advertencia, que no es más que recordarnos que estamos haciendo la consulta de navegación con el protocolo **https** y no disponemos de los **certificados SSL**

![Nextcloud]({{ site.url }}{{ site.baseurl }}/assets/images/posts/cfgnextcloud0.jpg)

A continuación veremos el asistente de instalación, **desplegamos la opción que marco en rojo y elegimos MySQL/MariaDB como base de datos en vez de SQLite**:

![Nextcloud]({{ site.url }}{{ site.baseurl }}/assets/images/posts/cfgnextcloud1.jpg)

Ahora vamos a finalizar la configuración **sustituyendo los datos que se encuentran marcados en rojo, dejando el resto tal cual la imagen**, cuando este debidamente configurado hacemos clic en **Completar la instalación**

![Nextcloud]({{ site.url }}{{ site.baseurl }}/assets/images/posts/cfgnextcloud2.jpg)

Al finalizar ya tendremos nuestra propia nube de almacenamiento local de una forma muy sencilla.

![Nextcloud]({{ site.url }}{{ site.baseurl }}/assets/images/posts/cmoncloud.jpg)

### ⛑️Bonus TIP: Fix Traefik

Para poder acceder a nuestro servicio desde fuera de la intranet, por ejemplo con un proxy inverso, tenemos que configurar el redireccionado:

```bash
sudo nano ~/docker/nextcloud/config/www/nextcloud/config/config.php
```

Buscamos:

 ```bash
 array (
   0 => '192.168.1.90:9443',
 ),
 ```

Y añadimos nuestro enlace externo:

 ```bash
 array (
   0 => '192.168.1.90:9443',
   1 => 'nextcloud.lordpedal.duckdns.org',
 ),
 ```

Guardamos el fichero, salimos del editor y **reiniciamos el docker de Nextcloud** para que sea efectivo el cambio.

## Docker: [Traefik Maroilles](https://hub.docker.com/_/traefik/){:target="_blank"}

[Traefik](https://traefik.io/){:target="_blank"} es una herramienta muy interesante para utilizar como proxy inverso y balanceador de carga, que facilita el despliegue de microservicios.

Se integra con algunos componentes de nuestra infraestructura (**Docker, Docker Swarm, Kubernetes, …**) y se configura automáticamente leyendo sus metadatos.

**Traefik** esta desarrollado en lenguaje **Go** y también se nos ofrece como una imagen oficial de **Docker**.

En nuestro caso vamos a usar esta última por simplicidad, otro detalle de la configuración de este Docker es que las variables **backend hacen referencia a nuestra intranet** y las variables **frontend a la externa en internet**.

Cabe mencionar que **Traefik** se integra también con varios servidores de SSL para **generar sus certificados** (por ejemplo Let´s Encrypt) y nos puede gestionar fácilmente la terminación SSL y las redirecciones de un protocolo a otro.

En nuestro caso para aprovechar el servicio gratuito de generación de certificados Let´s Encrypt usaremos un certificado **wildcard para DuckDNS: Un certificado único que vale para todos los subdominios**.

En esta entrada vamos a configurar subdominios, para acceder desde fuera de nuestra intranet a estos servicios:

- [Jellyfin](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-jellyfin){:target="_blank"}: Puerto acceso intranet **ip_servidor:8096**
- [Jitsi](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-jitsi){:target="_blank"}: Puerto acceso intranet **ip_servidor:8443**
- [Nextcloud](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-nextcloud){:target="_blank"}: Puerto acceso intranet **ip_servidor:9443**

Como proxy inverso **no tendremos que abrir los puertos específicos de nuestros contenedores Docker en la NAT de nuestro Router**, sino que seran accesibles a traves de los puertos **80 (HTTP) y 443 (HTTPS)** que si deberemos de abrirlos antes de continuar (**específicamente TCP, no UDP**).

También aclarar que en caso de no usar esos servicios se deberían de eliminar las referencias a ellos del fichero de configuración `lordpedal.toml` o si queremos usar/añadir otros respetar la estructura de configuración.

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos la carpeta donde alojar el proyecto:

```bash
mkdir -p $HOME/docker && \
cd $HOME/docker
```

Clonamos el repositorio de Traefik que he alojado en Github:

```bash
git clone https://github.com/Lordpedal/traefik.git
```

Accedemos a la carpeta y le damos permisos de ejecución al script:

```
cd traefik && chmod +x traefik.sh
```

Ahora debemos de configurar el script con nuestros parámetros, que son basicamente estos:

- **Token DuckDNS**
- Identificar el **dominio para acceder al Dashboard** de Traefik  (frontend.rule)
- Identificar el **dominio SSL para acceder al Dashboard** de Traefik (frontend.headers.SSLHost)

Para ello editamos el fichero:

```bash
nano traefik.sh
```

Sustituimos obligatoriamente el valor Token de nuestro DuckDNS(**1111...**) y el nombre del mismo (**lordpedal.duckdns.org**) y opcionalmente el identificador dominio externo (**dashboard**):
 
```bash
-e DUCKDNS_TOKEN=11111111-1111-1111-1111-111111111111 \
-l traefik.frontend.rule=Host:dashboard.lordpedal.duckdns.org \
-l traefik.frontend.headers.SSLHost=dashboard.lordpedal.duckdns.org \
```

Guardamos el fichero, salimos del editor e instalamos la dependencia para seguir configurando:

```bash
sudo apt-get update && \
sudo apt-get -y install apache2-utils
```

Generamos una clave cifrada para acceder a nuestro Dashboard: `htpasswd -nb usuario contraseña` y la **reservamos para su posterior uso**. 

Como ejemplo dejo esta de prueba:

```bash
pi@overclock:~/docker/traefik$ htpasswd -nb lordpedal lordpedal
lordpedal:$apr1$82PqDBA.$K0.eDtWn34hwreIuGn4QU0
```

Abrimos el editor para configurar nuestras variables de servicio, marco en rojo las que debemos de cambiar y en verde las opcionales:

```bash
nano lordpedal.toml
```

Primeramente buscamos la cadena de usuario:clave y la sustituimos por la que hallamos generado de la variable entryPoints:

```bash
users = ["lordpedal:$apr1$82PqDBA.$K0.eDtWn34hwreIuGn4QU0"]
```

Sustituimos la dirección de email para generar los certificados SSL de la variable `acme`:

```bash
email = "lordpedal@protonmail.com"
```

Dominio wilcard de la variable `acme.domains`, recuerda sustituir **lordpedal** por tu dominio duckdns:

```bash
main = "*.lordpedal.duckdns.org"
```

Dominio de la `variable docker`, recuerda sustituir **lordpedal** por tu dominio duckdns:

```bash
domain = "lordpedal.duckdns.org"
```

IP de nuestro servidor donde estamos ejecutando **Jellyfin** de la variable **backend-jellyfin**:

```bash
url = "http://192.168.1.90:8096"
```

IP de nuestro servidor donde estamos ejecutando **Nextcloud** de la variable **backend-nextcloud**:

```bash
url = "http://192.168.1.90:9443"
```

IP de nuestro servidor donde estamos ejecutando **Jitsi** de la variable **backend-jitsi**:

```bash
url = "http://192.168.1.90:8443"
```

Dominios de nuestro servidor donde estemos ejecutando **Jellyfin** en las variables **frontend-jellyfin**, recuerda cambiar las variables `lordpedal`:

```bash
rule = "Host:jellyfin.lordpedal.duckdns.org"
SSLHost = "jellyfin.lordpedal.duckdns.org"
customFrameOptionsValue = "allow-from https://jellyfin.lordpedal.duckdns.org"
```

Dominios de nuestro servidor donde estemos ejecutando **Nextcloud** en las variables **frontend-nextcloud**, recuerda cambiar las variables `lordpedal`:

```bash
rule = "Host:nextcloud.lordpedal.duckdns.org"
SSLHost = "nextcloud.lordpedal.duckdns.org"
customFrameOptionsValue = "allow-from https://nextcloud.lordpedal.duckdns.org"
```

Dominios de nuestro servidor donde estemos ejecutando **Jitsi** en las variables **frontend-jitsi**, recuerda cambiar las variables `lordpedal`:

```bash
rule = "Host:jitsi.lordpedal.duckdns.org"
SSLHost = "jitsi.lordpedal.duckdns.org"
customFrameOptionsValue = "allow-from https://jitsi.lordpedal.duckdns.org"
```

Guardamos el fichero, salimos del editor, **creamos el fichero donde se almacenara nuestro certificado wildcard SSL autorenovable**:

```bash
touch acme.json && chmod 600 acme.json
```

Ejecutamos el script que va a crear nuestro docker ya debidamente configurado:

```bash
./traefik.sh
```

Al finalizar ya tendriamos accesibles desde fuera de la intranet:

- Jellyfin → https://jellyfin.lordpedal.duckdns.org
- Jitsi → https://jitsi.lordpedal.duckdns.org
- [Nextcloud: Fix Traefik](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#%EF%B8%8Fbonus-tip-fix-traefik){:target="_blank"} → https://nextcloud.lordpedal.duckdns.org

Si queremos comprobar la seguridad de nuestro servicio podemos por ejemplo consultar la web: [SSL Labs](https://www.ssllabs.com/index.html){:target="_blank"}

![Traefik]({{ site.url }}{{ site.baseurl }}/assets/images/posts/traefikssl.jpg)

## Docker: [MiniDLNA](https://hub.docker.com/r/lordpedal/minidlna/){:target="_blank"}

[MiniDLNA](https://github.com/Lordpedal/minidlna){:target="_blank"} informalmente conocido como ReadyMedia, es un servidor streaming que funcionará perfectamente en una máquina con pocos recursos.

**DLNA** es una interesante tecnología para compartir vídeo, música y imágenes entre los dispositivos conectados a nuestra red de manera sencilla.

Puedes utilizar cualquier cliente que admita los protocolos DLNA para transmitir archivos multimedia desde tu Servidor, como por ejemplo Kodi y VLC.

Vamos a preparar el entorno, en primer lugar satisfacemos dependencias y creamos la carpeta donde alojar el proyecto:

```bash
sudo apt-get update && \
sudo apt-get -y install wget && \
mkdir -p $HOME/docker/minidlna/{Descargas/Musica/Videos/Imagenes} && \
cd $HOME/docker/minidlna
```

Bajamos el fichero docker-compose.yml alojado en Github:

```bash
wget https://raw.githubusercontent.com/Lordpedal/minidlna/main/docker-compose.yml
```

Editamos las variables de configuración:

```bash
nano docker-compose.yml
```

| Parámetro | Función |
| ------ | ------ |
| `- '~/docker/minidlna/Descargas:/media/Descargas'` | Definimos ruta donde alojamos las descargas a compartir por Red. |
| `- '~/docker/minidlna/Musica:/media/Musica'` | Definimos ruta donde alojamos la Música a compartir por Red. |
| `- '~/docker/minidlna/Videos:/media/Videos'` | Definimos ruta donde alojamos los Vídeos a compartir por Red. |
| `- '~/docker/minidlna/Imagenes:/media/Imagenes'` | Definimos ruta donde alojamos las Imágenes a compartir por Red. |
| `- MINIDLNA_MEDIA_DIR_1=AVP,/media/Descargas` | En esta variable definimos que el contenido de la carpeta Descargas puede contener: **Audio, Video y/o Imágenes**, que es lo que significa **AVP** |
| `- MINIDLNA_MEDIA_DIR_2=A,/media/Musica` | Esta variable define que el contenido de la carpeta Música solo puede contener: **Audio**, que es lo que significa **A** |
| `- MINIDLNA_MEDIA_DIR_3=V,/media/Videos` | Esta variable define que el contenido de la carpeta Vídeos solo puede contener: **Video**, que es lo que significa **V** |
| `- MINIDLNA_MEDIA_DIR_4=P,/media/Imagenes` | Esta variable define que el contenido de la carpeta Imágenes solo puede contener: **Imágenes**, que es lo que significa **P** |
| `- MINIDLNA_FRIENDLY_NAME=Lordpedal DLNA` | Esta variable define como se identifica el servicio de DLNA en nuestra Red. |
| `- MINIDLNA_MAX_CONNECTIONS=7` | Esta variable define cuantos usuarios pueden reproducir el contenido DLNA al mismo tiempo en nuestra Red. |

> **TIP**: Puedes especificar culaquier variable del fichero [minidlna.conf](http://manpages.ubuntu.com/manpages/raring/man5/minidlna.conf.5.html){:target="_blank"}, añadiendo la variable `MINIDLNA_` al fichero `docker-compose.yml`

Guardamos el fichero, salimos del editor y ejecutamos la creación del servicio:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de `http://IP_Servidor:8200` y con la transmisión del contenido multimedia por la red local.

![DLNA]({{ site.url }}{{ site.baseurl }}/assets/images/posts/vlcdlna.jpg)

## Docker: [Shairport-sync](https://hub.docker.com/r/kevineye/shairport-sync/){:target="_blank"}

Shairport-sync es un reproductor de audio AirPlay, que reproduce el audio transmitido por iTunes, iOS, Apple TV, … y su vez desde fuentes AirPlay como Quicktime Player y [Forked-daapd](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-forked-daapd), entre otros.

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

![Shairport]({{ site.url }}{{ site.baseurl }}/assets/images/posts/shairport.jpg)

## Docker: [Forked-daapd](https://hub.docker.com/r/linuxserver/daapd/){:target="_blank"}

[Forked-daapd](https://github.com/mikebrady/shairport-sync){:target="_blank"} es un servidor multimedia para nuestra colección musical.

Basado en **DAAP** (`Digital Audio Access Protocol`), protocolo ideado por Apple, pero potenciado para convertir nuestro servidor compatible con: **iTunes, dispositivos comerciales preparados para trabajar con Airplay, clientes MPD, …**

En la anterior entrada comentamos que [Shairport-sync](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-shairport-sync) no era compatible con el protocolo `multiroom`, ahora gracias a este servidor podríamos emitir el mismo audio **emulando** multiroom reproduciendo la música en diferentes instancias de forma sincronizada.

La lista de clientes soportados, lo convierten en un servidor ideal:

- Clientes DAAP, como iTunes (OSX/Windows) o Rhythmbox (GNU/Linux)
- Clientes remotos, como Apple Remote (iOS) o compatibles para Android
- Dispositivos AirPlay, como AirPort Express, Shairport y altavoces comerciales
- Dispositivos Chromecast
- Clientes MPD, como mpc
- Clientes de flujo de red MP3, como VLC (Multiplataforma) y casi cualquier otro reproductor de música que soporte streaming
- Clientes RSP, como Roku Soundbridge

Lista de formatos soportados:

- **MPEG4**: mp4a, mp4v
- **AAC**: alac
- **MP3**: mpeg
- **FLAC**: flac
- **OGG VORBIS**: ogg
- **Musepack**: mpc
- **WMA**: wma (WMA Pro), wmal (WMA Lossless), wmav (WMA video)
- **AIFF**: aif
- **WAV**: wav
- **Monkey’s audio**: ape

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos la carpeta donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/daapd/{config,musica} && \
cd $HOME/docker/daapd
```

Ahora vamos a crear el fichero de configuración docker-compose.yml:

```bash
cat << EOF > $HOME/docker/daapd/docker-compose.yml
version: "2.1"
services:
  daapd:
    image: ghcr.io/linuxserver/daapd
    container_name: Forked-daapd
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - $HOME/docker/daapd/config:/config
      - $HOME/docker/daapd/musica:/music
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:


| Parámetro | Función |
| ------ | ------ |
| `network_mode: host` | Habilitamos el uso de la **red host** en vez de una virtual para docker |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria Europa/Madrid |
| `$HOME/docker/daapd/config:/config` | Ruta donde se alojan configuraciones del software , una vez este corriendo el docker, **recomiendo revisar el fichero forked-daapd.conf para personalizar el servicio** |
| `$HOME/docker/daapd/musica:/music` | Ruta donde se aloja la música a compartir , **recomiendo cambiarla**. |

Una vez configurado,  lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible.

> Gestión Web

Accedemos con un navegador web a la `http://ip_del_host:3689` para usar la interfaz web.

En mi caso a modo ejemplo:

`http://192.168.1.90:3689`

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd1.jpg)

Entramos en configuración del servidor para configurar la salida de audio mediante el protoclo **AirPlay** gracias a nuestro [Shairport-sync](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-shairport-sync):

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd2.jpg)

Dentro del apartado salidas de audio, **activamos nuestra salida/s de audio wireless**:

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd3.jpg)

Y podríamos **ajustar de forma independiente el volumen para cada salida**, muy útil en el caso de usar multiroom:

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd4.jpg)

> Cliente Rhythmbox (GNU/Linux)

En caso de no disponer de la aplicación en nuestra distro, una forma sencilla de disponer de ella, sería:

```bash
sudo apt-get update && \ 
sudo apt-get -y install rhythmbox
```

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd5.jpg)

> Cliente Remote (iOS)

Instalamos la App, la ejecutamos y le decimos **Conectar manualmente** ya que el dispositivo tiene que emparejarse

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd6.jpg)

Nos solicita que debemos de emparejar el dispositivo con nuestro servidor con un código que anotamos, ejemplo: **9112**

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd7.jpg)

Abrimos en un navegador web la siguiente estructura de ruta: `http://ip_del_servidor:3689/#/settings/remotes-outputs` y con el código que se ha generado en el dispositivo móvil lo emparejamos.

En mi caso de la siguiente forma:

`http://192.168.1.90:3689/#/settings/remotes-outputs`

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd8.jpg)

> Clientes Streaming (VLC, Webs, DLNA, Xupnpd, …)

Cuando estemos reproduciendo audio con el servidor Forked-Daapd, de forma paralela a la salida de audio, se nos genera un fichero de audio en streaming mp3 en la ruta `http://ip_del_servidor:3689/stream.mp3`

En mi caso de la siguiente forma:

`http://192.168.1.90:3689/stream.mp3`

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd9.jpg)

> Clientes Chromecast

**Forked-daapd** descubrirá los dispositivos **Chromecast** disponibles en su red y luego se podrá seleccionar el dispositivo como altavoz.

No se requiere configuración.

> Clientes MPD (Android, GNU/Linux, …)

Los clientes MPD buscan sus servidores por defecto en los puertos 6600, Forked-daapd se encarga de servir audio por ese puerto también:http://ip_del_servidor:6600

En nuestro caso sería de la siguiente forma:

`http://192.168.1.90:6600`

A modo de ejemplo, en un dispositivo **Android hemos instalado una App llamada**: [M.A.L.P.](https://play.google.com/store/apps/details?id=org.gateshipone.malp&hl=es_ES&gl=ES){:target="_blank"}, para enviar el audio desde ese dispositivo ya que por defecto no soporta el protocolo AirPlay.

Nos dirigimos a **Configuración/Perfiles**:

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd10.jpg)

Agregamos los datos de nuestro Servidor y hacemos clic en guardar:

![forked-daapd]({{ site.url }}{{ site.baseurl }}/assets/images/posts/daapd11.jpg)

## Docker: [Calibre](https://hub.docker.com/r/linuxserver/calibre/){:target="_blank"}

Calibre es un **gestor y organizador de libros electrónicos** libre, que permite la conversión de numerosos formatos de archivos para libros electrónicos.

Lo que hace es almacenar los libros en una base de datos y nos permite a continuación buscar de manera muy precisa lo que estamos buscando.

Generalmente podemos almacenar los libros en base a muchos parámetros diferentes como el título, autor, editor o la fecha de publicación, de esta forma, nos resulta mucho más sencillo tener todo bien organizado.

Es un programa gracias al cual podemos convertir eBooks a diversos formatos.

- Formatos de entrada: **ePub, HTML, PDF, RTF, txt, cbc, fb2, lit, MOBI, ODT, prc, pdb, PML, RB, cbz y cbr**
- Formatos de salida: **ePub, fb2, OEB, lit, lrf, MOBI, pdb, pml, rb.3**

Vamos a crear las carpetas donde alojar el proyecto:

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

## Docker: [File Browser](https://hub.docker.com/r/filebrowser/filebrowser/){:target="_blank"}

File Browser es un tipo de software que crea una propia nube en nuestro servidor, dirigirlo a una ruta y luego acceder a sus archivos a través de una interfaz web agradable.

Al usar el *Servidor* en modo `headless` quizas una de las cosas que cierta gente echa en falta, es tener un explorador de archivos con el que poder realizar tareas básicas, en resumen una forma cómoda y visual de trabajar.

File Browser suple esa necesidad permitiendo el acceso a los archivos del servidor mediante el navegador web:

- **Crear/renombrar/copiar/mover/visualizar/editar y eliminar archivos**
- **Crear/renombrar/copiar/mover y eliminar carpetas**
- **Buscar/descargar/subir y compartir contenido**
- **Terminal de sistema**

Vamos a crear las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/filebrowser
```

Creamos el fichero donde se va a alojar la base de datos:

```bash
touch $HOME/docker/filebrowser/filebrowser.db
```

A continuación creamos el fichero de configuración:

```bash
cat << EOF > $HOME/docker/filebrowser/filebrowser.json
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database.db",
  "root": "/srv"
}
EOF
```

La creación del servicio es muy sencilla, tan solo ejecutaremos:

```bash
docker run -d \
	--name=Filebrowser \
	-p 84:80 \
	-v /home/$USER:/srv \
	-v $HOME/docker/filebrowser/filebrowser.db:/database.db \
	-v $HOME/docker/filebrowser/filebrowser.json:/.filebrowser.json \
	-e TZ="Europe/Madrid" \
	--restart=always \
	filebrowser/filebrowser:latest
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-p 84:80` | Puerto de gestión Web `84` |
| `-v /home/$USER:/srv` | Ruta base de navegación home de nuestro usuario del sistema |
| `-v $HOME/docker/filebrowser/filebrowser.db:/database.db` | Ruta alojamiento base de datos |
| `-v $HOME/docker/filebrowser/filebrowser.json:/.filebrowser.json` | Ruta alojamiento configuración |
| `-e TZ="Europe/Madrid"` | Zona horaria `Europa/Madrid` |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrión vuelva a cargar el servicio |

Tras haber lanzado el comando, ya tendriamos el servicio disponible, y accederiamos con un navegador web a la dirección `http://IP_Servidor:84`, los datos de acceso iniciales son **admin:admin**

![File Browser]({{ site.url }}{{ site.baseurl }}/assets/images/posts/filebrowser.jpg)

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

![Heimdall]({{ site.url }}{{ site.baseurl }}/assets/images/posts/heimdall.jpg)

## Docker: [Tor-Privoxy](https://hub.docker.com/r/rdsubhas/tor-privoxy-alpine/){:target="_blank"}

`Tor` es una red que implementa una **técnica llamada Onion Routing** (enrutado cebolla por el número de capas que emplea) diseñada con vistas a proteger las comunicaciones, la idea es cambiar el modo de enrutado tradicional de Internet para **garantizar el anonimato y la privacidad de los datos**.

Si lo combinamos con `Privoxy` obtendremos un **servidor proxy con filtrado de la red Tor**.

La creación del servicio es muy sencilla, tan solo ejecutaremos:

```bash
docker run -d \
	--name=TorPrivoxy \
	-p 8118:8118 \
	-p 9060:9050 \
	--restart=always \
	rdsubhas/tor-privoxy-alpine 
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `-p 8118:8118` | Puerto de configuración Privoxy **8118** |
| `-p 9060:9050` | Puerto de comunicación Red Tor **9050** |
| `--restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |

Tras haber lanzado el servicio, ya tendriamos disponible el proxy a usar bajo demanda:

- Si el proxy lo vamos a usar sobre el servidor donde esta instalado el servicio de docker, usaremos: `127.0.0.1:8118`
- Si el proxy lo vamos a usar sobre otro cliente de nuestra red, usaremos la `IP del servidor:8118`, ejemplo: **192.168.1.90:8118**

Ejemplo de configuración navegador **Firefox**:

![TorPrivoxy]({{ site.url }}{{ site.baseurl }}/assets/images/posts/TorPrivoxy.png)

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

## Docker: [UDPXY](https://hub.docker.com/r/lordpedal/udpxy/){:target="_blank"}

**UDPXY** es un sencillo software, el cual convierte los protocolos **multicast** (RTP o UDP) en el protocolo **unicast** HTTP.

 El principal motivo de esta conversión es:

- No todos los elementos de red soportan multicast (sobretodo algunos switches y routers)
- Quieres ver streaming de video en cliente que no tienen software  multicast disponible (ej: smartphones y tablets)
- Quieres acceder a streaming desde una red distinta (ej: streaming de una localización a otra sobre Internet o en WAN/VPN)

Vamos a preparar el entorno, en primer lugar satisfacemos dependencias y creamos la carpeta donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/UDPXY && \
cd $HOME/docker/UDPXY
```

Bajamos el fichero docker-compose.yml alojado en Github:

```bash
wget https://raw.githubusercontent.com/Lordpedal/udpxy/main/docker-compose.yml
```

Y ejecutamos la creación del servicio:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de `http://ip_del_host:2112/status` para ver status web.

**NOTA**: Recuerda que el puerto `Unicast` a usar es: **2112**

> Ejemplo

| Multicast | Unicast |
| ------ | ------ |
| `rtp://@239.0.5.185:8208` | `http://192.168.1.90:2112/rtp/239.0.5.185:8208` |

## Docker: [Xupnpd v2](https://hub.docker.com/r/lordpedal/xupnpdv2/){:target="_blank"}

**Xupnpd V2** es un software permite anunciar canales y contenido multimedia a través de **DLNA** en cooperación con MiniDLNA.

 Si bien la `V1` funciona a la perfección con enlaces unicast no reproduce de forma correcta enlaces `HLS` la `v2` en mi experiencia le ocurre lo opuesto.
 
```bash
mkdir -p $HOME/docker/xupnpdv2/listas && \
cd $HOME/docker/xupnpdv2
```

Bajamos el fichero docker-compose.yml alojado en Github:

```bash
wget https://raw.githubusercontent.com/Lordpedal/xupnpdv2/main/docker-compose.yml
```

Vamos a repasar las opciones editables:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/xupnpdv2/listas:/xupnpd2/media` | Ruta donde se leen/almacenan listas localmente |


Y ejecutamos la creación del servicio:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de `http://ip_del_host:3044` para gestión web.

## Docker: [JDownloader2](https://hub.docker.com/r/jlesage/jdownloader-2/){:target="_blank"}

JDownloader2 es un **gestor de descargas de código abierto**, escrito en Java, que permite la descarga automática de archivos de sitios de alojamiento inmediato como MediaFire, MEGA, entre otros.

Los enlaces de descargas especificados por el usuario son separados en paquetes para permitir pausar y continuar las descargas individualmente, las principales características son:

- Permite descargas múltiples sin estar presente.
- Es compatible con múltiples portales.
- Funciona como gestor de descargas convencional.
- Permite continuar descargas pausadas.
- Interfaz amigable.

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/jd2/{config,descargas} && \
cd $HOME/docker/jd2
```

Ahora vamos a crear el fichero de configuración docker-compose.yml:

```bash
cat << EOF > $HOME/docker/jd2/docker-compose.yml
version: "2"
services:
  jdownloader-2:
    image: jlesage/jdownloader-2
    container_name: jdownloader2
    ports:
      - 5800:5800
    volumes:
      - $HOME/docker/jd2/config:/config:rw
      - $HOME/docker/jd2/descargas:/output:rw
    restart: always
EOF
```

Y lo levantamos para ser creado y ejecutado:

```
docker-compose up -d
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `5800:5800` | Puerto de configuración acceso `5800` |
| `$HOME/docker/jd2/config:/config:rw` | Ruta donde se almacena la configuración del programa |
| `$HOME/docker/jd2/descargas:/output:rw` | Ruta donde se almacenan las **descargas** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |

Tras haber lanzado el servicio, ya tendríamos acceso desde `http://ip_servidor:5800`

![Jdownloader2]({{ site.url }}{{ site.baseurl }}/assets/images/posts/jdown2docker1.jpg)

Un detalle a tener en cuenta es que el portapapeles no soporta el copiado y pegado directamente. Para pasar enlaces tenemos que hacer clic en **Clipboard**

![Jdownloader2]({{ site.url }}{{ site.baseurl }}/assets/images/posts/jdown2docker2.jpg)

En la ventana emergente que nos aparece **pegamos el link y lo enviamos**

![Jdownloader2]({{ site.url }}{{ site.baseurl }}/assets/images/posts/jdown2docker3.jpg)

Haciendo clic en **Agregar Nuevos Enlaces**, veremos como los reconoce y podemos agregarlos a descargar

![Jdownloader2]({{ site.url }}{{ site.baseurl }}/assets/images/posts/jdown2docker4.jpg)

## Docker: [Jitsi](https://github.com/jitsi/docker-jitsi-meet){:target="_blank"}

[Jitsi](https://jitsi.org/){:target="_blank"} es un sistema gratuito y de código abierto para hacer videollamadas.

Al ser de código abierto, sus servicios se ofrecen de forma gratuita y además, permite formar parte de su equipo de desarrolladores.

Permite utilizarlo sin necesidad de registrarse ni de instalar ningún programa en tu ordenador, puedes usarlo desde el navegador otorgando los permisos necesarios a este para gestionar el micrófono y la webcam de tu PC, totalmente compatible con los principales sistemas operativos de escritorio: **Windows, MacOS y Linux**, además tienes versiones para plataformas móviles como **iOS y Android**.

Otra posibilidad que nos da Jitsi es que podemos grabar las videollamadas, también podemos chatear, compartir pantalla, hay estadísticas de tiempo de charla de cada interlocutor, podemos transmitir directamente a YouTube en directo, opción de solo audio o solo vídeo, podemos levantar nuestra mano para captar la atención, etc.

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos la carpeta donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/ && \
cd $HOME/docker
```

Clonamos el repositorio de Jitsi alojado en Github:

```bash
git clone https://github.com/jitsi/docker-jitsi-meet.git
```

Cambiamos el nombre de carpeta y accedo a ella:

```bash
mv docker-jitsi-meet jitsi && cd jitsi
```

Creamos las carpetas del proyecto:

```bash
mkdir -p $HOME/docker/jitsi/.jitsi-meet-cfg/\
{web/letsencrypt,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb,jigasi,jibri}
```

Copiamos y abrimos el editor para personalizar las variables de entorno:

```bash
cp env.example .env && nano .env
```

En la columna izquierda dejo el valor que encontramos por defecto y en la derecha el que hemos de modificar. **Especial atención a la IP**, poner la del **servidor que ejecuta el docker**:

| Configuración Stock | Configuración Personalizada |
| ------ | ------ |
| `CONFIG=~/.jitsi-meet-cfg` | `CONFIG=~/docker/jitsi/.jitsi-meet-cfg` |
| `#DOCKER_HOST_ADDRESS=192.168.1.1` | `DOCKER_HOST_ADDRESS=192.168.1.90` |
| `TZ=UTC` | `TZ=Europe/Madrid` |

Guardamos el fichero, salimos del editor y ejecutamos el script de cifrado claves:

```bash
./gen-passwords.sh
```

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de `http://IP_Servidor:8000` o bien `https://IP_Servidor:8443`

> 🎁 Bonus TIP

Si queremos personalizar el aspecto del servicio, guardaremos el logo con el nombre y extensión: **watermark.png** y el icono como **favicon.ico** en la ruta `$HOME/docker/jitsi`

![Jitsi]({{ site.url }}{{ site.baseurl }}/assets/images/posts/cmonzoom.png)

Modificamos el fichero `docker-compose.yml`:

```bash
nano $HOME/docker/jitsi/docker-compose.yml
```

Buscamos la variable:

```bash
 volumes:
     - ${CONFIG}/web:/config:Z
     - ${CONFIG}/web/letsencrypt:/etc/letsencrypt:Z
     - ${CONFIG}/transcripts:/usr/share/jitsi-meet/transcripts:Z
```

Y la modificamos:

```bash
 volumes:
     - ${CONFIG}/web:/config:Z
     - ${CONFIG}/web/letsencrypt:/etc/letsencrypt:Z
     - ${CONFIG}/transcripts:/usr/share/jitsi-meet/transcripts:Z
     - ./watermark.png:/usr/share/jitsi-meet/images/watermark.png
     - ./favicon.ico:/usr/share/jitsi-meet/images/favicon.ico
```

Guardamos el fichero, salimos del editor y editamos el fichero de configuración y por ejemplo personalizamos el **APP_NAME**:

```bash
sudo nano $HOME/docker/jitsi/.jitsi-meet-cfg/web/interface_config.js
```

Guardamos el fichero (Control+o), salimos del editor (Control+x) y volvemos a ejecutar el comando docker-compose:

```bash
docker-compose up -d
```

## Docker: [MagicMirror](https://hub.docker.com/r/bastilimbach/docker-magicmirror/){:target="_blank"}²

MagicMirror² es una plataforma de espejo modular inteligente, de código abierto.

Con una lista cada vez mayor de [módulos/plugins instalables](https://docs.magicmirror.builders/modules/introduction.html){:target="_blank"} desarrolados por la comunidad libre, podremos convertir un **espejo** de pasillo o baño por ejemplo en nuestro propio **asistente personal**.

Vamos a realizar unos pasos previos para preparar el entorno, en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/magic/config && \
mkdir -p $HOME/docker/magic/modules && \
cd $HOME/docker/magic
```

Ahora vamos a crear el fichero de configuración docker-compose.yml:

```bash
cat << EOF > $HOME/docker/magic/docker-compose.yml
version: '3'
services:
 magicmirror:
  container_name: MagicMirror
  image: bastilimbach/docker-magicmirror
  restart: always
  volumes:
   - /etc/localtime:/etc/localtime:ro
   - $HOME/docker/magic/config:/opt/magic_mirror/config
   - $HOME/docker/magic/modules:/opt/magic_mirror/modules
  ports:
   - 9080:8080
EOF
```

Y lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `9080:8080` | Puerto de configuración acceso **9080** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |

Tras haber lanzado el servicio, ya tendriamos acceso desde `http://ip_dispositivo:9080`.

> Complemento: [MMM-SmartTouch](https://github.com/EbenKouao/MMM-SmartTouch){:target="_blank"}

Este complemento nos dará mucho juego, por ejemplo nos permite activar:

- **Modo Standby**
- **Reinicio remoto** (Necesario realizar FIX para Docker)
- **Apagado remoto** (Necesario realizar FIX para Docker)

Vamos a instalarlo y ver como configurarlo y modificarlo para esa labor, pero antes vamos a satisfacer posibles dependencias del sistema:

```bash
sudo apt-get update && \
sudo apt-get -y install git
```

Comenzamos con la instalación, que es tan sencilla como clonar el repositorio en la ruta modulos que anteriormente habiamos creado:

```bash
cd $HOME/docker/magic/modules && \
sudo git clone https://github.com/EbenKouao/MMM-SmartTouch.git
```

Vamos a realizar un pequeño FIX para poder tener apagado y reinicio remoto, necesitamos editar la configuración del modulo:

```bash
sudo nano $HOME/docker/magic/modules/MMM-SmartTouch/node_helper.js
```

Buscamos y reemplazamos el contenido de estas dos lineas (no continuas):

```bash
require('child_process').exec('sudo poweroff', console.log)
require('child_process').exec('sudo reboot', console.log)
```

Por el siguiente:

```bash
require('child_process').exec('echo "apagar" > /opt/magic_mirror/config/power.txt', console.log)
require('child_process').exec('echo "reiniciar" > /opt/magic_mirror/config/power.txt', console.log)
```

Guardamos, salimos del editor y precargamos el modulo en la configuración de **MagicMirror²**:

```bash
sudo nano $HOME/docker/magic/config/config.js
```

Y añadimos la siguiente configuración dentro del apartado modules:

```bash
{ 
    module: 'MMM-SmartTouch', 
    position: 'bottom_center',
    config: { 
            } 
},
```

Guardamos, salimos del editor y vamos a crear un script en la máquina host para que lea las variables para actuar en consecuencia:

```bash
mkdir -p $HOME/scripts && \
nano $HOME/scripts/magicmirror.sh && \
chmod +x $HOME/scripts/magicmirror.sh
```

Pegamos el siguiente contenido del script:

```bash
#!/bin/bash
#
# MagicMirror Docker Fix v.1
# http://lordpedal.gitlab.io
#
# Inicia Ejecución bucle
while :
do
# Lee variables de docker en host
fichero="$HOME/docker/magic/config/power.txt"
accion=`cat $fichero 2>/dev/null`
# Condicional apagado y salida bucle
if [ "$accion" == 'apagar' ];then
   echo "Apagar"
   sudo rm $fichero
   sudo poweroff
   break
# Condicional reinicio y salida bucle
elif [ "$accion" == 'reiniciar' ]; then
   echo "Reiniciar"
   sudo rm $fichero
   sudo reboot
   break
# Si no cumple condicionales reinicia bucle
else
   sleep 1
fi
done
```

Guardamos, salimos del editor y añadimos una tarea al cron de nuestro usuario:

```bash
crontab -e
```

Y añadimos la siguiente linea al final del fichero, para que el script se cargue tras el inicio del sistema:

```bash
@reboot ~/scripts/magicmirror.sh >/dev/null 2>&1
```

Guardamos, salimos del editor y reiniciamos el sistema para disfrutar la nueva configuración:

```bash
sudo reboot
```

> Y listo!
