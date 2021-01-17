---
title:  "Raspberry Pi 4B+: Servidor ARM"
date:   2021-12-31 10:00:00 -0300
last_modified_at: 2021-12-31T11:00:00-05:00
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

![RPi]({{ site.url }}{{ site.baseurl }}/assets/images/Raspbian.png)
{: .full}
Anteriormente vimos como crear un [**Servidor doméstico con base de procesador PC 64bits**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/){:target="_blank"} en esta ocasión vamos a realizar la misma operación pero tomando como base una **placa SBC con procesador ARM**.

La placa elegida para el **mini-Servidor** es una `Raspberry Pi 4B+ 4Gb`, aunque el procedimiento también es compatible con modelos anteriores y otros modelos de placas SBC.

Vamos a realizar un pequeño repaso de las especificaciones técnicas del dispositivo en cuestión:

 | Característica | Raspberry Pi 4 |
 | ------ | ------ |
 | **Procesador** | ARM Cortex-A72 `(ARMv8-A64 64 bit)` |
 | **Frecuencia de reloj** | 1.5 GHz |
 | **TDP** | 7.5 W |
 | **GPU** | VideoCore VI `(Soporte para OpenGL ES 3.x)` |
 | **Memoria** | 1 GB / 2 GB / **4 GB** / 8GB LPDDR4 SDRAM |
 | **Conectividad** | Bluetooth 5.0, Wi-Fi 802.11ac, Gigabit Ethernet |
 | **Almacenamiento** | microSD |
 | **Puertos** | 2x microHDMI, 2xUSB2.0, 2xUSB3.0, 1xRJ45, GPIO 40 pines, 1xCSI (Cámara), 1xDSI (Pantalla Táctil), 1xJack, 1xUSB-C (Alimentación) |
 | **Dimensiones** | 88mm x 58mm x 19.5mm, 46g |
{: .notice--info}

Como vemos las posibilidades/capacidades son bastante interesantes para montar un **mini-servidor**.

## Instalación

