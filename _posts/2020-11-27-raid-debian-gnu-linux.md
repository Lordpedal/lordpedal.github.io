---
title:  "RAID: Debian GNU/Linux"
date:   2020-11-27 10:00:00 -0300
last_modified_at: 2020-11-27T10:00:00-05:00
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

**RAID** es un acrónimo del inglés que significa **Redundant Array of Independent Disks**, literalmente `matriz de discos independientes redundantes`, aunque no todos los sistemas RAID proporcionan redundancia.

La finalidad de un sistema RAID de discos consiste en crear un único volumen con varios discos duros funcionando en conjunto:

- **Redundancia**: Tolerancia a fallos en el caso de que uno falle, conocido como `disk mirroring`
- **Mayor velocidad**: Haciendo que ese conjunto sea en realidad un tándem, conocido como `disk striping`
  
## Tipos Sistemas RAID

Un sistema RAID se puede crear de las siguientes formas:

- **Hardware**: Se puede usar hardware dedicado llamado controladores RAID o tarjetas RAID para configurar y administrar RAID independientemente del sistema operativo. Los verdaderos controladores RAID de hardware tendrán un procesador dedicado para administrar dispositivos RAID.
  - `Ventajas: Rendimiento, sencillez y disponibilidad desde el arranque`
  - `Desventajas: Dependencias de un proveedor y alto coste`

- **Software**: Configurado por el propio sistema operativo. Dado que la relación de los discos entre sí se define dentro del sistema operativo en lugar del firmware de un dispositivo de hardware.
  - `Ventajas: Flexibilidad, código abierto y sin costes adicionales de hardware específico`
  - `Desventajas: Implementación específica según Sistema Operativo y leve carga adicional al procesador`

- **Fake-RAID** `(Hardware asistido por Software)`: Por lo general, este se encuentra en la funcionalidad RAID dentro de las propias placas base. El software RAID asistido por hardware es una implementación que usa firmware en el controlador o la tarjeta para administrar el RAID, pero usa la CPU normal para manejar el procesamiento.
  - `Ventajas: Compatibilidad con varios sistemas operativos`
  - `Desventajas: Limitado soporte RAID 0/1, hardware específico y sobrecarga de rendimiento`
  
## Tipos Configuración RAID

Las características de una matriz están determinadas por la configuración y la relación de los discos, conocida como su nivel RAID. Los niveles RAID más comunes son:

- **Mínimo dos discos duros:**
  - **RAID 0**: Este tipo de RAID supone el concepto principal que proporciona mayor velocidad al sistema. La información se va escribiendo en dos discos de manera alterna, es decir, un bit en uno, y otro bit en otro, de manera que el ancho de banda es literalmente el doble y por eso se mejora notablemente el rendimiento en este modo. Además, se duplica la capacidad del volumen, es decir, si usamos dos discos duros de 1 TB cada uno, tendríamos un volumen de 2 TB. La contrapartida de este tipo de RAID es que si fallara alguno de los dos discos duros, la información de los dos se echaría a perder puesto que se encontraría repartida entre ambos.
  - **RAID 1**: Este es el otro tipo básico de RAID, y supone el concepto principal de redundancia. En este modo, los datos se escriben en los dos discos de manera simultánea, siendo el uno una copia exacta del otro, motivo por el que se conoce a este modo como «mirroring». En este caso, si se estropeara uno de los dos discos no pasaría nada porque los datos estarían todavía en el otro, y bastaría con reemplazar el disco estropeado por uno nuevo para volver a restablecer el RAID 1. El tamaño del volumen será el del disco de menor capacidad. Es decir, si usáramos un disco de 1 TB y otro de 500 GB, tendríamos un volumen de 500 GB en RAID 1.

- **Mínimo tres discos duros:**
  - **RAID 5**: En este tipo se incrementa el rendimiento de lectura del volumen, multiplicando éste por tantos discos como conformen el RAID menos uno. Es decir, si tuviéramos 5 discos duros en RAID 5, la velocidad se multiplicaría por 4. Además, tendríamos tolerancia a fallos de un disco: si falla un disco, no se pierde nada, se cambia el disco y listo. La parte mala de este sistema RAID de discos duros es que si fallaran dos discos, sí que tendríamos pérdida de datos.

- **Mínimo cuatro discos duros:**
  - **RAID 6**: Es una variante del RAID 5 pero que emplea dos discos como backup en lugar de uno, y por lo tanto la velocidad es de n-2, siendo n el total de discos del conjunto. Es un RAID 5 pero un poco más seguro, con mayor gasto en inversión inicial.
  - **RAID 10** `(RAID 1+0)`: En esta variante consiste en hacer primero dos RAID 1 y luego un RAID 0 entre ellos, teniendo así en total 4 discos duros con 2 discos de tolerancia a fallos uno por cada RAID 1 y en RAID 0 para una mayor velocidad.

Para configurar sobre nuestra base GNU/Linux Debian, he querido añadir este **mini-tutorial** *basado en un RAID de Software* que sería extensible a otras arquitecturas.

