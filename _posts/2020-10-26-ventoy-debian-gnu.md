---
title:  "Ventoy USB Multiboot: Debian GNU/Linux"
date:   2020-10-26 14:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux

tags:
  - GNU/Linux
  - Debian
---

[Ventoy](https://github.com/ventoy/Ventoy){:target="_blank"} es una novedosa herramienta de **código abierto**, especializada en crear unidades USB de arranque de forma simple.

Su funcionamiento es muy básico, tan solo debes instalar la herramienta en una **memoria de almacenamiento USB** y luego copiar las imágenes ISO en el pendrive, así de fácil.

Ventoy nos ofrece un menú de inicio, desde el cual podemos elegir la ISO que queremos iniciar, pudiendo incluso crear un **USB MultiBoot**.

Características más destacadas de la aplicación:

- 100% de código abierto
- Fácil de usar
- Rápido
- [Personalizable](https://www.ventoy.net/en/plugin.html){:target="_blank"}
- Arrancar directamente desde los archivos ISO/WIM/IMG/VHD(x)/EFI
- Legado + UEFI soportado de la misma manera
- UEFI Secure Boot soportado (**1.0.07+**)
- Persistencia soportada (**1.0.11+**)
- Soporta el estilo de partición MBR y GPT (**1.0.15+**)
- Ficheros WIM de arranque soportados (Legacy + UEFI) (**1.0.12+**)
- Soporta la auto instalación (**1.0.09+**)
- Se admiten archivos ISO de más de 4 GB
- Instalación Multisistema
- Estilo de menú de arranque nativo para Legacy & UEFI
- La mayoría de los tipos de sistemas operativos soportados (+550 archivos ISO probados)
- Soporte de protección contra escritura de la unidad USB
- El uso normal del USB no se ve afectado
- Datos no destructivos durante la actualización de la versión
- No hay necesidad de actualizar Ventoy cuando se lanza una nueva distribución

La versión que he utilizado para la realización de esta entrada es la [1.0.26](https://github.com/ventoy/Ventoy/releases){:target="_blank"}

Comenzamos creando la carpeta de trabajo donde alojaremos el software, entramos en ella y satisfacemos dependencias que necesitaremos:

```bash
mkdir -p $HOME/source && cd $HOME/source && \
sudo apt-get update && \
sudo apt-get -y install git wget tar
```

A continuación bajamos el software:

```bash
wget https://github.com/ventoy/Ventoy/releases/\
download/v1.0.26/ventoy-1.0.26-linux.tar.gz
```

Descomprimimos el fichero y lo borramos después:

```bash
tar xfvz ventoy-1.0.26-linux.tar.gz && \
rm ventoy-1.0.26-linux.tar.gz && \
cd ventoy-1.0.26
```

Insertamos el USB sobre el que vamos a instalar Ventoy y listamos los dispositivos de almacenamiento:

```bash
lsblk -f
```

Adjunto ejemplo de la ejecución del comando y la detección del USB conectado:

```bash
pi@overclock:~/source/ventoy$ lsblk -f
NAME    FSTYPE LABEL     UUID         MOUNTPOINT
sda
├─sda1
├─sda2  ext4   Overclock 85355f0f14f7 /
└─sda5  swap             e3db23b9df50 [SWAP]
sdb
└─sdb1  ext4   NAS       d259e76b4b1d /media/NAS
sdc
└─sdc1 vfat    UNICORN   2A8B-ED3A
sr0
zram0
zram1
```

Siguiendo con el USB de mi prueba la instalación sería de la siguiente forma (recuerda sustituir /dev/sdc por la variable que obtengas):

```bash
sudo ./Ventoy2Disk.sh -I /dev/sdc
```

Adjunto ejemplo de la instalación (*durante la instalación nos pedirá confirmación para poder continuar, advirtiendo que la información contenida en el USB será borrada*):

```bash
pi@overclock:~/$ sudo ./Ventoy2Disk.sh -I /dev/sdc

**********************************************
Ventoy: 1.0.26
longpanda admin@ventoy.net
https://www.ventoy.net
**********************************************

Disk : /dev/sdc
Model: Generic Flash Disk (scsi)
Size : 29 GB
Style: MBR


Attention:
You will install Ventoy to /dev/sdc.
All the data on the disk /dev/sdc will be lost!!!

Continue? (y/n) y

All the data on the disk /dev/sdc will be lost!!!
Double-check. Continue? (y/n) y

Create partition on /dev/sdc by parted in MBR style...
Done
mkfs on disk partitions ...
create efi fat fs /dev/sdc2 ...
mkfs.fat 4.1 (2017-01-24)
success
mkexfatfs 1.3.0
Creating... done.
Flushing... done.
File system created successfully.
writing data to disk ...
sync data ...
esp partition processing ...

Install Ventoy to /dev/sdc successfully finished.
```

Al finalizar veremos que la memoria USB se ha particionado en dos:

1. **FAT** (aprox. 32mb): Partición que contiene la información de arranque.
2. **exFAT** (resto de espacio libre): Partición donde guardaremos las ISOS, tal cual.