Nos dirigimos a la [**web de descargas**](https://www.raspberrypi.org/software/operating-systems/){:target="_blank"} y podremos elegir la distribución que más se adapte a nuestras necesidades. 

En mi caso voy a recomendar la [**Raspberry Pi OS Lite**](https://downloads.raspberrypi.org/raspios_lite_armhf/images/){:target="_blank"}, que es la más recomendable para usarse a modo Servidor al optimizar recursos especialmente en el apartado gráfico. En el momento de escribir la entrada el Sistema Operativo esta basado en **Debian Buster aunque en arquitectura 32bits**.

Una vez bajada la imagen ISO comprimida ya solo nos queda grabarla en la tarjeta microSD por ejemplo con:

 * [Raspberry Pi Imager](https://www.raspberrypi.org/software/){:target="_blank"}
 * [Balena Etcher](https://www.balena.io/etcher/){:target="_blank"}
 * [Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/){:target="_blank"}
{: .notice--info}

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/rpios.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/rpios.webm"  type="video/webm"  />
   </video>
</div>

## Sistema Base

El usuario de sistema sobre el que realizare la guía es `pi` que por defecto es el de Raspberry Pi.

### Primer arranque RPi

Una vez finalizada la grabación de la tarjeta microSD esta la insertamos en la Raspberry Pi y conectamos un cable de red a la toma RJ45, un teclado USB, cable microHDMI a un Monitor/TV y alimentamos la placa por el conector USB-C.

Durante el proceso de arranque, la **partición root** de la tarjeta se expandira a la totalidad del espacio libre de la misma y veremos una pantalla de login donde se nos solicita un usuario y contraseña:

 | Usuario | Contraseña |
 | ------ | ------ |
 | `pi` | `raspberry` |

El primer paso a realizar es cambiar la contraseña del usuario por defecto:

```bash
passwd
```

Salida en terminal:

```bash
pi@raspberrypi:~ $ passwd
Changing password for pi.
Current password: raspberry
New password: ***
Retype new password: ***
passwd: password updated successfully
```

A continuación consulto IP del dispositivo en la red, para ello en la terminal envio el comando:

```bash
ip a
```

En mi caso la respuesta obtenida fue:

```bash
pi@raspberrypi:~ $ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether dc:a6:32:99:8e:0c brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.227/24 brd 192.168.1.255 scope global dynamic noprefixroute eth0
       valid_lft 3436sec preferred_lft 2986sec
    inet6 fe80::b443:1ced:c1c6:75e5/64 scope link
       valid_lft forever preferred_lft forever
3: wlan0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether dc:a6:32:99:8e:0d brd ff:ff:ff:ff:ff:ff
```

Anoto la IP: `192.168.1.227` y procedo a habilitar la conexión SSH para poder trabajar en remoto:

```bash
sudo raspi-config
```

Nos aparece en pantalla un menú de dialogo:

 * `3º Interface Options: Configure connections to peripherals` 
   * `P2 SSH: Enable/disable remote command line access using SSH`
     * `¿Quieres habilitar el servidor SSH?: YES`
 * `Finish`

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/sshrpi.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/sshrpi.webm"  type="video/webm"  />
   </video>
</div>

A continuación configuro franja horaria sistema con el asistente:

```bash
sudo dpkg-reconfigure tzdata
```

Ejemplo salida comando:

```bash
pi@raspberrypi:~ $ sudo dpkg-reconfigure tzdata

Current default time zone: 'Europe/Madrid'
Local time is now:      Sun Jan 17 08:19:36 CET 2021.
Universal Time is now:  Sun Jan 17 08:19:36 UTC 2021.
```

Configuro idioma sistema con el siguiente asistente:

```bash
sudo dpkg-reconfigure locales
```

Para poner nuestro sistema en Español, tenemos que marcar las siguientes opciones en el asistente configuración de locales y deseleccionar cualquier otra que pudiese estar activa:

- [ ] en_GB.UTF-8 UTF-8
- [x] es_ES.UTF-8 UTF-8

Para la configuración regional predeterminada seleccionamos:

- [x] es-ES.UTF-8

Ejemplo salida comando:

```bash
pi@raspberrypi:~ $ sudo dpkg-reconfigure locales
Generating locales (this might take a while)...
  es_ES.UTF-8... done
Generation complete.
```

Tras haber realizado estos pasos, apago la Raspberry Pi:

```bash
sudo poweroff
```

Desconecto teclado USB y salida Monitor/TV microHDMI, ya que **el resto de configuración voy a realizarla por SSH**, al ser un servidor headless.

Los parametros de la conexión SSH seran en mi caso:

 | IP RPi | Puerto SSH |
 | ------ | ------ |
 | `192.168.1.227` | `22` |

### [Alías](https://lordpedal.github.io/gnu/linux/debian-10-servidor/#al%C3%ADas){:target="_blank"}

Para simplificar la administración del sistema añado los siguientes alías al sistema:

```bash
cat << EOF | sudo tee -a /etc/bash.bashrc
#
# Alias
#
alias reiniciar="sudo reboot"
alias apagar="sudo poweroff"
alias instalar="sudo apt-get -y install"
alias desinstalar="sudo apt-get -y purge"
alias actualizar="sudo apt-get autoclean && sudo apt-get clean && sudo apt-get -y autoremove && sudo apt-get update && sudo apt-get -y upgrade && sudo apt-get -y dist-upgrade && sudo apt-get moo"
alias eepromfix="sudo rpi-eeprom-update -d -a"
alias enlaces="sudo nano /etc/bash.bashrc"
EOF
```

Vamos a repasar los alías creados:

 | Alías | Acción |
 | ------ | ------ |
 | `reiniciar` | Reiniciar la RPi |
 | `apagar` | Apagar la RPi |
 | `instalar` | Instala paquete/s de repositorios |
 | `desinstalar` | Desinstala paquete/s de repositorios |
 | `actualizar` | Actualiza Sistema Operativo |
 | `eepromfix` | Actualiza el firmware del bootloader RPi |
 | `enlaces` | Abre en el editor nano el fichero de configuración de alías |
{: .notice--info}


Para no tener que reiniciar/cerrar el sistema, recargo el fichero con las nuevas configuraciones:

```bash
source /etc/bash.bashrc
```

Vamos a actualizar el sistema y el firmware del bootlader de la Raspberry Pi con los alías:

```bash
actualizar && eepromfix
```

En mi caso la terminal devuelve el siguiente código:

```bash
pi@raspberrypi:~ $ actualizar && eepromfix
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
Leyendo la información de estado... Hecho
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
Leyendo la información de estado... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
Obj:1 http://archive.raspberrypi.org/debian buster InRelease
Obj:2 http://raspbian.raspberrypi.org/raspbian buster InRelease
Leyendo lista de paquetes... Hecho
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
Leyendo la información de estado... Hecho
Calculando la actualización... Hecho
0 actualizados, 0 nuevos se instalarán, 0 para eliminar y 0 no actualizados.
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
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
BCM2711 detected
Dedicated VL805 EEPROM detected
BOOTLOADER: up-to-date
CURRENT: jue sep  3 12:11:43 UTC 2020 (1599135103)
 LATEST: jue sep  3 12:11:43 UTC 2020 (1599135103)
 FW DIR: /lib/firmware/raspberrypi/bootloader/default
VL805: up-to-date
CURRENT: 000138a1
 LATEST: 000138a1
```

### Utilidades Sistema

Si necesitamos **des/comprimir** algún fichero de nuestro sistema y no se encuentra dentro de los formatos más habituales de GNU/Linux, deberemos de darle soporte para poder interactuar:

```bash
instalar zip unzip unace bzip2 lzop p7zip p7zip-full sharutils \
lzip xz-utils mpack arj cabextract
```

Otro conjunto de **utilidades adicionales** a instalar que necesitaremos para futuros usos son:

```bash
instalar mc htop curl git wget curl dnsutils ntfs-3g hfsprogs \
hfsplus build-essential automake libtool uuid-dev psmisc yasm \
subversion tofrodos git-core subversion dos2unix make mercurial \
gcc automake cmake dpkg-dev fakeroot pbuilder dh-make debhelper \
cvs devscripts bc
```

### [$USER/.BASHRC](https://lordpedal.github.io/gnu/linux/debian-10-servidor/#userbashrc){:target="_blank"}

Editamos el fichero .bashrc de nuestro usuario:

```bash
nano $HOME/.bashrc
```

Añadimos al final del fichero el siguiente contenido:

```bash
# MOTD
show_temp(){
    echo "`cat /sys/class/thermal/thermal_zone0/temp`/1000"|bc -q
}
#
let upSeconds="$(/usr/bin/cut -d. -f1 /proc/uptime)"
#let secs=$((${upSeconds}%60))
let mins=$((${upSeconds}/60%60))
let horas=$((${upSeconds}/3600%24))
let dias=$((${upSeconds}/86400))
UPTIME=`printf "%d dias, %02dh%02dm%02ds" "$dias" "$horas" "$mins" "$secs"`
read one five fifteen rest < /proc/loadavg
#
echo "$(tput setaf 2)
`date +"%A, %e %B %Y, %r"`
`uname -srmo`$(tput setaf 1)
Tiempo de actividad..: ${UPTIME}
Memoria RAM..........: `cat /proc/meminfo | grep MemFree | awk {'print $2'}`kB (Free) / `cat /proc/meminfo | grep MemTotal | awk {'print $2'}`kB (Total)
Promedios de carga...: ${one}, ${five}, ${fifteen} (1, 5, 15 min)
Procesos activos.....: `ps ax | wc -l | tr -d " "`
Temperatura Sistema..: $(show_temp)ºC
IP conexion por SSH..: $(echo $SSH_CLIENT | awk '{ print $1}')
$(tput sgr0)"
```

Guardamos el fichero (**Control + O**), salimos del editor (**Control + X**) y ejecutamos el siguiente comando:

```bash
cat << EOF > $HOME/.inputrc
# Flecha arriba
"\e[A":history-search-backward
# Flecha abajo
"\e[B":history-search-forward
EOF
```

Y recargamos el fichero `.bashrc` para visualizar los cambios:

```bash
source $HOME/.bashc
```

> Entrada en desarrollo
