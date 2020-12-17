---
title:  "DIY Live: Debian GNU/LINUX"
date:   2020-08-27 05:00:00 -0300
last_modified_at: 2020-12-16T10:10:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

La intención de esta entrada es la de crear un sistema **Minimal Debian 10 Live 64bits** que puede arrancarse desde CD/USB y ademas con soporte de Legacy BIOS o el hardware actual EFI.

La información ha sido recopilada en su mayor parte de esta gran [guía](https://wiki.debian.org/DebianCustomCD){:target="_blank"}.

Esta entrada esta escrita más con fines educativos personales que cualquier otra cosa.

No tiene porque ser necesariamente la guía más completa o la mejor detallada para todo el amplio espectro de necesidades a cubrir.

Espero que esta guía sea de todos modos útil.

## Prerrequisitos

Instalaremos las aplicaciones para la creación del entorno;

```bash
sudo apt-get -y install \
debootstrap dosfstools squashfs-tools \
xorriso isolinux syslinux-efi \
grub-pc-bin grub-efi-amd64-bin mtools
```

Crearemos un directorio de trabajo donde alojar todo el proyecto:

```bash
mkdir -p $HOME/LIVE_BOOT
```

## Configurando Debian

Vamos a usar la rama buster para hacer la distribución minimal y amd64 para la arquitectura:

```bash
sudo debootstrap \
--arch=amd64 --variant=minbase buster \
$HOME/LIVE_BOOT/chroot \
http://ftp.es.debian.org/debian/
```

Vamos a iniciar el entorno [chroot](https://es.wikipedia.org/wiki/Chroot){:target="_blank"} sobre Debian que acabamos de arrancar:

```bash
sudo chroot $HOME/LIVE_BOOT/chroot
```

A continuación debemos de seguir trabajando sobre la misma terminal ya que la configuración y los cambios que vamos a realizar tienen que ser dentro del entorno **chroot** y no sobre nuestro sistema base.

Configuramos hostname de la distro:

```bash
echo "lordpedal-live" > /etc/hostname
```

Ahora vamos a instalar el Kernel, administración de servicios y utilidades mínimas para tener un entorno de tamaño reducido operacional:

```bash
apt update && \
apt install --no-install-recommends \
linux-image-amd64 live-boot \
systemd-sysv network-manager net-tools \
wireless-tools wpagui curl \
openssh-client blackbox xserver-xorg-core \
xserver-xorg xinit xterm \
nano && apt clean
```

Tras la instalación, configuramos el password del usuario root:

```bash
passwd root
```

Salimos del entorno **chroot** para volver a nuestra distro:

```bash
exit
```

Vamos a crear las carpetas que contendran los ficheros para nuestro entorno Live:

```bash
mkdir -p $HOME/LIVE_BOOT/{staging/{EFI/boot,boot/grub/x86_64-efi,isolinux,live},tmp}
```

Comprimimos el entorno **chroot** en un sistema ficheros [Squash](https://es.wikipedia.org/wiki/SquashFS){:target="_blank"}:

```bash
sudo mksquashfs \
$HOME/LIVE_BOOT/chroot \
$HOME/LIVE_BOOT/staging/live/filesystem.squashfs \
-e boot
```

Copiamos el kernel y initramfs desde el entorno **chroot** al directorio **live**:

```bash
cp $HOME/LIVE_BOOT/chroot/boot/vmlinuz-* \
$HOME/LIVE_BOOT/staging/live/vmlinuz && \
cp $HOME/LIVE_BOOT/chroot/boot/initrd.img-* \
$HOME/LIVE_BOOT/staging/live/initrd
```

## Preparando los menús del Boot Loader

Creamos un menú de inicio de **ISOLINUX (Syslinux)**. Este menú de inicio se utiliza cuando se inicia en modo **BIOS / Legacy**:

```bash
cat <<'EOF' >$HOME/LIVE_BOOT/staging/isolinux/isolinux.cfg
UI vesamenu.c32

MENU TITLE Boot Menu
DEFAULT linux
TIMEOUT 600
MENU RESOLUTION 640 480
MENU COLOR border       30;44   #40ffffff #a0000000 std
MENU COLOR title        1;36;44 #9033ccff #a0000000 std
MENU COLOR sel          7;37;40 #e0ffffff #20ffffff all
MENU COLOR unsel        37;44   #50ffffff #a0000000 std
MENU COLOR help         37;40   #c0ffffff #a0000000 std
MENU COLOR timeout_msg  37;40   #80ffffff #00000000 std
MENU COLOR timeout      1;37;40 #c0ffffff #00000000 std
MENU COLOR msg07        37;40   #90ffffff #a0000000 std
MENU COLOR tabmsg       31;40   #30ffffff #00000000 std

LABEL linux
  MENU LABEL Debian Live [BIOS/ISOLINUX]
  MENU DEFAULT
  KERNEL /live/vmlinuz
  APPEND initrd=/live/initrd boot=live

LABEL linux
  MENU LABEL Debian Live [BIOS/ISOLINUX] (nomodeset)
  MENU DEFAULT
  KERNEL /live/vmlinuz
  APPEND initrd=/live/initrd boot=live nomodeset
EOF
```

Creamos un segundo, y similar **menú de arranque para GRUB**. Este arranque es usado cuando arrancamos en `EFI/UEFI mode`:

```bash
cat <<'EOF' >$HOME/LIVE_BOOT/staging/boot/grub/grub.cfg
search --set=root --file /DEBIAN_CUSTOM

set default="0"
set timeout=30

# If X has issues finding screens, experiment with/without nomodeset.

menuentry "Debian Live [EFI/GRUB]" {
    linux ($root)/live/vmlinuz boot=live
    initrd ($root)/live/initrd
}

menuentry "Debian Live [EFI/GRUB] (nomodeset)" {
    linux ($root)/live/vmlinuz boot=live nomodeset
    initrd ($root)/live/initrd
}
EOF
```

Creamos una tercera configuración de arranque. Esta configuración será un archivo de configuración inicial que está integrado dentro de GRUB en la partición EFI. Esto encuentra la raíz y carga la configuración de GRUB desde allí:

```bash
cat <<'EOF' >$HOME/LIVE_BOOT/tmp/grub-standalone.cfg
search --set=root --file /DEBIAN_CUSTOM
set prefix=($root)/boot/grub/
configfile /boot/grub/grub.cfg
EOF
```

Y creamos un archivo para el arranque llamado **DEBIAN_CUSTOM**. Este archivo se utilizará para ayudar a **GRUB** a identificar nuestro sistema de archivos. Este nombre de archivo debe ser único y debe coincidir con el nombre de archivo en nuestra configuración previa que dimos en `grub.cfg`:

```bash
touch $HOME/LIVE_BOOT/staging/DEBIAN_CUSTOM
```

## Preparando los ficheros del Boot Loader

**Copiamos los ficheros de arranque necesarios de BIOS/Legacy** a nuestro espacio de trabajo:

```bash
cp /usr/lib/ISOLINUX/isolinux.bin "${HOME}/LIVE_BOOT/staging/isolinux/" && \
cp /usr/lib/syslinux/modules/bios/* "${HOME}/LIVE_BOOT/staging/isolinux/"
```

**Copiamos los ficheros de arranque necesarios de EFI** a nuestro espacio de trabajo:

```bash
cp -r /usr/lib/grub/x86_64-efi/* "${HOME}/LIVE_BOOT/staging/boot/grub/x86_64-efi/"
```

**Generamos una imagen de arranque de EFI** en GRUB:

```bash
grub-mkstandalone \
--format=x86_64-efi \
--output=$HOME/LIVE_BOOT/tmp/bootx64.efi \
--locales="" \
--fonts="" \
"boot/grub/grub.cfg=$HOME/LIVE_BOOT/tmp/grub-standalone.cfg"
```

Creamos una imagen de disco de arranque **UEFI FAT16** que contenga el cargador de arranque EFI. Tenga en cuenta el uso de los comandos mmd y mcopy para copiar nuestro cargador de arranque UEFI llamado `bootx64.efi`:

```bash
(cd $HOME/LIVE_BOOT/staging/EFI/boot && \
    dd if=/dev/zero of=efiboot.img bs=1M count=20 && \
    sudo mkfs.vfat efiboot.img && \
    mmd -i efiboot.img efi efi/boot && \
    mcopy -vi efiboot.img $HOME/LIVE_BOOT/tmp/bootx64.efi ::efi/boot/
)
```

## Crear ISO arrancable

Para finalizar todo el trabajo solo nos queda convertir el trabajo en un fichero **.ISO** para poder redistribuirlo o usarlo en **CD/USB**:

```bash
xorriso \
    -as mkisofs \
    -iso-level 3 \
    -o "${HOME}/LIVE_BOOT/debian-custom.iso" \
    -full-iso9660-filenames \
    -volid "DEBIAN_CUSTOM" \
    -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
    -eltorito-boot \
        isolinux/isolinux.bin \
        -no-emul-boot \
        -boot-load-size 4 \
        -boot-info-table \
        --eltorito-catalog isolinux/isolinux.cat \
    -eltorito-alt-boot \
        -e /EFI/boot/efiboot.img \
        -no-emul-boot \
        -isohybrid-gpt-basdat \
    -append_partition 2 0xef ${HOME}/LIVE_BOOT/staging/EFI/boot/efiboot.img \
    "${HOME}/LIVE_BOOT/staging"
```

> Y listo!
