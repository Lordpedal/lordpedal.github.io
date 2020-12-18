---
title:  "FSTAB: Debian GNU/Linux"
date:   2020-11-26 07:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
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

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
Esta entrada lo que pretendo es publicar a modo **TIP/Chuleta** como podríamos montar fácilmente unidades externas en nuestro sistema.

Para ello recurrimos al archivo **fstab**, donde normalmente se enumeran todos los discos y las particiones de disco disponibles, e indica la forma en que han de ser inicializados o integrados de otro modo en el sistema de archivos del sistema en general.

Los sistemas de archivos a definir en **/etc/fstab**, deben de guarda la siguiente estructura, separado el comando por un espacio o una tabulación:

```bash
<dispositivo> <punto_de_montaje> <sistema_de_archivos> <opciones> <dump> <pass>
```

- `<dispositivo>` Es el directorio lógico que hace referencia a una partición o recurso, por ejemplo **/dev/sdb1 o UUID=40e3c0eb-e460-4bc3-8e72-3a7ab90ae743**
- `<punto_de_montaje>` Es la carpeta en que se montaran los datos del sistema de archivos, por ejemplo **/media/rednas**
- `<sistema_de_archivos>` Es el algoritmo que se utilizará para interpretarlo, por ejemplo: **ext2, ext3, ext4, vfat, ntfs, swap, ...**
- `<opciones>` Es el lugar donde se especifican los parámetros que mount utilizará para montar el dispositivo, los más comunes son:
	- `auto / noauto`: Con la opción auto, el dispositivo será montado automáticamente durante el inicio o en caso de que el comando mount -a sea ejecutado. Auto es el valor por defecto. Si no se desea que el dispositivo se monte automáticamente, se deberá substituir por noauto.
	- `dev / nodev`: Interpretar / no interpretar dispositivos especiales de bloques en el sistema de archivos. Los dispositivos especiales de bloques son similares a discos (donde se puede acceder a los datos dado un número de bloque, y p.ej. tiene sentido tener un caché de bloques).
	- `exec / noexec`: exec permite ejecutar binarios que están en la partición, mientras que noexec lo impide. noexec puede resultar útil en una partición que contenga binarios que se deseen ejecutar en el sistema, o que no deban ser ejecutados.
	- `ro / rw`: Montar para sólo lectura o bien lectura/escritura.
	- `sync / async`: Esta opción indica la manera en que se debe realizar la entrada y salida del sistema de archivos. sync especifica que se realice de manera síncrona. En particular sirve, si se está escribiendo en una unidad con la opción activada, para que los cambios sean realizados físicamente en el dispositivo a la vez que se invoca el comando correspondiente.
	- `suid / nosuid`: Permite / bloquea la operación sobre los bits suid y sgid	
	- `uid=n ,gid=n`: Establece el identificador de usuario, uid, y el identificador de grupo, gid, para todos los archivos de la partición (n = valor id).
	- `user / nouser`: Permite a cualquier usuario montar el sistema de archivos. Implica directamente las opciones noexec, nosuid y nodev a menos que se especifiquen otras. Si se utiliza la opción nouser, solo el usuario root podrá montar el sistema de archivos.
	- `defaults`: Utiliza las opciones por defecto: **rw,suid,dev,exec,auto,nouser,async**.
        - `nofail`: No devuelve error si no se puede montar el dispositivo.
        - `noatime / nodiratime`: No actualiza los tiempos de acceso de inodo en el sistema de archivos o bien al directorio de sistema de archivos.
        - `relatime`: Actualizar los tiempos de acceso al inodo en relación con el tiempo de modificación o cambio. La hora de acceso solo se actualiza si la hora de acceso anterior fue anterior a la hora de modificación o cambio actual.
- `<dump>` Es el comando que utiliza dump para hacer respaldos del sistema de archivos, si es cero no se toma en cuenta ese dispositivo.
- `<pass>` Indica el orden en que la aplicación fsck revisará la partición en busca de errores durante el inicio, si es cero el dispositivo no se revisa.

Existe información mucho más detallada sobre este tema, adjunto PDF del [Blog Desde Linux](https://blog.desdelinux.net/){:target="_blank"} que guardo como guía para resolver dudas, 100% recomendado.

> [Lo esencial de fstab by Blog Desde Linux.pdf]({{ site.url }}{{ site.baseurl }}/assets/docs/fstab.pdf){:target="_blank"}

Llegado a este punto tras la teoría, lo primero que debemos es identificar los discos duros:

```bash
sudo blkid
```

Dejo un extracto de mi resultado:

```bash
pi@overclock:~$ sudo blkid
/dev/sdd1: LABEL="pendrive" UUID="79c2784f-2765-4f0e-951c-ac597750de26" TYPE="vfat"
/dev/sdc1: LABEL="wd" UUID="b43a9300-ac45-441b-8b9d-714b728c2e8b" TYPE="ntfs"
/dev/sdb1: LABEL="rednas" UUID="2eef164f-a36e-4208-b3e4-5f8b5e1e0350" TYPE="ext4"
/dev/sda2: LABEL="Overclock" UUID="3f73407a-38e2-4acf-a87b-dcffd33031bf" TYPE="ext4"
/dev/sda5: UUID="8bddf945-6b2e-48db-b438-3e8a23549934" TYPE="swap"
```

A continuación creamos las carpetas donde montaremos los sistemas, en mi caso voy a usar las etiquetas de los dispositivos:

```bash
sudo mkdir -p /media/{pendrive,wd,rednas}
```

Ya preparado el entorno, voy a exponer por segmentos como tengo configurado mi fichero **/etc/fstab**, según el tipo de sistema de ficheros.

### SSD EXT4 ⇒ fstab

```bash
#
# SSD (EXT4)
#
UUID=3f73407a-38e2-4acf-a87b-dcffd33031bf / ext4 noatime,nodelalloc,i_version,inode_readahead_blks=64,errors=remount-ro 0 1
```

### SSD SWAP ⇒ fstab

```bash
#
# SWAP SSD
#
UUID=8bddf945-6b2e-48db-b438-3e8a23549934 none swap sw 0 0
```

### HD EXT4 ⇒ fstab

```bash
#
# rednas (EXT4)
#
UUID=2eef164f-a36e-4208-b3e4-5f8b5e1e0350 /media/rednas ext4 defaults,relatime 0 0
```

### HD NTFS ⇒ fstab

```bash
#
# wd (NTFS)
#
UUID=b43a9300-ac45-441b-8b9d-714b728c2e8b /media/wd ntfs-3g rw,uid=1000,gid=1000,dmask=0002,fmask=0003 0 0
```

### HD VFAT ⇒ fstab

```bash
#
# pendrive (VFAT)
#
UUID=79c2784f-2765-4f0e-951c-ac597750de26 /media/pendrive vfat umask=000 0 0
```

### [KVM](https://lordpedal.github.io/gnu/linux/debian-servidores-virtuales/){:target="_blank"} ⇒ fstab

Esta configuración requiere de modificaciones adicionales en la gestión de la maquina virtual **(HOST)**

![KVM Fstab]({{ site.url }}{{ site.baseurl }}/assets/images/posts/kvmfstab.png)

Y a posterior añadimos en el fstab de la maquina virtual **(HUESPED)**

```bash
#
# KVM
#
/compartido /media/LXC 9p trans=virtio,version=9p2000.L,rw 0 0
```

> Y listo!
