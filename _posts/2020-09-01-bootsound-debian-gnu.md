---
title:  "Bootsound: Debian GNU/Linux"
date:   2020-09-01 17:00:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

Esta entrada es un tributo a la que mi entender, es la obra maestra de [Ridley Scott](https://es.wikipedia.org/wiki/Ridley_Scott){:target="_blank"}: [Alien (1979)](https://es.wikipedia.org/wiki/Alien:_el_octavo_pasajero){:target="_blank"}.

Al comienzo de la película, la computadora de la nave espacial [Nostromo](https://youtu.be/2ywWFvjE-yU){:target="_blank"} se inicia en una ráfaga de parpadeos y ruido.

Vamos a recrear ese ambiente en nuestro servidor, añadiendo el fragmento de audio a la secuencia de arranque de nuestro sistema.

Para configurarlo sobre nuestra base Debian seguimos este mini-tutorial.

Creamos la carpeta de trabajo y entramos en ella:

```bash
sudo mkdir -p /opt/bootsound && \
cd /opt && \
sudo chown $USER:$USER -R bootsound && \
cd /opt/bootsound
```

Actualizamos repositorios e instalamos las dependencias necesarias:

```bash
sudo apt-get update && \
sudo apt-get -y install ffmpeg \
youtube-dl
```bash

Forzamos la actualización de **Youtube-DL** para evitar conflictos:

```bash
sudo wget -O /usr/bin/youtube-dl \
http://yt-dl.org/downloads/latest/youtube-dl && \
sudo chmod a+rx /usr/bin/youtube-dl && \
sudo wget -O /usr/local/bin/youtube-dl \
http://yt-dl.org/downloads/latest/youtube-dl && \
sudo chmod a+rx /usr/local/bin/youtube-dl
```

A partir de este momento podremos actualizar **Youtube-DL** de esta forma:

```bash
sudo youtube-dl -U
```

Vamos a descargar el audio del video de la secuencia:

```bash
youtube-dl --extract-audio \
--audio-format wav \
--audio-quality 0 \
--restrict-filenames \
https://youtu.be/2ywWFvjE-yU
```

Renombramos el fichero:

```bash
mv \
'Nostromo_boot_sequence_+_Interface_2037_mother_-_Alien_computer_sounds_glitches-2ywWFvjE-yU.wav' \
audio.wav
```

Copiamos los primeros **25s** del audio para adaptar el clip:

```bash
ffmpeg -i audio.wav \
-ss 00:00:01 -to 00:00:25 \
-c copy \
nostromo.wav && \
rm audio.wav
```

Identificamos la tarjeta de sonido:

```bash
cat /proc/asound/cards
```

Adjunto ejemplo de mi tarjeta:

```bash
pi@overclock:/opt/bootsound$ cat /proc/asound/cards
0 [PCH ]: HDA-Intel - HDA Intel PCH
HDA Intel PCH at 0xdf240000 irq 138
```

Descubrimos el identificador de la tarjeta de sonido para el sistema y lo apuntamos:

```bash
systemctl list-units | \
awk '/sound-card0/{print $1}'
```

Adjunto ejemplo de mi identificador:

```bash
pi@overclock:/opt/bootsound$ systemctl list-units | \
> awk '/sound-card0/{print $1}'
sys-devices-pci0000:00-0000:00:1f.3-sound-card0.device
```

Creamos script de ejecución:

```bash
nano bootsound.sh
```

Añadimos el siguiente contenido:

```bash
#!/bin/bash
amixer -c 0 sset Master unmute
amixer -c 0 sset Master playback 100%
/usr/bin/aplay -D plughw:0,0 /opt/bootsound/nostromo.wav
```

Guardamos el contenido *Ctrl+O* , salimos del editor *Ctrl+X*, le damos permisos de ejecución y creamos un [enlace simbolico](https://es.wikipedia.org/wiki/Enlace_simb%C3%B3lico){:target="_blank"}:

```bash
chmod +x bootsound.sh && \
sudo ln -s \
/opt/bootsound/bootsound.sh \
/usr/local/bin/bootsound
```

Creamos el servicio de arranque que ejecutara el script que hemos creado:

```bash
sudo nano /etc/systemd/system/bootsound.service
```

Añadimos el siguiente contenido, cambiando en caso de ser necesario el identificador de la tarjeta de sonido:

```bash
[Unit]
Description=Boot Sound
Requires=sys-devices-pci0000:00-0000:00:1f.3-sound-card0.device
After=sys-devices-pci0000:00-0000:00:1f.3-sound-card0.device

[Service]
Type=oneshot
RemainAfterExit=no
ExecStart=/usr/local/bin/bootsound

[Install]
WantedBy=default.target
```

Guardamos el contenido Ctrl+O , salimos del editor Ctrl+X, y activamos el servicio al inicio del sistema:

```bash
sudo systemctl enable bootsound.service
```

> Y listo!