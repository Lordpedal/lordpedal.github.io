---
title:  "Debian 10 Buster: Servidor PC"
date:   2019-12-21 10:00:00 -0300
last_modified_at: 2020-12-15T16:15:00-05:00
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

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
En esta sección pretendo hablar de como optimizar y adaptar la distribución Debian Buster a un uso diario, desde mi propia experiencia de usuario.
El recomendar `Debian` es poder usar la combinación de un **Sistema Operativo Libre y alternativo** con una gran comunidad de soporte detrás del proyecto.

En la [web de descargas](https://www.debian.org/releases/stable/){:target="_blank"} podremos elegir la distribución que más se adapte a nuestras necesidades. En mi caso voy a recomendar la plataforma `AMD64`, que es la *más recomendable* para uso en un PC con **procesador 64bits**, [descarga directa](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/){:target="_blank"}.
Adicionalmente en la propia web podemos encontrar unas excelentes [guías de instalación](https://www.debian.org/releases/stable/installmanual){:target="_blank"} donde el proceso de instalación es guiado con todo tipo de detalles.

Resumiendo el procedimiento a grandes rasgos:

1.  Grabamos la ISO descargada en un CD/DVD o USB según capacidad y necesidad.
2.  Seleccionamos la opción de arranque desde el nuevo dispositivo en la configuración de nuestra UEFI/BIOS. Obligatorio deseleccionar opción de arranque rápido en Windows en caso de tenerlo activo y/o instalado.
3.  Ejecutamos el asistente de instalación.
4.  **Importante** tildar para instalar en sistema durante asistente instalación: `Entorno de escritorio Debian + MATE + SSH server + Utilidades estándar del sistema Debian`, el resto de opciones recomiendo descartarlas.
5.  Disfrutar de las bondades de un gran sistema operativo y una gran comunidad asociada al mismo.

## Sistema Base

El usuario de sistema sobre el que realizare la guía es `pi` para seguir en la linea del blog, recordad sustituir dicho usuario por el que habéis creado durante la instalación.

Planteado el guión inicial vamos a personalizar nuestra instalación, pero antes recordando que los ajustes en su mayor parte los ejecutaremos desde una *terminal de sistema*.

### Configurando: [SUDO](https://es.wikipedia.org/wiki/Sudo){:target="_blank"} 

Lo primero con lo que comenzamos es añadiendo nuestro usuario al grupo `sudo` del sistema, para ello ejecutamos en la terminal:

```bash
su
```
Se nos solicitara la *contraseña* de **root** que previamente le dimos en la instalación. Procedemos a instalar la aplicación *(necesaria conexión internet)*:

```bash
apt-get update && apt-get -y install sudo nano
```
A continuacion debemos de añadir nuestro usuario a los principales grupos del sistema, entre ellos **sudo**:

```bash
cd /sbin && \
./usermod -aG audio pi && \
./usermod -aG video pi && \
./usermod -aG dialout pi && \
./usermod -aG plugdev pi && \
./usermod -aG tty pi && \
./usermod -aG sudo pi
```
Si no es así haz caso omiso, el fallo reside en el **PATH del Sistema** que durante el resto de configuraciones del server se corrige.

Vamos a repasar los principales atajos de teclado que encontramos en el editor [nano](https://es.wikipedia.org/wiki/GNU_Nano){:target="_blank"}:

 | Acción | Resultado |
 | ------ | ------ |
 | Control + O | Guardar fichero |
 | Control + X | Salir del editor |
 | Control + X | Salir del editor | 
 | Control + C | Muestra número linea donde se encuentra cursor | 
 | Control + K | Cortar linea | 
 | Control + U | Pegar linea | 
 | Control + W | Buscar en el fichero |
 | Control + W + R | Buscar y reemplazar en el fichero |

Añadimos privilegios sudo editando la configuración con nuestro editor *nano*:

```bash
nano /etc/sudoers
```
Y agregamos la siguiente sentencia al final del archivo:

```bash
pi ALL=(ALL) NOPASSWD: ALL
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y salimos de la sesión root.

```bash
exit
```
Y ya tendremos configurado debidamente el perfil sudo en nuestro usuario de sistema.

###  Ajustando: Repositorios Sistema

El [gestor de paquetes](https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_paquetes){:target="_blank"} `Apt`/`Aptitude`/`Synaptic` de nuestra distribución se basa en un listado de fuentes de instalación. 
Primero haremos un backup de las actuales y crearemos una personalizada:

```bash
cd /etc/apt && \
sudo mv sources.list sources.pi && \
sudo nano sources.list
```
En el documento en blanco que se nos abre, añadimos las nuevas personalizadas:

```bash
# Oficiales
deb http://ftp.es.debian.org/debian/ buster main contrib non-free
deb-src http://ftp.es.debian.org/debian/ buster main contrib non-free

# Seguridad
deb http://security.debian.org/debian-security buster/updates main contrib non-free
deb-src http://security.debian.org/debian-security buster/updates main contrib non-free

# Actualizaciones Sistema
deb http://ftp.es.debian.org/debian/ buster-updates main contrib non-free
deb-src http://ftp.es.debian.org/debian/ buster-updates main contrib non-free
```

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y actualizamos el listado de paquetes de software y posibles actualizaciones del mismo:

```bash
sudo apt-get clean && \
sudo apt-get autoclean && \
sudo apt-get -y autoremove && \
sudo apt-get update && \
sudo apt-get -y upgrade && \
sudo apt-get -y dist-upgrade
```
Tras finalizar la actualización tendremos el sistema actualizado y con las últimas novedades/parches instalados.

###  Utilidades Sistema

Posiblemente tendrás algún `controlador` pendiente de actualizar y/o instalar el `driver necesario` para poder interactuar con el y no esta compilado en el kernel. Una solución sencilla es instalar un paquete con algunos de los principales drivers (3Com, Atheros, Radeon, …):

```bash
sudo apt-get update && \
sudo apt-get -y install firmware-linux-nonfree
```
Y si además queremos maximizar la eficiencia de nuestro procesador instalaremos este parche según dispongamos de un procesador `32bits` o `64bits`:

>  INTEL
```bash
sudo apt-get -y install intel-microcode
```
> AMD 64bits & INTEL 64bits  
```bash
sudo apt-get -y install amd64-microcode
```

Si necesitamos `des/comprimir` algún fichero de nuestro sistema y no se encuentra dentro de los formatos más habituales de GNU/Linux, deberemos de darle soporte para poder interactuar:

```bash
sudo apt-get update && \
sudo apt-get -y install rar unrar zip unzip unace bzip2 lzop p7zip \
p7zip-full p7zip-rar sharutils lzip xz-utils mpack arj cabextract
```
Otro conjunto de `utilidades adicionales` a instalar que necesitaremos para futuros usos son:

```bash
sudo apt-get update && \
sudo apt-get -y install mc htop curl bc git wget curl dnsutils ntfs-3g hfsprogs \
hfsplus build-essential automake libtool uuid-dev psmisc linux-source yasm \
minissdpd autoconf g++ subversion linux-source tofrodos git-core subversion dos2unix \
make gcc automake cmake git-core dpkg-dev fakeroot pbuilder dh-make debhelper devscripts \
patchutils quilt git-buildpackage pristine-tar git yasm cvs mercurial libexif* libid3tag* \
libavutil* libavcodec-dev libavformat-dev libjpeg-dev libsqlite3-dev libexif-dev libid3tag0-dev \
libogg-dev libvorbis-dev libflac-dev ffmpeg libssl-dev libgnutls-openssl-dev \
linux-headers-`uname -r`
```



###  Configurando Idioma Sistema

Ejecutaremos un pequeño asistente con la orden de terminal:

```bash
sudo dpkg-reconfigure locales
```
Para poner nuestro sistema en español, tenemos que marcar las siguientes opciones en el asistente configuración de locales y deseleccionar cualquier otra que pudiese estar activa:

- [ ] en_GB.UTF-8 UTF-8 
- [x] es_ES ISO-8859-1 
- [x] es_ES.UTF-8 UTF-8 
- [x] es_ES@euro ISO-8859-15

Para la configuración regional predeterminada seleccionamos:

```bash
[x] es-ES.UTF-8
```

###  Configurando [TTY](https://es.wikipedia.org/wiki/Emulador_de_terminal){:target="_blank"}

Este paso aunque no es obligatorio en un entorno de Servidor, si lo considero que es altamente recomendado para optimizar recursos de sistema. Lo que vamos a hacer es deshabilitar el autoinicio del entorno gráfico instalado (recordemos [MATE](https://es.wikipedia.org/wiki/MATE){:target="_blank"}).
Lo que debemos de hacer a continuacón es adaptar el sistema a un arranque sin gestor de inicio sesiones ([LightDM](https://es.wikipedia.org/wiki/LightDM){:target="_blank"}), para ello instalamos y configuramos la siguiente dependencia:

```bash
sudo apt-get -y install xserver-xorg-legacy
```
Vamos a reconfigurarla debidamente, previo backup de su configuración:

```bash
sudo mv /etc/X11/Xwrapper.config /etc/X11/Xwrapper.bak && \
sudo nano /etc/X11/Xwrapper.config
```
Agregamos el siguiente contenido al fichero que estamos editando:

```bash
# Xwrapper.config (Debian X Window System server wrapper configuration file)
#
# This file was generated by the post-installation script of the
# xserver-xorg-legacy package using values from the debconf database.
#
# See the Xwrapper.config(5) manual page for more information.
#
# This file is automatically updated on upgrades of the xserver-xorg-legacy
# package *only* if it has not been modified since the last upgrade of that
# package.
#
# If you have edited this file but would like it to be automatically updated
# again, run the following command as root:
#   dpkg-reconfigure xserver-xorg-legacy
needs_root_rights=yes
allowed_users=anybody
```
Guardamos los cambios **(Ctrl+O)** y salimos del editor de texto **(Ctrl+X)**. Ahora vamos a reconfigurar SystemD para el arranque en terminal:

```bash
sudo systemctl set-default multi-user.target
```
Llegado a este punto el sistema tras un reinicio o encendido del PC nos solicitaria el usuario: **pi** y su contraseña: ************** para hacer login en terminal.
Podemos configurar un **autologin** que **no lo recomiendo** pero lo dejo a modo informativo.

```bash
sudo mkdir -p /etc/systemd/system/getty@tty1.service.d && \
sudo nano /etc/systemd/system/getty@tty1.service.d/override.conf
```
Agregamos el siguiente contenido al fichero que estamos editando:

```bash
[Service]
Type=simple
ExecStart=
ExecStart=-/sbin/agetty --autologin pi --noclear %I 38400 linux
```
Guardamos los cambios **(Ctrl+O)** y salimos del editor de texto **(Ctrl+X)**.

###  Configurando RC.LOCAL

Si no queremos crear un script único para la ejecución de un comando o un script cada vez que iniciamos un sistema tipo Unix (BSD, Gnu/Linux, etc) tenemos la posibilidad de llamarlo desde el fichero **/etc/rc.local**.
Cualquier comando que coloquemos o script al que llamemos en dicho fichero será ejecutado al final del arranque, es decir, cuando todos los scripts que tenemos en el runlevel correspondiente hayan sido ejecutados. 
Esta opción no viene habilitada por defecto en Debian 10 y para ello tendremos que habilitarla, creamos el servicio para [SystemD](https://es.wikipedia.org/wiki/Systemd){:target="_blank"}:

```bash
sudo nano /etc/systemd/system/rc-local.service
```
Agregamos el siguiente contenido al fichero que estamos editando:

```bash
[Unit]
Description=Script /etc/rc.local
ConditionPathExists=/etc/rc.local

[Service]
Type=forking
ExecStart=/etc/rc.local start
TimeoutSec=0
StandardOutput=tty
RemainAfterExit=yes
SysVStartPriority=99

[Install]
WantedBy=multi-user.target
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, ahora pasamos a crear el fichero **rc.local**

```bash
sudo nano /etc/rc.local
```
Agregamos el siguiente contenido al fichero que estamos editando:

```bash
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# SALIR
exit 0
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, debemos de darle permisos de ejecución al ficher creado:

```bash
sudo chmod +x /etc/rc.local
```
Habilitamos el servicio para que se ejecute al inicio del sistema y lo lanzamos para comprobar el correcto funcionamiento:

```bash
sudo systemctl enable rc-local && \
sudo systemctl start rc-local.service && \
sudo systemctl status rc-local.service
```
Llegado a este punto de configuración del servidor recomiendo un reset al sistema:

```bash
sudo reboot
```
Tras el reinicio el sistema arrancara en `TTY`. Adjunto cuadro resumen con los principales comandos terminal:

 | Comando terminal | Resultado |
 | ------ | ------ |
 | startx | Arrancar entorno gráfico (MATE) |
 | exit | Salir/Cerrar sesión TTY |
 | sudo su | Iniciar sesion como ROOT |
 | sudo reboot | Reiniciar sistema |
 | sudo poweroff | Apagar sistema |

## Redes

Tras haber configurado nuestro sistema Base, vamos a configurar y segurizar nuestra red doméstica.

###  Identificando RED

La primera tarea que debemos de realizar es encontrar el nombre de nuestro identificador de red y el rango de la misma.

Este comando nos dara la información esperada:

```bash
ip a
```

Y entre los valores que muestra el comando me quedo con la siguiente información:

```bash
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast master state UP 
        group default qlen 1000
        link/ether xx:xx:xx:xx:xx:xx brd xx:xx:xx:xx:xx:xx
        inet 192.168.1.250/24 brd 192.168.1.255 scope global ens33
        valid_lft forever preferred_lft forever
```

Ahora se que mi dispositivo de red cableada esta identificado como `ens33` y que la IP en mi red es `192.168.1.250` rango [DHCP](https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host){:target="_blank"}.

### Configurando RED

Vamos a habilitar la [redicción de puertos sobre IPv4](https://es.wikipedia.org/wiki/Redirecci%C3%B3n_de_puertos){:target="_blank"} que posteriormente usaremos para entre otros configurar debidamente la VPN.

```bash
sudo nano /etc/sysctl.conf
```

Buscamos el siguiente apartado en el documento:

```bash
#net.ipv4.ip_forward=1
```
Y lo dejamos de la siguiente forma, como veras solamente has de eliminar la **#** inicial:

```bash
net.ipv4.ip_forward=1
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y pasamos a configurar una [red Bridge](https://es.wikipedia.org/wiki/Puente_de_red){:target="_blank"} con [IP estática](https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP){:target="_blank"}:

```bash
sudo apt-get update && \
sudo apt-get -y install bridge-utils net-tools ifupdown && \
sudo mv /etc/network/interfaces /etc/network/interfaces.bak && \
sudo nano /etc/network/interfaces
```
En el documento en blanco que se nos abre, lo configuro con mi nombre de red (*ens33*) y la ip estática que le voy a configurar (*192.168.1.90*):

```bash
# LO
auto lo
iface lo inet loopback

# Bridge
auto br0
iface br0 inet static
        address 192.168.1.90
        netmask 255.255.255.0
        network 192.168.1.0
        gateway 192.168.1.1
        bridge_ports ens33
        bridge_stp off
        bridge_fd 0
        bridge_maxwait 0
```        
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y nos queda corregir un posible fallo aunque no es común, en el fichero de resolución de DNS:

```bash
sudo mv /etc/resolv.conf /etc/resolv.conf.bak && \
echo "nameserver 1.1.1.1" | sudo tee -a /etc/resolv.conf
```
Para evitar que NetworkManager entre en juego editaremos su configuración, para deshabilitar que juegue con redes configuradas:

```bash
sudo nano /etc/NetworkManager/NetworkManager.conf
```
Y dejamos el fichero con el siguiente contenido:

```bash
[main]
plugins=ifupdown,keyfile
dns=none

[ifupdown]
managed=false
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y a continuación debemos de reiniciar el servidor para aplicar los nuevos cambios producidos en el dispositivo de red:

```bash
sudo reboot
```
Tras reiniciar nuevamente comprobamos la nueva configuración de red:

```bash
ip a
```
Y vemos los cambios realizados:

```bash
3: br0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP
        group default qlen 1000
        link/ether xx:xx:xx:xx:xx:xx brd xx:xx:xx:xx:xx:xx
        inet 192.168.1.90/24 brd 192.168.1.255 scope global br0
        valid_lft forever preferred_lft forever</pre>
```
A partir de este momento nuestra red cableada la identificaremos con el nombre de `br0` y la IP de nuestro servidor en casa sera `192.168.1.90`.

### Configurando DNS Pública

Como sabras tu **IP doméstica no es tu IP pública** y al igual que en un comienzo tu IP doméstica era DHCP lo mismo ocurre con la IP pública. Por tanto para poder redireccionar servicios, necesitamos disponer de IP pública estática. 
La forma más sencilla es usar un proveedor de DNS públicas de calidad como por ejemplo [Duck DNS](https://www.duckdns.org/){:target="_blank"}.

Entramos en la [web](https://www.duckdns.org/){:target="_blank"} y creamos una *cuenta gratuita* en la cual registraremos nuestro *dominio*, ejemplo: **lordpedal.duckdns.org**. Y el procedimiento de instalación en nuestra red es vía **cron**.
Adjunto [tutorial de configuración en GNU/Linux](https://www.duckdns.org/install.jsp#linux-cron){:target="_blank"}.

Luego tenemos que configurar nuestro hosts para agregar nuestra DNS Pública:

```bash
sudo nano /etc/hosts
```
Buscamos la línea:

> 127.0.0.1       localhost 

Y la modificamos con nuestra cuenta en DuckDNS:

> 127.0.0.1       localhost lordpedal.duckdns.org 


Guardamos los cambios **(Ctrl+O)** y salimos del editor de texto **(Ctrl+X)**.

### P3DNS

Antes de continuar debemos de realizar estos pasos:

1. Instalamos y configuramos: [Docker](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#instalaci%C3%B3n-amd64){:target="_blank"}
2. Configuramos e instalamos: [P3DNS](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-p3dns){:target="_blank"}

### VPN´s

Una red privada virtual es una tecnología de red de ordenadores que permite una extensión segura de la red de área local sobre una red pública o no controlada como Internet.
Permite que el ordenador en la red envíe y reciba datos sobre redes compartidas o públicas como si fuera una red privada, con toda la funcionalidad, seguridad y políticas de gestión de una red privada. 
Esto se realiza estableciendo una conexión virtual punto a punto mediante el uso de conexiones dedicadas, cifrado o la combinación de ambos métodos.

#### Wireguard (Recomendada)

Información ampliada Docker: [Wireguard](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-wireguard){:target="_blank"}

#### OpenVPN (Opcional)

Teniendo ya fijada una DNS Pública, una IP estática interna y la redirección de puertos, ya podemos proceder a configurar de forma sencilla el acceso mediante [VPN](https://es.wikipedia.org/wiki/Red_privada_virtual){:target="_blank"}.
Vamos a bajar un cliente asistente donde configuramemos nuestra red VPN:

```bash
cd ~/ && \
wget https://git.io/vpn -O openvpn-install.sh && \
chmod 755 openvpn-install.sh && \
sudo ./openvpn-install.sh
```
Durante la instalación nos solicitara unos parametros de nuestros pasos previos:

*  IPv4 (automatically detected, if not enter the local IPv4 address): `192.168.1.90`
*  Public IP (enter your public IP address): `lordpedal.duckdns.org`
*  Protocol: `UDP`
*  Port (change to your desired port): `2194`
*  DNS: `Current system resolvers`
*  Client name: `Lordpedal`

Vamos a afinar la configuración de la VPN con capas extras de personalización, ahora debemos de conocer la IP de la nuestra red virtual **TUN0**

```bash
sudo ifconfig tun0 | grep 'inet'
```
En mi caso el valor de referencia es: `10.8.0.1`. Vamos a editar la configuración del servidor de [OpenVPN](https://es.wikipedia.org/wiki/OpenVPN){:target="_blank"}:

```bash
sudo nano /etc/openvpn/server/server.conf
```
Buscamos la linea donde el codigo empieza por (suele ser una única línea en según que casos alguna duplicada):

```bash
push "dhcp-option DNS
```
Y sustituimos la linea o si existen varias dejamos una sola que haga referencia al codigo push dhcp-option con lo siguiente:

```bash
push "dhcp-option DNS 10.8.0.1"
```
Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y reiniciamos el servicio OpenVPN:

```bash
sudo systemctl restart openvpn
```
Recordad que el fichero OVPN generado en nuestro caso se llamaba Lordpedal lo tendremos que pasar a nuestra carpeta de usuario.

```bash
sudo cp /root/Lordpedal.ovpn /home/pi && \
sudo chown pi:pi /home/pi/Lordpedal.ovpn
```
Ahora ya podremos pasar el fichero OVPN a nuestro Smartphone/Tablet/Pendrive/... para poder conectarnos en remoto previa configuración router.
Recuerda abrir el **Puerto** `2194` a la **IP** `192.168.1.90` con **Protocolo** `UDP` si has seguido la configuración que detallo paso a paso.

## Multimedia

Continuamos añadiendole extras a nuestro Servidor esta vez desde el punto `multimedia`.

#### Transmission

Información ampliada Docker: [Transmission](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-transmission){:target="_blank"}

### SAMBA

**Samba** es una suite de aplicaciones Unix que habla el protocolo `SMB (Server Message Block)`. Los sistemas operativos Microsoft Windows y OS/2 utilizan SMB para compartir por red archivos e impresoras y para realizar tareas asociadas. Gracias al soporte de este protocolo, Samba permite a las máquinas Unix entrar en el juego, comunicándose con el mismo protocolo de red que Microsoft Windows y aparecer como otro sistema Windows en la red (desde la perspectiva de un cliente Windows).
 Hoy en día, la suite Samba gira alrededor de un par de demonios Unix que permiten la compartición de recursos entre los clientes SMB de una red. Estos demonios son:

- **smbd**: Demonio que permite la compartición de archivos e impresoras sobre una red SMB y proporciona autentificación y autorización de acceso para clientes SMB.
- **nmbd**: Demonio que soporta el servicio de nombres NetBIOS y WINS, que es una implementación de Microsoft del servicio de nombres NetBIOS (NBNS). Este demonio también ayuda añadiendo la posibilidad de navegar por la red.

Vamos a entrar a configurar nuestro Servidor para compartir información con otros Sistemas Operativos de casa:

```bash
sudo apt-get update && sudo apt-get install samba smbclient cifs-utils
```

Durante la instalación se nos consultara si queremos modificar `smb.conf para usar WINS sobre DHCP`, la responderemos `NO`. Ahora vamos a crear una carpeta que usaremos para que cualquier usuario de nuestra red deje información en el servidor:

```bash
mkdir -p /home/$USER/Samba && chmod 777 -R /home/$USER/Samba
```

Hacemos copia de seguridad del fichero `/etc/samba/smb.conf`:
 
```bash
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
```
 
Una vez que tenemos la copia hecha, editamos la configuración:

```bash
sudo nano /etc/samba/smb.conf
```

Al final del fichero añadimos el recurso a compartir, una carpeta sera pública para la red y la otra privada que nos solicitara usuario y contraseña:
 
```bash
[Compartido]
  comment = Overclock Server - Publica
  path = /home/pi/Samba
  available = yes
  writable = yes
  browseable = yes
  only guest = no
  create mask = 0777
  directory mask = 0777
  public = yes

[Descargas]
  comment = Overclock Server - Privada
  path = /home/pi/Torrents
  available = yes
  writable = yes
  browseable = yes
  only guest = no
  create mask = 0777
  directory mask = 0777</pre>
```  

En este mismo archivo, casi al principio, vas a encontrar la variable workgroup, quede de la siguiente forma:

```bash
workgroup = WORKGROUP
```

Guardamos los cambios, salimos del editor de texto y añadimos el usuario `pi` a samba y le ponemos clave:

```bash
sudo smbpasswd -a pi
```

Agregamos configuramos la opción de detectar las redes **SMB en el grupo de trabajo**, sino tienes ninguna definida dale al intro para continuar sin contraseña:

```bash
smbclient -L localhost
```

Solo nos queda reiniciar el servicio y tendriamos el sistema configurado:

```bash
sudo systemctl restart smbd && \
sudo systemctl status smbd
```

Ahora desde el explorar de ficheros accedemos a la dirección ip del Servidor, veremos el recurso compartido. Al intentar acceder a la carpeta `privada`, nos pedirá un nombre de usuario y la contraseña (la que pusimos en el paso anterior).
Si las credenciales son correctas, veremos el contenido de la carpeta que hemos compartido. 

### VNC

Como tenemos instalado un **entorno gráfico** en el Servidor puede ser interesante controlarlo de forma remota mediante `VNC`. **VNC** (inglés: Virtual Network Computing). Es también llamado software de escritorio remoto, no impone restricciones en el sistema operativo del ordenador servidor con respecto al del cliente: es posible compartir la pantalla de una máquina con cualquier sistema operativo que soporte VNC conectándose desde otro ordenador o dispositivo que disponga de un cliente VNC portado.
Vamos a actualizar repositorios e instalar el servidor de VNC:

```bash
sudo apt update && \
sudo apt-get -y install tightvncserver
```

Cuando termine la instalación lanzamos el programa para generar la configuración en nuestro sistema:

```bash
vncserver
```

Nos solicitara la creación de una contraseña y su posterior check:

```bash
Output
You will require a password to access your desktops.

Password: *****
Verify: *****
```

Nos preguntara si queremos crear un password de visualización solo, la respuesta será `n`:

```bash
Would you like to enter a view-only password (y/n)? n
```

Y nos dira que ha creado la configuración necesaria en nuestra carpeta de usuario:

```bash
xauth:  file /home/pi/.Xauthority does not exist

New 'X' desktop is your_hostname:1

Creating default startup script /home/pi/.vnc/xstartup
Starting applications specified in /home/pi/.vnc/xstartup
Log file is /home/pi/.vnc/lordpedal:1.log
```

Para configurar el Servidor de VNC en nuestro Servidor tenemos que detener el programa en ejecución:

```bash
vncserver -kill :1
```

Hacemos un backup del fichero `xstartup` generado:

```bash
mv ~/.vnc/xstartup ~/.vnc/xstartup.bak
```

Vamos a crear el nuestro, personalizarlo y darle permisos de ejecución:

```bash
nano ~/.vnc/xstartup && \
chmod +x ~/.vnc/xstartup
```

Y dentro del fichero anexamos la siguiente configuración (Escritorio MATE):

```bash
#!/bin/bash
xrdb $HOME/.Xresources
xsetroot -solid grey
export XKL_XMODMAP_DISABLE=1
/usr/bin/mate-session &
```

Guardamos los cambios, salimos del editor de texto y ahora vamos a crear un servicio de autoarranque en [Systemd](https://es.wikipedia.org/wiki/Systemd){:target="_blank"} con nuestro editor nano:

```bash
sudo nano /etc/systemd/system/vncserver@.service
```

Y agregamos el siguiente codigo:

```bash
[Unit]
Description=TightVNC Server
After=syslog.target network.target

[Service]
Type=forking
User=pi
Group=pi
WorkingDirectory=/home/pi

PIDFile=/home/pi/.vnc/%H:%i.pid
ExecStartPre=-/usr/bin/vncserver -kill :%i > /dev/null 2>&1
ExecStart=/usr/bin/vncserver -depth 24 -geometry 1280x720 :%i
ExecStop=/usr/bin/vncserver -kill :%i

[Install]
WantedBy=multi-user.target
```

Guardamos los cambios, salimos del editor de texto y recargamos los servcios de **Systemd**:

```bash
sudo systemctl daemon-reload
```

Ahora ya podemos habilitar el autoarranque de VNC tras reiniciar y habilitarlo en la sesión actual:

```bash
sudo systemctl enable vncserver@2.service && \
sudo systemctl start vncserver@2.service
```

Si queremos comprobar como esta trabajando el servicio hacemos un check de status:

```bash
sudo systemctl status vncserver@2
```

En mi caso devuelve el siguiente código:

```bash
pi@lordpedal:~/.vnc$ sudo systemctl status vncserver@2
● vncserver@2.service - TightVNC Server
   Loaded: loaded (/etc/systemd/system/vncserver@2.service; enabled; vendor preset: enabled)
   Active: active (running) since Sun 2019-04-14 16:21:22 CEST; 1 day 1h ago
 Main PID: 1386 (Xtightvnc)
   CGroup: /system.slice/system-vncserver.slice/vncserver@2.service
           ├─ 1386 Xtightvnc :2 -desktop X -auth /home/pi/.Xauthority -geometry 1280x1024 -depth 24 -rfbwait 120000 -rfb           
           ├─ 2005 /bin/sh /etc/X11/Xvnc-session
           ├─ 2007 x-session-manager
           ├─ 2031 dbus-launch --autolaunch 21d0957d47914be79fd212f1ac66978d --binary-syntax --close-stderr
           ├─ 2035 /usr/bin/dbus-daemon --fork --print-pid 5 --print-address 7 --session
           ├─ 2053 /usr/bin/dbus-launch --exit-with-session --sh-syntax
           ├─ 2058 /usr/bin/dbus-daemon --fork --print-pid 5 --print-address 7 --session
           ├─ 2075 /usr/bin/ssh-agent x-session-manager
           ├─ 2077 /usr/lib/at-spi2-core/at-spi-bus-launcher
           ├─ 2082 /usr/bin/dbus-daemon --config-file=/usr/share/defaults/at-spi2/accessibility.conf --nofork --print-ad           
           ├─ 2084 /usr/lib/at-spi2-core/at-spi2-registryd --use-gnome-session
           ├─ 2089 /usr/lib/dconf/dconf-service
           ├─ 2095 gnome-keyring-daemon --start
           ├─ 2101 /usr/bin/mate-settings-daemon
           ├─ 2105 marco
           ├─ 2109 mate-panel
           ├─ 2111 /usr/lib/gvfs/gvfsd
           ├─ 2119 /usr/lib/gvfs/gvfsd-fuse /home/pi/.gvfs -f -o big_writes
           ├─ 2136 /usr/bin/pulseaudio --start --log-target=syslog
           ├─ 2166 mate-screensaver
           ├─ 2168 nm-applet
           ├─ 2171 mate-volume-control-applet
           ├─ 2200 /usr/lib/mate-panel/wnck-applet
```
           
A partir de ahora cuando queramos conectarnos vía VNC debemos recordar que sera la `IP de acceso y el puerto 5902` junto con la contraseña que le hubiesemos definido:

> vnc://192.168.1.90:5902

#### MiniDLNA

Información ampliada Docker: [MiniDLNA](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-minidlna){:target="_blank"}

### UDPXY

Algunos tenemos contratados servicios de televisión por cable como puede ser **Movistar+** y aparte de ver los canales en la TV, queremos verlos a través del PC, móvil o tablet, por mayor comodidad. Pero no todos los dispositivos soportan [multicast](https://es.wikipedia.org/wiki/IP_Multicast){:target="_blank"}.

Esto se soluciona con el software `udpxy`, el cual **convierte los protocolos multicast (RTP o UDP) en el protocolo unicast HTTP**.

Primero vamos a preparar el entorno de compilación **(creamos carpeta compilación + bajamos source programa + descomprimimos + compilamos e instalamos)**:

```bash
cd && mkdir ~/source && cd ~/source && \
wget http://www.udpxy.com/download/udpxy/udpxy-src.tar.gz && \
tar -xzvf udpxy-src.tar.gz && rm udpxy-src.tar.gz && \
cd udpxy* && make && sudo make install && \
cd ~/source && rm -rf udpxy*
```

Realizados estos pasos, **udpxy estará correctamente instalado**, solo nos falta ejecutarlo asignarle un puerto `4022` donde realizara la escucha:

```bash
sudo udpxy -p 4022 &
```

Podemos comprobar que el programa esta funcionando correctamente, abriendo en un navegador web a traves de nuestra red local el siguiente enlace:

> http://192.168.1.90:4022/status 

Este paso tendriamos que realizarlo cada vez que iniciemos el servidor y deseemos hacer uso de udpxy, para ellos vamos a ayudarnos de `/etc/rc.local` para configurarlo debidamente:

<pre>sudo nano /etc/rc.local</pre>

Y lo dejamos con los cambios que hemos ido agregando para que quede de la siguiente forma: 

```bash
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
#
# IPTV
/usr/local/bin/udpxy -p 4022 -B 270Kb -R 183 -H -1 -c 7 & >/dev/null 2>&1
# SALIR
exit 0
```

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y cada vez que arranque tendremos operativo el servicio.

### XUPNPD

Y la última joya, este otro programa llamado [Xupnpd](http://xupnpd.org/){:target="_blank"}. Este **software permite anunciar canales y contenido multimedia** a través de **DLNA** en cooperación con `MiniDLNA`. 

Vía DLNA (UPnP) se entregará una lista personalizada con los canales por ejemplo de **Movistar+, Youtube,...** a los dispositivos de la LAN. Existen múltiples cliente que pueden consumir este servicio, por ejemplo VLC y así no tener que crear un fichero .m3u en cada ordenador.

Vamos nuevamente a preparar el entorno de trabajo para compilar el software:

```bash
cd ~/source && \
git clone https://github.com/clark15b/xupnpd.git && \
cd xupnpd/src && make && cd .. && \
sudo mv src /etc/xupnpd
```

Finalizado este proceso ya tendremos compilado y disponible para configurar el programa:

```bash
sudo chown root:root -R /etc/xupnpd && \
sudo cp /etc/xupnpd/xupnpd-x86 /etc/xupnpd/xupnpd && \
sudo chmod 755 /etc/xupnpd/*.lua && \
sudo nano /etc/xupnpd/xupnpd.lua
```

Adjunto **mi fichero de configuración** con la **configuración previa adquirida** en los procesos del **blog** `(br0, 192.168.1.90, 4022, ...)`:

```bash
cfg={}

cfg.ui_auth_file='auth.txt'

cfg.ui_session_file='/tmp/xupnpd.session'

-- multicast interface for SSDP exchange, 'eth0', 'br0', 'br-lan' for example
cfg.ssdp_interface='br0'

-- 'cfg.ssdp_loop' enables multicast loop (if player and server in one host)
cfg.ssdp_loop=0

-- SSDP announcement interval
cfg.ssdp_notify_interval=15

-- SSDP announcement age
cfg.ssdp_max_age=1800

-- HTTP port for incoming connections
cfg.http_port=4044

-- syslog facility (syslog,local0-local7)
cfg.log_facility='local0'

-- 'cfg.daemon' detach server from terminal
cfg.daemon=true

-- silent mode - no logs, no pid file
cfg.embedded=true

-- 'cfg.debug' enables SSDP debug output to stdout (if cfg.daemon=false)
-- 0-off, 1-basic, 2-messages
cfg.debug=1

-- external 'udpxy' url for multicast playlists (udp://@...)
--cfg.udpxy_url='http://192.168.1.90:4022'

-- downstream interface for builtin multicast proxy (comment 'cfg.udpxy_url' for processing 'udp://@...' playlists)
cfg.mcast_interface='br0'

-- 'cfg.proxy' enables proxy for injection DLNA headers to stream
-- 0-off, 1-radio, 2-radio/TV
cfg.proxy=0

-- User-Agent for proxy
cfg.user_agent='Mozilla/5.0'

-- I/O timeout
cfg.http_timeout=30

-- enables UPnP/DLNA notify when reload playlist
cfg.dlna_notify=true

-- UPnP/DLNA subscribe ttl
cfg.dlna_subscribe_ttl=1800

-- group by 'group-title'
cfg.group=true

-- sort files
cfg.sort_files=true

-- Device name
cfg.name='Lordpedal IPTV'

-- static device UUID, '60bd2fb3-dabe-cb14-c766-0e319b54c29a' for example or nil
cfg.uuid='60bd2fb3-dabe-cb14-c766-0e319b54c29a'

-- max url cache size
cfg.cache_size=8

-- url cache item ttl (sec)
cfg.cache_ttl=900

-- default mime type (mpeg, mpeg_ts, mpeg1, mpeg2, ts, ...)
cfg.default_mime_type='mpeg_ts'

-- feeds update interval (seconds, 0 - disabled)
cfg.feeds_update_interval=0
cfg.playlists_update_interval=0

-- playlist (m3u file path or path with alias
playlist=
{
--    { './playlists/mozhay.m3u', 'Mozhay.tv' },
--    { './localmedia', 'Local Media Files' }
--    { './private', 'Private Media Files', '127.0.0.1;192.168.1.1' }  -- only for 127.0.0.1 and 192.168.1.1
}

-- feeds list (plugin, feed name, feed type)
feeds=
{
    { 'vimeo',          'channel/hd',           'Vimeo HD Channel' },
    { 'vimeo',          'channel/hdxs',         'Vimeo Xtreme sports' },
    { 'vimeo',          'channel/mtb',          'Vimeo MTB Channel' },
    { 'youtube',        'channel/top_rated',    'YouTube Top Rated' },
--    { 'youtube',        'Drift0r',              'Drift0r' },
--    { 'youtube',        'XboxAhoy',             'XboxAhoy' },
--    { 'ag',             'videos',               'AG - New' },
--    { 'ivi',            'new',                  'IVI - New' },
--    { 'gametrailers',   'ps3',                   'GT - PS3' },
--    { 'giantbomb',      'all',                  'GiantBomb - All' },
--    { 'dreambox',       'http://192.168.0.1:8001/','Dreambox1' },
}

-- log ident, pid file end www root
cfg.version='1.034'
cfg.log_ident=arg[1] or 'xupnpd'
cfg.pid_file='/var/run/'..cfg.log_ident..'.pid'
cfg.www_root='./www/'
cfg.tmp_path='/tmp/'
cfg.plugin_path='./plugins/'
cfg.config_path='./config/'
cfg.playlists_path='./playlists/'
--cfg.feeds_path='/tmp/xupnpd-feeds/'
cfg.ui_path='./ui/'
cfg.drive=''                    -- reload playlists only if drive state=active/idle, example: cfg.drive='/dev/sda'
cfg.profiles='./profiles/'      -- device profiles feature

dofile('xupnpd_main.lua')
```

Guardamos los cambios, salimos del editor de texto y vamos a editar una lista de prueba:

```bash
cd /etc/xupnpd/playlists && \
sudo rm *.m3u && sudo nano Youtube.m3u
```

Y le agregamos el siguiente contenido de prueba:

```bash
#EXTM3U name="Youtube by Lordpedal" type=mp4 plugin=youtube
#EXTINF:0 group-title="Youtube",Leo el camion
https://www.youtube.com/watch?v=bSvfRukSU8Y
#EXTINF:0 group-title="Youtube",Cleo y Cuquin
https://www.youtube.com/watch?v=BGw9met3BaY
#EXTINF:0 group-title="Youtube",Cleo y Cuquin (Karaoke)
https://www.youtube.com/watch?v=3AcjgyPakwQ
#EXTINF:0 group-title="Youtube",Pocoyo - Parte 1
https://www.youtube.com/watch?v=SP05XjJFeoo
#EXTINF:0 group-title="Youtube",Pocoyo - Parte 2
https://www.youtube.com/watch?v=lkXBGs9iH2Y
```

Guardamos los cambios, salimos del editor de texto y ejecutamos el programa para probarlo:

```bash
sudo /etc/xupnpd/xupnpd &
```

Podemos comprobar que el programa esta funcionando correctamente, abriendo en un navegador web a traves de nuestra red local el siguiente enlace:

> http://192.168.1.90:4044

Este paso tendriamos que realizarlo cada vez que iniciemos el servidor y deseemos hacer uso de xupnpd, para ellos vamos a ayudarnos nuevamente de `/etc/rc.local` para configurarlo debidamente:

```bash
sudo nano /etc/rc.local
```

Y lo dejamos con los cambios que hemos ido agregando para que quede de la `siguiente forma definitiva`: 

```bash
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
#
# IPTV
/usr/local/bin/udpxy -p 4022 -B 270Kb -R 183 -H -1 -c 7 & >/dev/null 2>&1
/etc/xupnpd/xupnpd & >/dev/null 2>&1
# SALIR
exit 0
```

Guardamos los cambios, salimos del editor de texto y cada vez que arranque tendremos operativo el servicio.


> Pendiente de seguir actualizando...
