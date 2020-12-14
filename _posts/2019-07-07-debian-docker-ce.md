---
title:  "Docker CE: Debian GNU/Linux"
date:   2019-07-08 10:00:00 -0300
last_modified_at: 2020-12-12T17:00:00-05:00
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

Te preguntaras, si ya hemos instalado [KVM para poder correr máquinas virtuales](https://lordpedal.gitlab.io/debian-10-servidores-virtuales/){:target="_blank"} ¿**que me aporta Docker**? Pues realmente el concepto es algo similar, pero **un contenedor no es lo mismo que una máquina virtual**. Un contenedor es más ligero, ya que mientras que a una máquina virtual necesitas instalarle un sistema operativo para funcionar, un contenedor de Docker funciona utilizando el sistema operativo que tiene la máquina en la que se ejecuta el contenedor.

### Instalación

Realizada esta pequeña introducción vamos a meternos en faena, para ello empezaremos con actualizar repositorios e instalar dependencias y utilidades necesarias:

```bash
sudo apt-get update && sudo apt-get -y install apt-transport-https ca-certificates \
curl gnupg2 software-properties-common htop multitail locate net-tools open-vm-tools
```

A continuación, vamos a agregar el repositorio de Docker y la clave GPC:

```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add - && \
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
```

Volvemos a actualizar repositorios del sistema e instalamos Docker:

```bash
sudo apt-get update && \
sudo apt-get -y install docker-ce docker-ce-cli containerd.io
```

### GRUB: Fix Docker

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

Activamos permisos de ejecución a nuestro usuario del sistema evitando tener privilegios root:

```bash
sudo usermod -aG docker $USER
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
### Docker [Portainer CE](https://hub.docker.com/r/portainer/portainer-ce/){:target="_blank"}

La gestión de Docker en un comienzo se realiza desde **TTY**, pero vamos a habilitar un Docker para la gestión de forma web.

Portainer CE es una herramienta web open-source la cual se ejecuta ella misma como un container:

```bash
docker run -d \
	--name=Portainer-CE \
	-v $HOME/docker/portainer_ce:/data \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-p 9000:9000 \
	--restart=always \
	portainer/portainer-ce
```

Ahora debemos de configurarlo vía web, para ello entramos en un navegador web de nuestra red doméstica y apuntamos a la **dirección IP del servidor y el puerto 9000**, en mi caso:

```bash
http://192.168.1.90:9000
```

Se nos solicitara la creación de un **usuario y su contraseña**, tras rellenar los datos, hacemos click en `Create User`. En la siguiene pestaña que nos aparece, hacemos click en `Manage the local Docker environment` y posteriormente en `Connect`. 

Y listo, ya estara debidamente configurado para poder gestionar (**Arrancar, Detener, Reiniciar, Borrar, SSH, ...**) los Dockers futuros desde la web.

### Docker [Watchtower](https://hub.docker.com/r/containrrr/watchtower/){:target="_blank"}

Watchtower es una aplicación que controlará tus contenedores Docker en funcionamiento y observará los cambios en las imágenes a partir de los cuales se iniciaron originalmente esos contenedores. Si la Watchtower detecta que una imagen ha cambiado, se reiniciará automáticamente el contenedor utilizando la nueva imagen.

```bash
docker run -d \
	--name=Watchtower \
	-v /var/run/docker.sock:/var/run/docker.sock \
	--restart=always \
	containrrr/watchtower
```
