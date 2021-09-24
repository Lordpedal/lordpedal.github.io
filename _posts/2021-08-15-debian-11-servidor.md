---
title:  "Debian 11 Bullseye: Servidor PC"
date:   2021-08-15 10:00:00
last_modified_at: 2021-08-15T11:00:00
header:
  image: /assets/images/posts/debiantt.gif
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

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
En esta sección pretendo hablar de como optimizar y adaptar la distribución **Debian Bullseye** a un uso diario como **Servidor doméstico**, desde mi propia experiencia de usuario.

{% include video id="573595834" provider="vimeo" %}

El recomendar `Debian` es poder usar la combinación de un **Sistema Operativo Libre y alternativo** con una gran comunidad de soporte detrás del proyecto.

En la [web de descargas](https://www.debian.org/releases/stable/){: .btn .btn--warning .btn--small}{:target="_blank"} podremos elegir la distribución que más se adapte a nuestras necesidades. 

Para el caso de esta guía vamos a emplear la plataforma `AMD64`, que es la *más recomendable* para uso en un PC con **Procesador 64bits** [Descarga directa](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/){: .btn .btn--success .btn--small}{:target="_blank"}

Adicionalmente en la propia web podemos encontrar unas excelentes [guías de instalación](https://www.debian.org/releases/stable/installmanual){: .btn .btn--warning .btn--small}{:target="_blank"} donde el proceso de instalación es guiado con todo tipo de detalles, aunque he creado este video detallando parte del proceso:

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/db11vm.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/db11vm.webm"  type="video/webm"  />
   </video>
</div>

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
Se nos solicitara la *contraseña* de **root** que previamente le dimos en la instalación. Procedemos a instalar la aplicación:

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

Vamos a repasar los principales atajos de teclado que encontramos en el editor [nano](https://es.wikipedia.org/wiki/GNU_Nano){: .btn .btn--inverse .btn--small}{:target="_blank"}:

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
{: .notice--info}

Añadimos privilegios *sudo* a nuestro usuario editando la configuración:

```bash
nano /etc/sudoers
```
Y agregamos la siguiente sentencia al final del archivo:

```bash
pi ALL=(ALL) NOPASSWD: ALL
```
Guardamos los cambios, salimos del editor de texto y salimos de la sesión root.

```bash
exit
```
Y ya tendremos configurado debidamente el perfil sudo en nuestro usuario de sistema.

###  Ajustando: Repositorios Sistema

El [gestor de paquetes](https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_paquetes){: .btn .btn--inverse .btn--small}{:target="_blank"} `Apt`/`Aptitude`/`Synaptic` de nuestra distribución se basa en un listado de fuentes de instalación. 
Primero haremos un backup de las actuales y crearemos una personalizada:

```bash
cd /etc/apt && \
sudo mv sources.list sources.pi && \
sudo nano sources.list
```
En el documento en blanco que se nos abre, añadimos las nuevas personalizadas:

```bash
# Oficiales
deb http://deb.debian.org/debian/ bullseye main contrib non-free
deb-src http://deb.debian.org/debian/ bullseye main contrib non-free

# Seguridad
deb http://security.debian.org/debian-security bullseye-security main contrib non-free
deb-src http://security.debian.org/debian-security bullseye-security main contrib non-free

# Actualizaciones Sistema
deb http://deb.debian.org/debian/ bullseye-updates main contrib non-free
deb-src http://deb.debian.org/debian/ bullseye-updates main contrib non-free

# Backports
deb https://deb.debian.org/debian bullseye-backports main contrib non-free
deb-src https://deb.debian.org/debian bullseye-backports main contrib non-free
```

Guardamos los cambios, salimos del editor de texto y actualizamos el listado de paquetes de software y posibles actualizaciones del mismo:

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

Posiblemente tendrás algún `controlador` pendiente de actualizar y/o instalar el `driver necesario` para poder interactuar con el y no esta compilado en el kernel. Una solución sencilla es instalar un paquete con algunos de los principales drivers (3Com, Atheros, Radeon, …), y si además queremos maximizar la eficiencia de nuestro procesador instalaremos este parche:

> AMD 64bits & INTEL 64bits
{: .notice--info}

```bash
sudo apt-get update && \
sudo apt-get -y install firmware-linux-nonfree \
amd64-microcode intel-microcode
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
sudo apt-get -y install mc htop curl bc git wget curl dnsutils exfat-fuse ntfs-3g hfsprogs \
hfsplus build-essential automake libtool uuid-dev psmisc linux-source yasm \
autoconf g++ subversion linux-source tofrodos git-core subversion dos2unix \
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
- [x] es_ES.UTF-8 UTF-8 
{: .notice}

Para la configuración regional predeterminada seleccionamos:

- [x] es-ES.UTF-8
{: .notice}

Ejemplo salida comando:

```bash
pi@overclock:~ $ sudo dpkg-reconfigure locales
Generating locales (this might take a while)...
  es_ES.UTF-8... done
Generation complete.
```
Y a continuación configuro franja horaria sistema con el asistente:

```bash
sudo dpkg-reconfigure tzdata
```

Ejemplo salida comando:

```bash
pi@roverclock:~ $ sudo dpkg-reconfigure tzdata

Current default time zone: 'Europe/Madrid'
Local time is now:      Sun Jul 15 11:11:42 CET 2021.
Universal Time is now:  Sun Jul 15 11:11:42 UTC 2021.
```

###  Configurando [TTY](https://es.wikipedia.org/wiki/Emulador_de_terminal){:target="_blank"}

Este paso aunque no es obligatorio en un entorno de Servidor, si lo considero que es altamente recomendado para optimizar recursos de sistema. Lo que vamos a hacer es deshabilitar el autoinicio del entorno gráfico instalado [MATE](https://es.wikipedia.org/wiki/MATE){: .btn .btn--info .btn--small}{:target="_blank"}

Lo que debemos de hacer a continuacón es adaptar el sistema a un arranque sin gestor de inicio sesiones [LightDM](https://es.wikipedia.org/wiki/LightDM){: .btn .btn--danger .btn--small}{:target="_blank"}

Para ello instalamos y configuramos la siguiente dependencia:

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
Guardamos los cambios y salimos del editor de texto. Ahora vamos a reconfigurar SystemD para el arranque en terminal:

```bash
sudo systemctl set-default multi-user.target
```
Llegado a este punto el sistema tras un reinicio o encendido del PC nos solicitaria el usuario: **pi** y su contraseña: ************ para hacer login en terminal.

<figure>
    <a href="/assets/images/posts/ttylogin.png"><img src="/assets/images/posts/ttylogin.png"></a>
</figure>

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
Guardamos los cambios y salimos del editor de texto.

###  Configurando RC.LOCAL

Si no queremos crear un script único para la ejecución de un comando o un script cada vez que iniciamos un sistema tipo Unix (BSD, Gnu/Linux, etc) tenemos la posibilidad de llamarlo desde el fichero **/etc/rc.local**.

Cualquier comando que coloquemos o script al que llamemos en dicho fichero será ejecutado al final del arranque, es decir, cuando todos los scripts que tenemos en el runlevel correspondiente hayan sido ejecutados. 

Esta opción no viene habilitada por defecto en Debian 11 y para ello tendremos que habilitarla, creamos el servicio para [Systemd](https://es.wikipedia.org/wiki/Systemd){: .btn .btn--inverse .btn--small}{:target="_blank"}:

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
Guardamos los cambios, salimos del editor de texto, ahora pasamos a crear el fichero **rc.local**

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
Guardamos los cambios, salimos del editor de texto, debemos de darle permisos de ejecución al ficher creado:

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
{: .notice--info}

### Alías

En informática `alias` es una **orden disponible** en varios **intérpretes de comandos** tales como los **shells de Unix, 4DOS/4NT y Windows PowerShell**, que permite reemplazar una palabra o serie de palabras con otra. Su uso principal es el de abreviar órdenes o para añadir argumentos de forma predeterminada a una orden que se usa con mucha frecuencia. Los alias se mantienen hasta que se termina la sesión en la terminal, pero normalmente se suelen añadir en el fichero de configuración del intérprete de órdenes para de esta forma siempre están disponibles para todas las sesiones de terminal.

Un ejemplo clarifica este tema de forma sencilla, en **TTY** un alías que suelo usar es `reiniciar`, que ejecuta la orden `sudo reboot`.

Para configurar los alías editaremos el fichero de configuración de nuestra distro para que tanto el usuario `root` como `pi` tengan acceso a ellos:

```bash
sudo nano /etc/bash.bashrc
```

Y añadiremos al final del fichero los alías que definamos, adjunto mi fichero de configuración:

```bash
# System-wide .bashrc file for interactive bash(1) shells.

# To enable the settings / commands in this file for login shells as well,
# this file has to be sourced in /etc/profile.

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, overwrite the one in /etc/profile)
PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '

# Commented out, don't overwrite xterm -T "title" -n "icontitle" by default.
# If this is an xterm set the title to user@host:dir
#case "$TERM" in
#xterm*|rxvt*)
#    PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD}\007"'
#    ;;
#*)
#    ;;
#esac

# enable bash completion in interactive shells
#if ! shopt -oq posix; then
#  if [ -f /usr/share/bash-completion/bash_completion ]; then
#    . /usr/share/bash-completion/bash_completion
#  elif [ -f /etc/bash_completion ]; then
#    . /etc/bash_completion
#  fi
#fi

# if the command-not-found package is installed, use it
if [ -x /usr/lib/command-not-found -o -x /usr/share/command-not-found/command-not-found ]; then
        function command_not_found_handle {
                # check because c-n-f could've been removed in the meantime
                if [ -x /usr/lib/command-not-found ]; then
                   /usr/lib/command-not-found -- "$1"
                   return $?
                elif [ -x /usr/share/command-not-found/command-not-found ]; then
                   /usr/share/command-not-found/command-not-found -- "$1"
                   return $?
                else
                   printf "%s: command not found\n" "$1" >&2
                   return 127
                fi
        }
fi
#
# Alias
#
alias reiniciar="sudo reboot"
alias apagar="sudo poweroff"
alias instalar="sudo apt-get -y install"
alias desinstalar="sudo apt-get -y purge"
alias actualizar="sudo apt-get autoclean && sudo apt-get clean && sudo apt-get -y autoremove && sudo apt-get update && sudo apt-get -y upgrade && sudo apt-get -y dist-upgrade && sudo apt-get moo"
alias limpiarcache="sudo ldconfig && sudo sync && sudo sysctl -w vm.drop_caches=2 && sudo sync"
alias win="startx"
alias enlaces="sudo nano /etc/bash.bashrc"
alias grubfix="sudo nano /etc/default/grub && sudo update-grub"
```

Guardamos los cambios, salimos del editor de texto y para activarlos tendremos que volver a abrir la sesión TTY para ello solo basta con salir de ella:

```bash
exit
```

Y cuando tengamos de nuevo la **TTY** operativa con lanzar el comando `actualizar` se nos actualizara el **Sistema Operativo** a las última versión disponible.

Dejo un extracto de la ejecución del comando:

```bash
pi@overclock:~$ actualizar
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
Obj:1 http://deb.debian.org/debian bullseye InRelease
Des:2 http://deb.debian.org/debian bullseye-updates InRelease [36,8 kB]
Obj:3 http://security.debian.org/debian-security bullseye-security InRelease
Descargados 36,8 kB en 3s (11,9 kB/s)
Leyendo lista de paquetes... Hecho
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Calculando la actualización... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias... Hecho
Leyendo la información de estado... Hecho
Calculando la actualización... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
                 (__) 
                 (oo) 
           /------\/ 
          / |    ||   
         *  /\---/\ 
            ~~   ~~   
..."Have you mooed today?"...
```

### GRUB

[Grub](https://es.wikipedia.org/wiki/GNU_GRUB){: .btn .btn--inverse .btn--small}{:target="_blank"} es el **gestor de arranque** que tengo instalado con la distro GNU/Linux Debian. La distro esta instalada sobre un disco SSD, y aquí voy añadir un pequeño MOD casi obligado para prolongar la vida del mismo.

Un Programador de E/S es la forma de manejar la lectura de los datos de los dispositivos de bloque, incluyendo la memoria principal, y tambien el área de intercambio. 

El kernel de Linux, que es el núcleo del sistema operativo, es responsable de controlar el acceso al disco usando planeacion de E/S programada. 

Ahora puede optimizar el núcleo de E/S durante el arranque, debemos de elegir entre uno de los cuatro diferentes existentes:

 * Completely Fair Queuing: **elevator=cfq**
 * Deadline: **elevator=deadline**
 * NOOP: **elevator=noop**
 * Anticipatory: **elevator=as**
{: .notice--info}

[Ampliar información](http://www.alcancelibre.org/staticpages/index.php/planificadores-entrada-salida-linux){: .btn .btn--danger .btn--small}{:target="_blank"}

Lanzamos el alías de edición de Grub:

```bash
grubfix
```

Y aquí dejo mi fichero de configuración para un SSD el cual recomiendo configurar con `elevator=noop`, aunque si tu HD no es SSD también se ha demostrado una mejora de rendimiento.

```bash
# If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'

GRUB_DEFAULT=0
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet"
GRUB_CMDLINE_LINUX="elevator=noop"

# Uncomment to enable BadRAM filtering, modify to suit your needs
# This works with Linux (no patch required) and with any kernel that obtains
# the memory map information from GRUB (GNU Mach, kernel of FreeBSD ...)
#GRUB_BADRAM="0x01234567,0xfefefefe,0x89abcdef,0xefefefef"

# Uncomment to disable graphical terminal (grub-pc only)
#GRUB_TERMINAL=console

# The resolution used on graphical terminal
# note that you can use only modes which your graphic card supports via VBE
# you can see them in real GRUB with the command `vbeinfo'
#GRUB_GFXMODE=640x480

# Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
#GRUB_DISABLE_LINUX_UUID=true

# Uncomment to disable generation of recovery mode menu entries
#GRUB_DISABLE_RECOVERY="true"

# Uncomment to get a beep at grub start
#GRUB_INIT_TUNE="480 440 1"
```

Guardamos los cambios, salimos del editor de texto y se nos regenera el fichero BOOT con los cambios realizados:

```bash
pi@overclock:~$ grubfix
Generando un fichero de configuración de grub...
Encontrada imagen fondo de pantalla: /usr/share/images/desktop-base/desktop-grub.png
Encontrada imagen de linux: /boot/vmlinuz-5.10.0-8-amd64
Encontrada imagen de memoria inicial: /boot/initrd.img-5.10.0-8-amd64
hecho
```

Faltaría reiniciar el Servidor para aplicar los nuevos cambios:

```bash
reiniciar
```

#### Optimizar SSD

Si contamos con **más de 4GB de RAM**, podemos hacer que la carpeta temporal del sistema no use el disco duro. Es la carpeta donde escriben muchas aplicaciones que estamos usando. Son datos que se borran al apagar el ordenador, con lo que no nos importa que se escriban en RAM. Para activarlo editamos nuevamente fstab:

```bash
sudo nano /etc/fstab
```

Y agregamos la siguiente sentencia al final del fichero:

```bash
# MODS SSD
tmpfs   /tmp   tmpfs  noatime,nodiratime,nodev,nosuid,mode=1777,defaults    0   0
```

Guardamos los cambios y salimos del editor de texto. Adjunto como queda mi fichero **fstab**:

```bash
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sdc2 during installation
#
# SSD
UUID=ea691ed1-9a94-47b3-8534-3e00c7f0922f   /   ext4    noatime,nodelalloc,i_version,inode_readahead_blks=64,errors=remount-ro  0   1
# SWAP 
UUID=b64de4e0-eedf-4e31-aeeb-e460ef6ac57c   none    swap    sw  0   0
#
# Lector DVD
#/dev/sr0   /media/cdrom0   udf,iso9660 user,noauto 0   0
#
# NAS
UUID=2f42917d-7c1f-4b7f-bff0-963f19b9dcf5   /media/rednas   ext4    defaults,relatime  0    0
#
# MODS SSD
tmpfs   /tmp    tmpfs   noatime,nodiratime,nodev,nosuid,mode=1777,defaults  0   0
```

La partición swap, como ya sabéis es una partición cuyo fin principal es su uso cuando la RAM está llena, pero la cual no está vacía aunque tengas la RAM a la mitad. 

Por ello es recomendable decirle al sistema que la use lo menos posible, sólo si es estrictamente necesario, editando:

```bash
sudo nano /etc/sysctl.conf
```

Y agregamos al final del fichero las siguientes ordenes:

```bash
#
# MODS
#
vm.swappiness=1
vm.vfs_cache_pressure=50
vm.dirty_writeback_centisecs=1500
kernel.dmesg_restrict=0
net.core.rmem_max=16777216
net.core.wmem_max=4194304
kernel.unprivileged_userns_clone=1
```

Guardamos los cambios y salimos del editor de texto. 

Has de saber que cuando borramos un fichero, el sistema operativo lo marca como espacio utilizable. 

Los discos SSD pueden encargarse de controlar dichos bloques de espacio y reagruparlos, con lo que a través de la controladora del disco, la gestión del espacio será más rápida. 

Para que la controladora se encargue, le solicitamos que analice el disco desde el sistema operativo con el comando **fstrim**. 

Vamos a programar esta tarea, para que la realice a diario:

```bash
sudo nano /etc/cron.daily/fstrim
```

Y agregamos el siguiente contenido:

```bash
#!/bin/sh
/sbin/fstrim --all || true
```

Guardamos los cambios, salimos del editor de texto y le damos permisos de ejecución:

```bash
sudo chmod +x /etc/cron.daily/fstrim
```

Solamente nos queda reiniciar el Servidor para activar las nuevas mejoras:

```bash
sudo reboot
```

Adicionalmente me gusta agregar que tras 10 reinicios el sistema compruebe errores:

```bash
sudo tune2fs -c 10 /dev/sda1
```

### Modding

Antes de empezar con la parte de **Modding**, necesitamos instalar una dependencia, que nos dara información sobre la temperatura de nuestro sistema.

```bash
sudo apt-get update && \
sudo apt-get -y install lm-sensors
```

A continuación debemos de ejecutar un script instalado que nos detecta la configuración de nuestro `Servidor` y...

```bash
sudo sensors-detect
```

...**le damos continuamente a la tecla** `INTRO` para que tome la respuesta por defecto que es siempre que sí y de esta forma buscará todos los chips que podría analizar.

Contiuamos hasta que nos salga la siguiente pregunta: 

`Do you want to add these lines to /etc/modules automatically? (yes/NO)`

En este momento copiad y guardad en un documento de texto temporal lo que tenéis por encima entre los dos **cut here** (por ejemplo a mí me ha salido lo siguiente):

```bash
#----cut here----
# Chip drivers
coretemp
#----cut here----
```

Le damos nuevamente a **INTRO** para que no añada esas líneas automáticamente al fichero de [modulos](https://es.wikipedia.org/wiki/M%C3%B3dulo_de_n%C3%BAcleo){: .btn .btn--inverse .btn--small}{:target="_blank"} ya que las agregaremos manualmente para evitar posibles fallos de incompatibilidad, para ello editamos el fichero:

```bash
sudo nano /etc/modules
```

Y agregamos la siguientes lineas al final del fichero:

```bash
# Chip drivers
coretemp
```

Guardamos los cambios y salimos del editor de texto. Muestro como ha quedado mi fichero:

```bash
pi@overclock:~$ cat /etc/modules
# /etc/modules: kernel modules to load at boot time.
#
# This file contains the names of kernel modules that should be loaded
# at boot time, one per line. Lines beginning with "#" are ignored.
#
# Chip drivers
coretemp
```

Recomiendo reiniciar el Servidor para activar los cambios:

```bash
sudo reboot
```

Tras el reinicio ya podremos ver la información que hemos configurado:

```bash
sensors
```

En mi caso la información devuelta es la siguiente:

```bash
pi@overclock:~$ sensors
acpitz-virtual-0
Adapter: Virtual device
temp1:        +27.8°C  (crit = +119.0°C)
temp2:        +29.8°C  (crit = +119.0°C)

coretemp-isa-0000
Adapter: ISA adapter
Physical id 0:  +33.0°C  (high = +84.0°C, crit = +100.0°C)
Core 0:         +30.0°C  (high = +84.0°C, crit = +100.0°C)
Core 1:         +30.0°C  (high = +84.0°C, crit = +100.0°C)
Core 2:         +29.0°C  (high = +84.0°C, crit = +100.0°C)
Core 3:         +27.0°C  (high = +84.0°C, crit = +100.0°C)
```

####  $USER/.BASHRC

El fichero `.bashrc` es un archivo script que se ejecuta cada vez que una nueva sesión de terminal server se inicia en el modo interactivo. Esto es lo que ocurre cuando se inicia TTY o simplemente abrir una nueva pestaña de terminal. Este fichero contiene una serie de configuraciones para la sesión de terminal. Vamos a editarlo para mejorarlo:

```bash
cd /home/$USER && nano .bashrc
```

Buscamos la variable `#force_color_prompt=yes` y la descomentamos quedando en el fichero sin la `#` de la siguiente forma:

```bash
force_color_prompt=yes
```

Nos movemos con el editor al final del fichero y añadimos el siguiente script:

```bash
# MOTD
show_temp(){
    sensors | grep -oP 'Core 0.*?\+\K[0-9]+'
}
let upSeconds="$(/usr/bin/cut -d. -f1 /proc/uptime)"
let secs=$((${upSeconds}%60))
let mins=$((${upSeconds}/60%60))
let horas=$((${upSeconds}/3600%24))
let dias=$((${upSeconds}/86400))
UPTIME=`printf "%d dias, %02dh%02dm%02ds" "$dias" "$horas" "$mins" "$secs"`
read one five fifteen rest < /proc/loadavg
echo "$(tput setaf 2)
`date +"%A, %e %B %Y, %r"`
`uname -srmo`$(tput setaf 1)
Tiempo de actividad..: ${UPTIME}
Memoria RAM..........: `cat /proc/meminfo | grep MemFree | awk {'print $2'}`kB (Free) / `cat /proc/meminfo | grep MemTotal | awk {'print $2'}`kB (Total)
Promedios de carga...: ${one}, ${five}, ${fifteen} (1, 5, 15 min)
Procesos activos.....: `ps ax | wc -l | tr -d " "`
IP conexion por SSH..: $(echo $SSH_CLIENT | awk '{ print $1}')
Temperatura Sistema..: $(show_temp)ºC
$(tput sgr0)"
```

Guardamos los cambios, salimos del editor de texto y creamos el siguiente archivo:

```bash
nano .inputrc
```

Con el siguiente contenido:

```bash
# Flecha arriba
"\e[A":history-search-backward
# Flecha abajo
"\e[B":history-search-forward
```

Guardamos los cambios, salimos del editor de texto y reiniciamos para ver los cambios.

```bash
reiniciar
```

Adjunto resultado de lo que veremos tras el reinicio:

```bash
Linux overclock 5.10.0-8-amd64 #1 SMP Debian 5.10.46-4 (2021-08-03) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
You have mail.
Last login: Sun Aug 15 12:00:00 2021 from 192.168.1.99

domingo, 15 agosto 2021, 12:04:32 
Linux 5.10.0-8-amd64 x86_64 GNU/Linux
Tiempo de actividad..: 0 dias, 00h03m47s
Memoria RAM..........: 27151572kB (Free) / 32831084kB (Total)
Promedios de carga...: 0.08, 0.09, 0.09 (1, 5, 15 min)
Procesos activos.....: 236
IP conexion por SSH..: 192.168.1.112
Temperatura Sistema..: 32.0ºC

pi@overclock:~$
```

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

Ahora se que mi dispositivo de red cableada esta identificado como `ens33` y que la IP en mi red es `192.168.1.250` rango [DHCP](https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host){: .btn .btn--inverse .btn--small}{:target="_blank"}

### Configurando RED

Vamos a habilitar la [redicción de puertos sobre IPv4](https://es.wikipedia.org/wiki/Redirecci%C3%B3n_de_puertos){: .btn .btn--inverse .btn--small}{:target="_blank"} que posteriormente usaremos para entre otros configurar debidamente la VPN.

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
Guardamos los cambios, salimos del editor de texto y pasamos a configurar una [red Bridge](https://es.wikipedia.org/wiki/Puente_de_red){: .btn .btn--inverse .btn--small}{:target="_blank"} con [IP estática](https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP){: .btn .btn--inverse .btn--small}{:target="_blank"}:

```bash
sudo apt-get update && \
sudo apt-get -y install bridge-utils net-tools ifupdown && \
sudo mv /etc/network/interfaces /etc/network/interfaces.bak && \
sudo nano /etc/network/interfaces
```
En el documento en blanco que se nos abre, lo configuro con mi nombre de red `ens33` y la ip estática que le voy a configurar `192.168.1.90`:

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

# Bridge IPV6
iface br0 inet6 auto
	accept_ra 1
```        

Guardamos los cambios, salimos del editor de texto y nos queda corregir un posible fallo aunque no es común, en el fichero de resolución de DNS:

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

Guardamos los cambios, salimos del editor de texto y a continuación debemos de reiniciar el servidor para aplicar los nuevos cambios producidos en el dispositivo de red:

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

### @Lordpedal BOT

Adicional al [Canal de Telegram](https://telegram.me/Lordpedal_RSS){: .btn .btn--info .btn--small}{:target="_blank"} donde público enlaces de interés, también dispongo en la red de un `BOT` que podeis usar para notificar eventos en vuestro sistema con ayuda de unos scripts. 

En Telegram podeís encontrarlo con el alías [@Lordpedalbot](https://telegram.me/Lordpedalbot){: .btn .btn--success .btn--small}{:target="_blank"}

**Cuando lo arranques te dará la bienvenida y te notificará el ID** que tienes en la red Telegram, este `ID` debes de anotarlo, porque será una variable que uses en los scripts que modificaremos a continuación.

**NOTA**: El token de referencia que se va usar en los scripts no tiene validez, haz de usar tu propio bot u otro token conocido. Para ello debes de reemplazar el valor `289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA` por otro.
{: .notice--info}

####  Protección TSHH

La función de este bash script es la de informarte vía Telegram de una anomalía en la temperatura del sistema y proceder a un apagado del mismo de forma controlada. Vamos a crear el script:

```bash
mkdir -p $HOME/scripts && \
cd $HOME/scripts && \
nano tshh.sh && \
chmod +x tshh.sh
```

Y le agregamos el siguiente contenido:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# Fichero Log
data=`date`
usu=`uname`
ini=`echo "Script alarma de temperatura ejecutada con éxito"`
rutalog=/home/$USER
# ID Telegram
telegram=79593223
# Temperatura máxima
overheat=70
# Calcula temperatura y crea temporales de calculo
sensors | grep -oP 'Core 0.*?\+\K[0-9]+' > termopar
# Ejecuta alarma y aviso por telegram
while read tempactual
do
if [ "$tempactual" -ge "$overheat" ]
then
echo "$data - $usu - $ini. Ejecutada protección de temperatura. Alcanzados $tempactualºC" >> $rutalog/tshh.log
/usr/bin/curl --silent --output /dev/null --data-urlencode "chat_id=$telegram" --data-urlencode "text=Temperatura del Sistema:$tempactualºC. Por seguridad ejecutado el protocolo de apagado sistema" "https://api.telegram.org/bot289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA/sendMessage"
# Apaga el sistema
sudo poweroff
else
echo "Temperatura de sistema: $tempactualºC"
fi
done<termopar
# Borra los temporales generados
rm termopar
```

**NOTA:** Recuerda que el valor del `ID de Telegram` debes de **sustituirlo por el tuyo propio** y el valor `overheat cambialo` según rangos de temperatura de tu procesador obtenido tras ejecutar: `sensors`, en mi caso el rango que obtenía era de (high = +84.0°C, crit = +100.0°C) por eso defino `70°C` como valor más conservador.
{: .notice--warning}

Guardamos los cambios, salimos del editor de texto y programamos el sistema para que el script sea ejecutado cada `15 segundos`:

```bash
crontab -e
```

Y añadimos al final el fichero, recuerda sustituir `pi` por tu usuario:

```bash
*/1 * * * * /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 15 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 30 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 45 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
```

Guardamos los cambios, salimos del editor de texto y listo ya tendriamos la protección activa. El fichero en mi caso queda de la siguiente forma:

```bash
pi@overclock:~$ crontab -l
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
#
*/1 * * * * /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 15 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 30 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 45 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
```

####  Notificación Arranque Servidor

La función de este bash script es la de informarte vía Telegram de que el Servidor esta online. Vamos a crear el script:

```bash
mkdir -p $HOME/scripts && \
cd $HOME/scripts && \
nano overspeed.sh && \
chmod +x overspeed.sh
```

Y le agregamos el siguiente contenido:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# ID Telegram
telegram=79593223
# Mensaje Online
mensaje='Overclock Server Online ... Another fine release by Lordpedal'
# Inicia bucle chequeo de Red
while true
do
    # Comprueba disponibilidad de Red
    if ping -c 1 -W 5 google.com 1>/dev/null 2>&1
    then
        # Red disponible
        echo "Conexion establecida..."
        /usr/bin/curl --silent \
                --output /dev/null \
                --data-urlencode "chat_id=$telegram" \
                --data-urlencode "text=$mensaje" \
                "https://api.telegram.org/bot289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA/sendMessage"
        # Termina bucle disponibilidad de Red
        break
    else
        # Red no disponible
        echo "Conexion no establecida..."
    fi
    # Espera 1s y reinicia bucle
    sleep 1
done
```

**NOTA:** Recuerda que el valor del `ID de Telegram` debes de **sustituirlo por el tuyo propio** y el valor `mensaje` cambialo por tu mensaje personalizado.
{: .notice--warning}

Guardamos los cambios, salimos del editor de texto y programamos el sistema para que el script sea ejecutado tras reinicio de sistema y disponibilidad de red:

```bash
crontab -e
```

Y añadimos al final el fichero, recuerda sustituir `pi` por tu usuario:

```bash
@reboot /home/pi/scripts/overspeed.sh >/dev/null 2>&1
```

Guardamos los cambios, salimos del editor de texto y listo ya tendriamos la notificación activa. El fichero en mi caso queda de la siguiente forma:

```bash
pi@overclock:~$ crontab -l
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
#
*/1 * * * * /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 15 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 30 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
*/1 * * * * sleep 45 && /home/pi/scripts/tshh.sh >/dev/null 2>&1
@reboot /home/pi/scripts/overspeed.sh >/dev/null 2>&1
```

### P3DNS

Es un docker-compose que integra las siguientes herramientas:

 * `Pi-hole`: Aplicación centrada en **bloqueo de publicidad y entornos maliciosos de la red**.

 * `DNScrypt-Proxy`: Aplicación **proxy de cifrado mediante diferentes protocolos de criptografía** de las peticiones DNS.

 * `Cloudflared`: Aplicación de **cifrado DoH (DNS over HTTPS)** de las peticiones DNS.

Antes de continuar debemos de realizar estos pasos:

 1. Instalamos y configuramos: [Docker](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#instalaci%C3%B3n-amd64){: .btn .btn--success .btn--small}{:target="_blank"}
 2. Configuramos e instalamos: [P3DNS](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-p3dns){: .btn .btn--success .btn--small}{:target="_blank"}

### Configurando DNS Pública

Como sabras tu **IP doméstica no es tu IP pública** y al igual que en un comienzo tu IP doméstica era DHCP lo mismo ocurre con la IP pública. Por tanto para poder redireccionar servicios, necesitamos disponer de IP pública estática. 
La forma más sencilla es usar un proveedor de DNS públicas de calidad como por ejemplo [DuckDNS](https://www.duckdns.org/){: .btn .btn--inverse .btn--small}{:target="_blank"}

Entramos en la [web](https://www.duckdns.org/){: .btn .btn--inverse .btn--small}{:target="_blank"} y creamos una *cuenta gratuita* en la cual registraremos nuestro *dominio*, ejemplo: **lordpedal.duckdns.org**.

Adjunto enlace tutorial oficial:

[Tutorial de configuración en GNU/Linux vía programador de tareas cron](https://www.duckdns.org/install.jsp#linux-cron){: .btn .btn--inverse .btn--small}{:target="_blank"}

Aunque recomiendo usar la versión [Docker: DuckDNS](https://lordpedal.github.io/gnu/linux/docker/duckdns-docker/){: .btn .btn--success .btn--small}{:target="_blank"} publicada en este blog.

Luego tenemos que configurar nuestro hosts para agregar nuestra DNS Pública:

```bash
sudo nano /etc/hosts
```
Buscamos la línea:

```bash
127.0.0.1       localhost 
```

Y la modificamos con nuestra cuenta en DuckDNS:

```bash
127.0.0.1       localhost lordpedal.duckdns.org 
```

Guardamos los cambios y salimos del editor de texto.

### VPN´s

Una red privada virtual es una tecnología de red de ordenadores que permite una extensión segura de la red de área local sobre una red pública o no controlada como Internet.
Permite que el ordenador en la red envíe y reciba datos sobre redes compartidas o públicas como si fuera una red privada, con toda la funcionalidad, seguridad y políticas de gestión de una red privada. 
Esto se realiza estableciendo una conexión virtual punto a punto mediante el uso de conexiones dedicadas, cifrado o la combinación de ambos métodos.

#### Wireguard (Recomendada)

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-wireguard){: .btn .btn--success .btn--small}{:target="_blank"}

#### OpenVPN (Opcional)

Teniendo ya fijada una DNS Pública, una IP estática interna y la redirección de puertos, ya podemos proceder a configurar de forma sencilla el acceso mediante [VPN](https://es.wikipedia.org/wiki/Red_privada_virtual){: .btn .btn--inverse .btn--small}{:target="_blank"}

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

En mi caso el valor de referencia es: `10.8.0.1`. Vamos a editar la configuración del servidor de [OpenVPN](https://es.wikipedia.org/wiki/OpenVPN){: .btn .btn--inverse .btn--small}{:target="_blank"}

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

Guardamos los cambios, salimos del editor de texto y reiniciamos el servicio OpenVPN:

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

### SSH

[SSH](https://es.wikipedia.org/wiki/SSH){: .btn .btn--inverse .btn--small}{:target="_blank"} es un protocolo de comunicación que encripta los datos que se intercambian, y es virtualmente imposible romper la privacidad de la comunicación. El acrónimo ssh viene del inglés: Secure SHell.

El protocolo ssh es muy versátil, tiene un software cliente que posibilita el acceso a la línea de comandos, permite la transferencia de archivos y la creación de túneles seguros con soporte de comunicación para otros protocolos.

Los clientes ssh se dividen en dos grupos:

- Terminal SSH Es un emulador de terminal que permite acceder de forma remota desde un equipo a la línea de comandos del equipo remoto, utilizando el protocolo SSH.
- Cliente SFTP Se trata de un cliente para transferencia de archivos que utiliza el Protocolo de Transferencia Segura de Archivos. Sus siglas significan en inglés (Secure File Transfer Protocol (SFTP)

Entrando en materia, si durante la instalación de Debian no [instalamos SSH](http://www.openssh.com/){: .btn .btn--inverse .btn--small}{:target="_blank"} podemos activarlo de la siguiente forma: 

```bash
instalar openssh-server openssh-client
```

Realizado este punto o ya instalado anteriormente, sabemos que remotamente podremos acceder a nuestro Server desde nuestra red local con el siguiente comando, *recuerda sustituir usuario* `pi` *e* `ip` *por tus datos*:

```bash
ssh pi@192.168.1.90
```

Pero recomiendo dar un paso más en la seguridad de nuestro sistema, por ello ahora nos toca securizarlo en la medida de la posible **cambiando puerto por defecto 22, usuario root, ...**

Para ello editaremos el fichero de configuración SSH:

```bash
sudo nano /etc/ssh/sshd_config
```

Adjunto mi fichero de configuración con los `mods de seguridad activos`:

```bash
# This is the sshd server system-wide configuration file.  See
# sshd_config(5) for more information.

# This sshd was compiled with PATH=/usr/bin:/bin:/usr/sbin:/sbin

# The strategy used for options in the default sshd_config shipped with
# OpenSSH is to specify options with their default value where
# possible, but leave them commented.  Uncommented options override the
# default value.

Port 69
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

#HostKey /etc/ssh/ssh_host_rsa_key
#HostKey /etc/ssh/ssh_host_ecdsa_key
#HostKey /etc/ssh/ssh_host_ed25519_key

# Ciphers and keying
#RekeyLimit default none

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication:

LoginGraceTime 2m
PermitRootLogin no
#StrictModes yes
MaxAuthTries 3
MaxSessions 5

#PubkeyAuthentication yes

# Expect .ssh/authorized_keys2 to be disregarded by default in future.
#AuthorizedKeysFile     .ssh/authorized_keys .ssh/authorized_keys2

#AuthorizedPrincipalsFile none

#AuthorizedKeysCommand none
#AuthorizedKeysCommandUser nobody

# For this to work you will also need host keys in /etc/ssh/ssh_known_hosts
#HostbasedAuthentication no
# Change to yes if you don't trust ~/.ssh/known_hosts for
# HostbasedAuthentication
#IgnoreUserKnownHosts no
# Don't read the user's ~/.rhosts and ~/.shosts files
#IgnoreRhosts yes

# To disable tunneled clear text passwords, change to no here!
#PasswordAuthentication yes
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Kerberos options
#KerberosAuthentication no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes
#KerberosGetAFSToken no

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes
#GSSAPIStrictAcceptorCheck yes
#GSSAPIKeyExchange no

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via ChallengeResponseAuthentication may bypass
# the setting of "PermitRootLogin without-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and ChallengeResponseAuthentication to 'no'.
UsePAM yes

#AllowAgentForwarding yes
#AllowTcpForwarding yes
#GatewayPorts no
X11Forwarding yes
#X11DisplayOffset 10
#X11UseLocalhost yes
#PermitTTY yes
PrintMotd no
#PrintLastLog yes
#TCPKeepAlive yes
#UseLogin no
#UsePrivilegeSeparation sandbox
#PermitUserEnvironment no
#Compression delayed
#ClientAliveInterval 0
#ClientAliveCountMax 3
#UseDNS no
#PidFile /var/run/sshd.pid
#MaxStartups 10:30:100
#PermitTunnel no
#ChrootDirectory none
#VersionAddendum none

# no default banner path
#Banner none

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

# override default of no subsystems
Subsystem       sftp    /usr/lib/openssh/sftp-server

# Example of overriding settings on a per-user basis
#Match User anoncvs
#       X11Forwarding no
#       AllowTcpForwarding no
#       PermitTTY no
#       ForceCommand cvs server
```

Guardamos los cambios, salimos del editor de texto y reiniciamos el servicio:

```bash
sudo systemctl restart ssh
```

Y a partir de este momento para conectarnos por SSH lo haremos de la siguiente forma:

```bash
ssh pi@192.168.1.90 -p 69
```

####  Fail2BAN

`Fail2ban` es una **herramienta de seguridad escrita en Python** fundamental para cualquier servidor.

La principal función de [Fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page){: .btn .btn--inverse .btn--small}{:target="_blank"} es securizar un servidor del siguiente modo:

1.  Evitando accesos indeseados a nuestro equipo o servidor.
2.  Evitando ataques de fuerza bruta para que un tercero averigüe nuestra contraseña o tumbe el servidor.

Por un lado está monitorizando las autenticaciones que una determinada IP hace a un determinado/s puerto/s y servicio/s. Para ello está consultando permanente los logs de autenticación de nuestro sistema como por ejemplo el **/var/log/auth.log**. Vamos a proceder a instalarlo:

```bash
sudo apt-get update && \
sudo apt-get -y install fail2ban
```

Una vez instalado vamos a configurarlo:

```bash
cd /etc/fail2ban && sudo nano jail.conf
```

Adjunto a modo resumen las opciones a buscar y modificar:

```bash
ignoreip = 127.0.0.1/8
bantime  = 600
maxretry = 5
```

Y segundo como las dejaremos, **en mi caso la IP es de rango** `192.168.1.0`:

```bash
ignoreip = 127.0.0.1/8 192.168.1.0/24
bantime  = 3600
maxretry = 3
```

Una vez finalizada la edición, guardaremos los cambios, saldremos del editor de texto y lo activaremos en local:

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Ahora vamos a crear una configuración específica para aprovecharnos de notificaciones vía Telegram:

```bash
cd /etc/fail2ban/action.d && sudo nano telegram.conf
```

Y le agregamos el siguiente contenido:

```bash
# Fail2Ban configuration file
#
# Author: Lordpedal
#

[Definition]

# Option:  actionstart
# Notes.:  command executed once at the start of Fail2Ban.
# Values:  CMD
#
actionstart = /etc/fail2ban/scripts/fail2ban-telegram.sh start 

# Option:  actionstop
# Notes.:  command executed once at the end of Fail2Ban
# Values:  CMD
#
actionstop = /etc/fail2ban/scripts/fail2ban-telegram.sh stop

# Option:  actioncheck
# Notes.:  command executed once before each actionban command
# Values:  CMD
#
actioncheck = 

# Option:  actionban
# Notes.:  command executed when banning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:    See jail.conf(5) man page
# Values:  CMD
#
actionban = /etc/fail2ban/scripts/fail2ban-telegram.sh ban <ip>

# Option:  actionunban
# Notes.:  command executed when unbanning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:    See jail.conf(5) man page
# Values:  CMD
#
actionunban = /etc/fail2ban/scripts/fail2ban-telegram.sh unban <ip>

[Init]

init = 21121981
```

Guardamos los cambios, salimos del editor de texto y crearemos el script de notificación:

```bash
cd /etc/fail2ban && \
sudo mkdir scripts && \
cd scripts && \
sudo nano fail2ban-telegram.sh && \
sudo chmod +x fail2ban-telegram.sh
```

Agregamos el siguiente bash script:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
while true
do
    if ping -c 1 -W 3 google.com 1>/dev/null 2>&1
    then
        echo ""
        break
    else
        echo ""
    fi
    sleep 1
done
# Opciones ejecucion
info=`hostname -f`
function show_uso {
  echo "Fail2ban Telegram by Lordpedal"
  echo ""
  echo "Usar: $0 opcion <ip>"
  echo ""
  echo "Opcion: start      (Inicia notificaciones)"
  echo "        stop       (Detiene notificaciones)"
  echo "        ban <ip>   (Banea IP especificada) Ej: ban 192.168.1.2"
  echo "        unban <ip> (Desbanea IP especificada) Ej: unban 192.168.1.2"
  echo ""
  exit
}

# Notificacion
function send_msg {
  # ID Telegram
  telegram=79593223
  # Enlace BOT
  url="https://api.telegram.org/bot289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA/sendMessage"
  # Envia mensaje
  curl -s -X POST $url -d chat_id=$telegram -d text="$1"
  exit
}

# Chequea argumentos de script
if [ $# -lt 1 ]
then
  show_uso
fi

# Ejecuta una accion depende del argumento
if [ $# -lt 1 ]
then
  show_uso
fi

# Ejecuta una accion depende del argumento
if [ "$1" = 'start' ]
then
  msg="Seguridad+Fail2ban+ha+sido+iniciada+en+el+host+$info"
  send_msg $msg
elif [ "$1" = 'stop' ]
then
  msg="Seguridad+Fail2ban+ha+sido+detenida+en+el+host+$info"
  send_msg $msg
elif [ "$1" = 'ban' ]
then
  msg=$([ "$2" != '' ] && echo "Seguridad+Fail2ban+ha+baneado+a+$2+en+el+host+$info" || echo "Seguridad+Fail2ban+ha+baneado+una+ip+en+el+host+$info" )
  send_msg $msg
elif [ "$1" = 'unban' ]
then
  msg=$([ "$2" != '' ] && echo "Seguridad+Fail2ban+ha+desbaneado+a+$2+en+el+host+$info" || echo "Seguridad+Fail2ban+ha+desbaneado+una+ip+en+el+host+$info" )
  send_msg $msg
else
  show_uso
fi
```

**NOTA:** Recuerda que el valor del `ID de Telegram` debes de sustituirlo por el tuyo propio.
{: .notice--warning}

Ahora vamos a finalizar la activación de `ssh`:

```bash
cd /etc/fail2ban/jail.d && \
sudo nano jail-debian.local
```

Y le agregamos el siguiente contenido, recordemos que el puerto SSH que definimos anteriormente fue `69`:

```bash
[sshd]
port     = 69
filter   = sshd
action = iptables[name=SSH, port=69, protocol=tcp]
         telegram
```

Guardamos los cambios, salimos del editor de texto  y reiniciamos Fail2ban para activar los cambios realizados:

```bash
sudo systemctl restart fail2ban
```

## Multimedia

Continuamos añadiendole extras a nuestro Servidor esta vez desde el punto `multimedia`.

### Transmission

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-transmission){: .btn .btn--success .btn--small}{:target="_blank"}

### Samba

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/samba-docker/){: .btn .btn--success .btn--small}{:target="_blank"}

### VNC

Como tenemos instalado un **entorno gráfico** en el Servidor puede ser interesante controlarlo de forma remota mediante `VNC`. 

**VNC** (inglés: Virtual Network Computing), es también llamado software de escritorio remoto, no impone restricciones en el sistema operativo del ordenador servidor con respecto al del cliente: es posible compartir la pantalla de una máquina con cualquier sistema operativo que soporte VNC conectándose desde otro ordenador o dispositivo que disponga de un cliente VNC portado.

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

Y nos informara que ha creado la configuración necesaria en nuestra carpeta de usuario:

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

Guardamos los cambios, salimos del editor de texto y ahora vamos a crear un servicio de autoarranque en [Systemd](https://es.wikipedia.org/wiki/Systemd){: .btn .btn--inverse .btn--small}{:target="_blank"} con nuestro editor nano:

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
ExecStart=/usr/bin/vncserver -depth 24 -geometry 1920x1080 :%i
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
{: .notice--info}

### MiniDLNA

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-minidlna){: .btn .btn--success .btn--small}{:target="_blank"}

### UDPXY

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-udpxy){: .btn .btn--success .btn--small}{:target="_blank"}

### Xupnpd

[Xupnpd](http://xupnpd.org/){: .btn .btn--inverse}{:target="_blank"} es un **software permite anunciar canales y contenido multimedia** a través de **DLNA** en cooperación con `MiniDLNA`.

#### Xupnpd V1

Vía DLNA (UPnP) se entregará una lista personalizada con los canales por ejemplo de **Movistar+, Youtube,...** a los dispositivos de la LAN. 

Existen múltiples cliente que pueden consumir este servicio, por ejemplo VLC y así no tener que crear un fichero .m3u en cada ordenador.

Vamos nuevamente a preparar el entorno de trabajo para compilar el software:

```bash
sudo apt-get -y install minissdpd && \
mkdir -p $HOME/source && \
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
{: .notice--info}

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
sleep 30 && /etc/xupnpd/xupnpd & >/dev/null 2>&1
# SALIR
exit 0
```

Guardamos los cambios, salimos del editor de texto y cada vez que arranque tendremos operativo el servicio.

#### Xupnpd V2

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-xupnpd-v2){: .btn .btn--success .btn--small}{:target="_blank"}

### Kodi

[Ampliar información en esta entrada](https://lordpedal.github.io/gnu/linux/docker/kodi-docker/){: .btn .btn--success .btn--small}{:target="_blank"}

### Youtube-dl

**Youtube-dl** es un programa escrito en python que nos facilita cierta gestión de contenido en las redes de streaming.

Para poder usarlo en nuestro sistema, primeramente debemos de actualizar los repositorios e instalar el paquete:

```bash
sudo apt-get update && sudo apt-get -y install youtube-dl
```

La versión incluida en la emisión de este tutorial es:

```bash
pi@overclock:/usr/local/bin$ sudo youtube-dl --version
2021.06.06
```

> Y listo!
