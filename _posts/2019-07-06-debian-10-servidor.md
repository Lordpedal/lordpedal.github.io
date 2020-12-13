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
Adicionalmente en la propia web podemos encontrar unas excelentes [guías de instalación](https://www.debian.org/releases/stable/installmanual){:target="_blank"} donde el proceso de instalación es guiado con todo tipo de detalles.<!--break-->

Resumiendo el procedimiento a grandes rasgos:

1.  Grabamos la ISO descargada en un CD/DVD o USB según capacidad y necesidad.
2.  Seleccionamos la opción de arranque desde el nuevo dispositivo en la configuración de nuestra UEFI/BIOS. Obligatorio deseleccionar opción de arranque rápido en Windows en caso de tenerlo activo y/o instalado.
3.  Ejecutamos el asistente de instalación.
4.  **Importante** tildar para instalar en sistema durante asistente instalación: `Entorno de escritorio Debian + MATE + SSH server + Utilidades estándar del sistema Debian`, el resto de opciones recomiendo descartarlas.
5.  Disfrutar de las bondades de un gran sistema operativo y una gran comunidad asociada al mismo.

El usuario de sistema sobre el que realizare la guía es `pi` para seguir en la linea del blog, recordad sustituir dicho usuario por el que habéis creado durante la instalación.

Planteado el guión inicial vamos a personalizar nuestra instalación, pero antes recordando que los ajustes en su mayor parte los ejecutaremos desde una *terminal de sistema*.

### AJUSTANDO PERFIL [SUDO](https://es.wikipedia.org/wiki/Sudo){:target="_blank"} 

Lo primero con lo que comenzamos es añadiendo nuestro usuario al grupo `sudo` del sistema, para ello ejecutamos en la terminal:

<pre>su</pre>

Se nos solicitara la *contraseña* de **root** que previamente le dimos en la instalación. Procedemos a instalar la aplicación *(necesaria conexión internet)*:

<pre>apt-get update && apt-get -y install sudo nano</pre>

A continuacion debemos de añadir nuestro usuario a los principales grupos del sistema, entre ellos **sudo**:

<pre>usermod -aG audio pi && usermod -aG video pi && usermod -aG dialout pi && usermod -aG plugdev pi && usermod -aG tty pi && usermod -aG sudo pi</pre>

**NOTA ADICIONAL:** Recientemente revisando las últimas releases de Debian 10 me he dado cuenta que el paso anterior os puede arrojar un error del tipo **comando no reconocido**, si es tu caso el **FIX** es el siguiente:

<pre>cd /sbin && ./usermod -aG audio pi && ./usermod -aG video pi && ./usermod -aG dialout pi && ./usermod -aG plugdev pi && ./usermod -aG tty pi && ./usermod -aG sudo pi</pre>

Si no es así haz caso omiso, el fallo reside en el **PATH del Sistema** que durante el resto de configuraciones del server se corrige.

Vamos a repasar los principales atajos de teclado que encontramos en el editor [nano](https://es.wikipedia.org/wiki/GNU_Nano){:target="_blank"}:

> | Acción | Resultado |
> | ------ | ------ |
> | Control + O | Guardar fichero |
> | Control + X | Salir del editor |
> | Control + X | Salir del editor | 
> | Control + C | Muestra número linea donde se encuentra cursor | 
> | Control + K | Cortar linea | 
> | Control + U | Pegar linea | 
> | Control + W | Buscar en el fichero |
> | Control + W + R | Buscar y reemplazar en el fichero |

Añadimos privilegios sudo editando la configuración con nuestro editor *nano*:

<pre>nano /etc/sudoers</pre>

Y agregamos la siguiente sentencia al final del archivo:

<pre>pi ALL=(ALL) NOPASSWD: ALL</pre>

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y salimos de la sesión root.

<pre>exit</pre>

Y ya tendremos configurado debidamente el perfil sudo en nuestro usuario de sistema.

###  AJUSTANDO REPOSITORIOS SISTEMA

El [gestor de paquetes](https://es.wikipedia.org/wiki/Sistema_de_gesti%C3%B3n_de_paquetes){:target="_blank"} `Apt`/`Aptitude`/`Synaptic` de nuestra distribución se basa en un listado de fuentes de instalación. 
Primero haremos un backup de las actuales y crearemos una personalizada:

<pre>cd /etc/apt && sudo mv sources.list sources.pi && sudo nano sources.list</pre>

En el documento en blanco que se nos abre, añadimos las nuevas personalizadas:

<pre># Oficiales
deb http://ftp.es.debian.org/debian/ buster main contrib non-free
deb-src http://ftp.es.debian.org/debian/ buster main contrib non-free

# Seguridad
deb http://security.debian.org/debian-security buster/updates main contrib non-free
deb-src http://security.debian.org/debian-security buster/updates main contrib non-free

# Actualizaciones Sistema
deb http://ftp.es.debian.org/debian/ buster-updates main contrib non-free
deb-src http://ftp.es.debian.org/debian/ buster-updates main contrib non-free</pre>

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)** y actualizamos el listado de paquetes de software y posibles actualizaciones del mismo:

<pre>sudo apt-get clean && sudo apt-get autoclean && sudo apt-get -y autoremove && sudo apt-get update && sudo apt-get -y upgrade && sudo apt-get -y dist-upgrade</pre>

Tras finalizar la actualización tendremos el sistema actualizado y con las últimas novedades/parches instalados.

###  UTILIDADES SISTEMA

Posiblemente tendrás algún `controlador` pendiente de actualizar y/o instalar el `driver necesario` para poder interactuar con el y no esta compilado en el kernel. Una solución sencilla es instalar un paquete con algunos de los principales drivers (3Com, Atheros, Radeon, …):

<pre>sudo apt-get update && sudo apt-get -y install firmware-linux-nonfree</pre>

Y si además queremos maximizar la eficiencia de nuestro procesador instalaremos este parche según dispongamos de un procesador `Intel` **o** `AMD`:

>  INTEL
<pre>sudo apt-get -y install intel-microcode</pre>

> AMD  
<pre>sudo apt-get -y install amd64-microcode</pre>

Si necesitamos `des/comprimir` algún fichero de nuestro sistema y no se encuentra dentro de los formatos más habituales de GNU/Linux, deberemos de darle soporte para poder interactuar:

<pre>sudo apt-get update && sudo apt-get -y install rar unrar zip unzip unace bzip2 lzop p7zip p7zip-full p7zip-rar sharutils lzip xz-utils mpack arj cabextract</pre>

Otro conjunto de `utilidades adicionales` a instalar que necesitaremos para futuros usos son:

<pre>sudo apt-get update && sudo apt-get -y install mc htop curl bc git wget curl dnsutils ntfs-3g hfsprogs hfsplus build-essential automake libtool uuid-dev psmisc linux-source linux-headers-`uname -r` yasm</pre>

###  CONFIGURANDO IDIOMA SISTEMA

Ejecutaremos un pequeño asistente con la orden de terminal:

<pre>sudo dpkg-reconfigure locales</pre>

Para poner nuestro sistema en español, tenemos que marcar las siguientes opciones en el asistente configuración de locales y deseleccionar cualquier otra que pudiese estar activa:

<pre>es_ES ISO-8859-1 
es_ES.UTF-8 UTF-8 
es_ES@euro ISO-8859-15</pre>

Para la configuración regional predeterminada seleccionamos:

<pre>es-ES.UTF-8</pre>

###  HABILITANDO INICIO EN [TTY](https://es.wikipedia.org/wiki/Emulador_de_terminal){:target="_blank"}

Este paso aunque no es obligatorio en un entorno de Servidor, si lo considero que es altamente recomendado para optimizar recursos de sistema. Lo que vamos a hacer es deshabilitar el autoinicio del entorno gráfico instalado (recordemos [MATE](https://es.wikipedia.org/wiki/MATE){:target="_blank"}).
Lo que debemos de hacer a continuacón es adaptar el sistema a un arranque sin gestor de inicio sesiones ([LightDM](https://es.wikipedia.org/wiki/LightDM){:target="_blank"}), para ello instalamos y configuramos la siguiente dependencia:

<pre>sudo apt-get -y install xserver-xorg-legacy</pre>

Vamos a reconfigurarla debidamente, previo backup de su configuración:

<pre>sudo mv /etc/X11/Xwrapper.config /etc/X11/Xwrapper.bak && sudo nano /etc/X11/Xwrapper.config</pre>

Agregamos el siguiente contenido al fichero que estamos editando:

<pre># Xwrapper.config (Debian X Window System server wrapper configuration file)
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
allowed_users=anybody</pre>

Guardamos los cambios **(Ctrl+O)** y salimos del editor de texto **(Ctrl+X)**. Ahora vamos a reconfigurar SystemD para el arranque en terminal:

<pre>sudo systemctl set-default multi-user.target</pre>

Llegado a este punto el sistema tras un reinicio o encendido del PC nos solicitaria el usuario: **pi** y su contraseña: ************** para hacer login en terminal.
Podemos configurar un **autologin** que **no lo recomiendo** pero lo dejo a modo informativo.

<pre>sudo mkdir -p /etc/systemd/system/getty@tty1.service.d && sudo nano /etc/systemd/system/getty@tty1.service.d/override.conf</pre>

Agregamos el siguiente contenido al fichero que estamos editando:

<pre>[Service]
Type=simple
ExecStart=
ExecStart=-/sbin/agetty --autologin pi --noclear %I 38400 linux</pre>

Guardamos los cambios **(Ctrl+O)** y salimos del editor de texto **(Ctrl+X)**.

###  HABILITANDO RC.LOCAL

Si no queremos crear un script único para la ejecución de un comando o un script cada vez que iniciamos un sistema tipo Unix (BSD, Gnu/Linux, etc) tenemos la posibilidad de llamarlo desde el fichero **/etc/rc.local**.
Cualquier comando que coloquemos o script al que llamemos en dicho fichero será ejecutado al final del arranque, es decir, cuando todos los scripts que tenemos en el runlevel correspondiente hayan sido ejecutados. 
Esta opción no viene habilitada por defecto en Debian 10 y para ello tendremos que habilitarla, creamos el servicio para [SystemD](https://es.wikipedia.org/wiki/Systemd){:target="_blank"}:

<pre>sudo nano /etc/systemd/system/rc-local.service</pre>

Agregamos el siguiente contenido al fichero que estamos editando:

<pre>[Unit]
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
WantedBy=multi-user.target</pre>

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, ahora pasamos a crear el fichero **rc.local**

<pre>sudo nano /etc/rc.local</pre>

Agregamos el siguiente contenido al fichero que estamos editando:

<pre>#!/bin/sh -e
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
exit 0</pre>

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, debemos de darle permisos de ejecución al ficher creado:

<pre>sudo chmod +x /etc/rc.local</pre>

Habilitamos el servicio para que se ejecute al inicio del sistema y lo lanzamos para comprobar el correcto funcionamiento:

<pre>sudo systemctl enable rc-local && sudo systemctl start rc-local.service && sudo systemctl status rc-local.service</pre>

Llegado a este punto de configuración del servidor recomiendo un reset al sistema:

<pre>sudo reboot</pre>

Tras el reinicio el sistema arrancara en `TTY`. Adjunto cuadro resumen con los principales comandos terminal:

> | Comando terminal | Resultado |
> | ------ | ------ |
> | startx | Arrancar entorno gráfico (MATE) |
> | exit | Salir/Cerrar sesión TTY |
> | sudo su | Iniciar sesion como ROOT |
> | sudo reboot | Reiniciar sistema |
> | sudo poweroff | Apagar sistema |

Y con este apartado terminamos la parte de instalación y ajustes básicos del sistema.