## Instalar dependencias

Comenzamos satisfaciendo las dependencias que necesitaremos:

```bash
sudo apt-get update && \
sudo apt-get -y install mdadm
```

Y posteriormente identificando los discos duros/memorias USB:

```bash
lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
```

En mi caso obtengo los siguientes datos:

```bash
pi@overclock:~$ lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
NAME     SIZE FSTYPE TYPE MOUNTPOINT
sdc       16G        disk
sdd       16G        disk
sde       16G        disk
sdf       16G        disk
sda      465G        disk 
├─sda1     1K        part /
├─sda2   450G ext4   part /
└─sda5    15G swap   part
sdb      3,7T        disk 
└─sdb1   3,7T ext4   part /media/rednas
```

Ya preparado el entorno, voy a exponer por segmentos como podriamos configurar diferentes RAID´s.

## Configurar RAID0

Comenzamos creando la estructura:

```bash
sudo mdadm --create --verbose /dev/md0 --level=0 \
--raid-devices=2 /dev/sdc /dev/sdd
```

Comprobamos que ha sido creado correctamente:

```bash
cat /proc/mdstat
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ cat /proc/mdstat 
Personalities : [linear] [multipath] [raid0] [raid1] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid0 sdd[1] sdc[0]
      209584128 blocks super 1.2 512k chunks

unused devices: <none>
```

Formateamos el sistema de ficheros de nuestro RAID:

```bash
sudo mkfs.ext4 -F /dev/md0
```

Creamos una carpeta para montar el sistema de ficheros:

```bash
sudo mkdir -p /media/raid0
```

Lo montamos para comprobar correcto funcionamiento:

```bash
sudo mount /dev/md0 /media/raid0
```

Comprobamos el espacio disponible:

```bash
df -h -x devtmpfs -x tmpfs
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ df -h .x devtmpfs -x tmpfs
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       443G   29G  391G   7% /
/dev/sdb1       3,6T  2.8T  702G  80% /media/rednas
/dev/md0         31G   60M   28G   1% /media/raid0
```

Solamente faltaría añadirlo a nuestro arranque del sistema para que sea cargado tras reiniciar el sistema de forma automática.

## Configurar RAID1

Comenzamos creando la estructura:

```bash
sudo mdadm --create --verbose /dev/md0 --level=1 \
--raid-devices=2 /dev/sdc /dev/sdd
```

Si los discos duros/memorias USB no llevan activa la casilla de arranque nos mostrara la siguiente advertencia a la que decimos de continuar (**y**):

```bash
mdadm: Note: this array has metadata at the start and
    may not be suitable as a boot device.  If you plan to
    store '/boot' on this device please ensure that
    your boot-loader understands md/v1.x metadata, or use
    --metadata=0.90
mdadm: size set to 104792064K
Continue creating array? y
```

Comprobamos que ha sido creado correctamente:

```bash
cat /proc/mdstat
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ cat /proc/mdstat
Personalities : [linear] [multipath] [raid0] [raid1] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid1 sdd[1] sdc[0]
      104792064 blocks super 1.2 [2/2] [UU]
      [====>................]  resync = 20.2% (21233216/104792064) finish=6.9min speed=199507K/sec

unused devices: <none>
```
  
Formateamos el sistema de ficheros de nuestro RAID:

```bash
sudo mkfs.ext4 -F /dev/md0
```

Creamos una carpeta para montar el sistema de ficheros:

```bash
sudo mkdir -p /media/raid1
```

Lo montamos para comprobar correcto funcionamiento:

```bash
sudo mount /dev/md0 /media/raid1
```

Comprobamos el espacio disponible:

```bash
df -h -x devtmpfs -x tmpfs
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ df -h .x devtmpfs -x tmpfs
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       443G   29G  391G   7% /
/dev/sdb1       3,6T  2.8T  702G  80% /media/rednas
/dev/md0         16G   60M   14G   1% /media/raid1
```

Un detalle a tener en cuenta sobre este tipo de RAID como explicamos al principio, si un disco duro se avería, este se podría sacar de servicio y meter otro en sustitución para volver a tener backup. Esto lo podríamos comprobar con el siguiente comando:

```bash
sudo mdadm --detail /dev/md0
```

Suponiendo que nos fallara el disco /dev/sdc, tendriamos que marcarlo como fallido y sacarlo de servicio:

```bash
sudo mdadm --manage /dev/md0 --fail /dev/sdc && \
sudo mdadm --manage /dev/md0 --remove /dev/sdc
```

Y para agregar nuevamente otro:

```bash
sudo mdadm --manage /dev/md0 --add /dev/sdc
```

Solamente faltaría añadirlo a nuestro arranque del sistema para que sea cargado tras reiniciar el sistema de forma automática.
 
## Configurar RAID5

Comenzamos creando la estructura:

```bash
sudo mdadm --create --verbose /dev/md0 --level=5 \
--raid-devices=3 /dev/sdc /dev/sdd /dev/sde
```

Comprobamos que ha sido creado correctamente:

