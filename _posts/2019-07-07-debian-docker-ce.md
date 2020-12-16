---
title:  "Docker: Debian GNU/Linux"
date:   2019-07-08 10:00:00 -0300
last_modified_at: 2020-12-15T17:00:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Servidor
  - Debian
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

La idea detrás de `Docker` es la de poder crear portables, para que las aplicaciones de software puedan ejecutarse **en cualquier máquina con Docker instalado**, independientemente del sistema operativo y de que máquina tenga por debajo, facilitando así también su expansión.

Te preguntaras, si ya hemos instalado [KVM para poder correr máquinas virtuales](https://lordpedal.github.io/gnu/linux/debian-servidores-virtuales/){:target="_blank"} ¿**que me aporta Docker**? Pues realmente el concepto es algo similar, pero **un contenedor no es lo mismo que una máquina virtual**. Un contenedor es más ligero, ya que mientras que a una máquina virtual necesitas instalarle un sistema operativo para funcionar, un contenedor de Docker funciona utilizando el sistema operativo que tiene la máquina en la que se ejecuta el contenedor.

### Docker CE + docker-compose: Instalación AMD64

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

### Docker CE + docker-compose: Instalación ARM

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
### Docker: [Portainer CE](https://hub.docker.com/r/portainer/portainer-ce/){:target="_blank"}

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

### Docker: [Watchtower](https://hub.docker.com/r/containrrr/watchtower/){:target="_blank"}

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

### Docker: [P3DNS](https://github.com/Lordpedal/p3dns/){:target="_blank"}

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

Tras haber lanzado el comando, ya tendríamos el servicio disponible a traves de **http://IP_Servidor:83** en mi caso.

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

>  Y listo!
