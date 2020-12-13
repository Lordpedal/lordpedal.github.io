---
title:  "Debian 10 Buster: Servidor PC"
date:   2019-07-06 10:00:00 -0300
last_modified_at: 2020-12-12T16:15:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Servidor
  - Debian
author:
  - Lordpedal
---

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

El usuario de sistema sobre el que realizare la guía es `pi` para seguir en la linea del blog, recordad sustituir dicho usuario por el que habéis creado durante la instalación.

Planteado el guión inicial vamos a personalizar nuestra instalación, pero antes recordando que los ajustes en su mayor parte los ejecutaremos desde una *terminal de sistema*.

{% include toc title="Secciones" icon="cog" %}

### AJUSTANDO PERFIL [SUDO](https://es.wikipedia.org/wiki/Sudo){:target="_blank"} 

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

###  AJUSTANDO REPOSITORIOS SISTEMA

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

###  UTILIDADES SISTEMA

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
linux-headers-`uname -r`
```
###  CONFIGURANDO IDIOMA SISTEMA

Ejecutaremos un pequeño asistente con la orden de terminal:

```bash
sudo dpkg-reconfigure locales
```
Para poner nuestro sistema en español, tenemos que marcar las siguientes opciones en el asistente configuración de locales y deseleccionar cualquier otra que pudiese estar activa:

```bash
[ ] en_GB.UTF-8 UTF-8 
[x] es_ES ISO-8859-1 
[x] es_ES.UTF-8 UTF-8 
[x] es_ES@euro ISO-8859-15
```
Para la configuración regional predeterminada seleccionamos:

```bash
[x] es-ES.UTF-8
```
###  HABILITANDO INICIO EN [TTY](https://es.wikipedia.org/wiki/Emulador_de_terminal){:target="_blank"}

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

###  HABILITANDO RC.LOCAL

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

###  IDENTIFICANDO RED

Ahora vamos a proceder a configurar y securizar nuestra red doméstica.
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

### IPV4 Forward + BR0

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

### DNS Pública

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

### OPENVPN (Opcional)

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
