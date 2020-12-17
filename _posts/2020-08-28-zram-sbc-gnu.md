---
title:  "ZRAM: SBC GNU/Linux"
date:   2020-08-28 15:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

![Raspbian]({{ site.url }}{{ site.baseurl }}/assets/images/Raspbian.png)

Uno de las problemas más comunes de la **RPi** y la mayoria de las placas [SBC](https://es.wikipedia.org/wiki/Placa_computadora){:target="_blank"} como sabras, es que usa a modo de almacenamiento de datos una tarjeta **microSD**, salvo modificación pertinente a otro medio y sobre ella también la memoría swap.

Como hemos visto en la anterior entrada, esta peculiaridad no esta exenta de incovenientes, pero gracias a [Log2RAM](https://lordpedal.github.io/gnu/linux/log2ram-sbc-gnu/){:target="_blank"} y **Zram** mejoramos sustancialmente este problema.

**Zram** incrementa el rendimiento evitando la paginación en disco y en su lugar utiliza un dispositivo de bloques comprimidos en la memoria RAM donde la paginación toma lugar hasta que sea necesaria la utilización del espacio compartido (swap) en el disco duro.

`Zram` lo que hace es montar en **RAM** la memoría `SWAP`, acelerando considerablemente su gestión y menor deterioro de las memorias de almacenamiento.

Vamos a proceder a su configuración, para ello creamos y accedemos al directorio de trabajo:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts
```

Creamos el script:

```bash
nano zram.sh
```

Añadimos el siguiente código:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# Dectecta Cores del Sistema
cores=$(nproc --all)
modprobe zram num_devices=$cores
# Desactiva SWAP
swapoff -a
# Calcula memoria
totalmem=`free | grep -e "^Mem:" | awk '{print $2}'`
mem=$(( ($totalmem / $cores)* 1024 ))
# Inicia bucle
core=0
while [ $core -lt $cores ]; do
  echo $mem > /sys/block/zram$core/disksize
  mkswap /dev/zram$core
  swapon -p 5 /dev/zram$core
  let core=core+1
done
```

Guardamos el fichero (*Control+o*), salimos del editor (*Control+x*) y le damos permisos de ejecución:

```bash
chmod +x zram.sh
```

Vamos a copiar el script a la ruta de ejecutables:

```bash
sudo cp $HOME/scripts/zram.sh \
/usr/bin/zram.sh
```

Vamos a configurar rc.local para que lo cargue al inicio del sistema:

```bash
sudo nano /etc/rc.local
```

Y añadimos la siguiente orden `/usr/local/bin/zramswap` antes de la orden `exit 0`, quedando de la siguiente forma. Importante :

```bash
# ZRAM
/usr/bin/zram.sh &
# SALIR
exit 0
```

Guardamos el fichero (Control+o), salimos del editor (Control+x) y reiniciamos el sistema:

```bash
sudo reboot
```

Tras el reinicio, podemos comprobar resultados con estos comandos:

```bash
free -h && sudo swapon -s
```

> Y listo!