```bash
cat /proc/mdstat
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ cat /proc/mdstat 
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid5 sde[3] sdd[1] sdc[0]
      209584128 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/3] [UUU]

unused devices: <none>
```
  
Formateamos el sistema de ficheros de nuestro RAID:

```bash
sudo mkfs.ext4 -F /dev/md0
```

Creamos una carpeta para montar el sistema de ficheros:

```bash
sudo mkdir -p /media/raid5
```

Lo montamos para comprobar correcto funcionamiento:

```bash
sudo mount /dev/md0 /media/raid5
```

Comprobamos el espacio disponible:

```bash
df -h -x devtmpfs -x tmpfs
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ df -h .x devtmpfs -x tmpfs
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       443G   29G  391G   7% /
/dev/sdb1       3,6T  2.8T  702G  80% /media/rednas
/dev/md0         31G   60M   28G   1% /media/raid5
```

Solamente faltaría añadirlo a nuestro arranque del sistema para que sea cargado tras reiniciar el sistema de forma automática.

## Configurar RAID6

Comenzamos creando la estructura:

```bash
sudo mdadm --create --verbose /dev/md0 --level=6 \
--raid-devices=4 /dev/sdc /dev/sdd /dev/sde /dev/sdf
```

Comprobamos que ha sido creado correctamente:

```bash
cat /proc/mdstat
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ cat /proc/mdstat 
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid6 sdf[3] sde[2] sdd[1] sdc[0]
      209584128 blocks super 1.2 level 6, 512k chunk, algorithm 2 [4/4] [UUUU]
      [===>.................]  recovery = 0.6% (668572/104792064) finish=10.3min speed=200808K/sec

unused devices: <none>
```
  
Formateamos el sistema de ficheros de nuestro RAID:

```bash
sudo mkfs.ext4 -F /dev/md0
```

Creamos una carpeta para montar el sistema de ficheros:

```bash
sudo mkdir -p /media/raid6
```

Lo montamos para comprobar correcto funcionamiento:

```bash
sudo mount /dev/md0 /media/raid6
```

Comprobamos el espacio disponible:

```bash
df -h -x devtmpfs -x tmpfs
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ df -h .x devtmpfs -x tmpfs
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       443G   29G  391G   7% /
/dev/sdb1       3,6T  2.8T  702G  80% /media/rednas
/dev/md0         31G   60M   28G   1% /media/raid6
```

Solamente faltaría añadirlo a nuestro arranque del sistema para que sea cargado tras reiniciar el sistema de forma automática.
 
## Configurar RAID10

Comenzamos creando la estructura:

```bash
sudo mdadm --create --verbose /dev/md0 --level=10 \
--layout=o3 --raid-devices=4 /dev/sdc /dev/sdd /dev/sde /dev/sdf
```

Comprobamos que ha sido creado correctamente:

```bash
cat /proc/mdstat
```

En mi caso obtengo elsiguiente resultado:

```bash
pi@overclock:~$ cat /proc/mdstat 
Personalities : [raid6] [raid5] [raid4] [linear] [multipath] [raid0] [raid1] [raid10] 
md0 : active raid10 sdf[3] sde[2] sdd[1] sdc[0]
      209584128 blocks super 1.2 512K chunks 2 near-copies [4/4] [UUUU]
      [===>.................]  resync = 18.1% (37959424/209584128) finish=13.8min speed=206120K/sec

unused devices: <none>
```

Formateamos el sistema de ficheros de nuestro RAID:

```bash
sudo mkfs.ext4 -F /dev/md0
```

Creamos una carpeta para montar el sistema de ficheros:

```bash
sudo mkdir -p /media/raid10
```

Lo montamos para comprobar correcto funcionamiento:

```bash
sudo mount /dev/md0 /media/raid10
```

Comprobamos el espacio disponible:

```bash
df -h -x devtmpfs -x tmpfs
```

En mi caso obtengo el siguiente resultado:

```bash
pi@overclock:~$ df -h .x devtmpfs -x tmpfs
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       443G   29G  391G   7% /
/dev/sdb1       3,6T  2.8T  702G  80% /media/rednas
/dev/md0         31G   60M   28G   1% /media/raid10
```

Solamente faltaría añadirlo a nuestro arranque del sistema para que sea cargado tras reiniciar el sistema de forma automática.
 
## Configurar RAID: Arranque Sistema

Independiente del tipo de RAID que elijamos el montado del mismo al arranque del sistema es común y se realiza de la siguiente forma:

```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

Posteriormente, regeneramos **`initramfs`** (sistema de archivos RAM inicial), para que la matriz esté disponible durante el proceso de arranque inicial:

```bash
sudo update-initramfs -u
```

Agregamos la información a nuestro fstab, recuerda cambiar el valor **/media/raid1** por el tipo de RAID que has elegido, por ejemplo: **/media/raid5**

```bash
echo '/dev/md0 /media/raid1 ext4 defaults,nofail,discard 0 0' | \
sudo tee -a /etc/fstab
```

Reiniciamos el sistema:

```bash
sudo reboot
```
   
> Y listo!
