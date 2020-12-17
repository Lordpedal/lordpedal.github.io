---
title:  "Log2ram: SBC GNU/Linux"
date:   2020-08-28 14:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

Desde hace algún tiempo, llevo usando una [Raspberry Pi](https://www.raspberrypi.org/){:target="_blank"} para hacer las funciones de servidor de impresión 3D, gracias a [OctoPrint](https://lordpedal.github.io/docker/3d/octoprint-docker/){:target="_blank"}.

La peculiaridad de la **RPi** y la mayoria de las placas [SBC](https://es.wikipedia.org/wiki/Placa_computadora){:target="_blank"} como sabras, es que usa a modo de almacenamiento de datos una tarjeta **microSD**, salvo modificación pertinente a otro medio.

Esta peculiaridad no esta exenta de incovenientes, el principal de ellos es que el número de escrituras no es ilimitado y tras un número determinado (bastante elevado) de ellas el dispositivo se daña.

Y aquí es donde entra en juego este genial script, llamado [Log2RAM](https://github.com/azlux/log2ram){:target="_blank"}.

`Log2ram` lo que hace es montar en **RAM** la carpeta `/var/log`, esto lo combina con una tarea automática, que cada hora lo vuelca a la microSD sincronizando todo usando **cron**.

Vamos a proceder a su instalación y configuración, para ello primeramente actualizamos repositorios e instalamos dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install git sed
```

A continuación creamos y accedemos al directorio de trabajo:

```bash
mkdir -p $HOME/source && cd $HOME/source
```

Clonamos el repositorio y accedemos a la carpeta base de instalación:

```bash
git clone https://github.com/azlux/log2ram.git && \
cd $HOME/source/log2ram
```

Ajustamos la cache en RAM del archivo de configuración, a posterior ajustar el fichero de configuración en `/etc/log2ram.conf`:

```bash
sed -i 's/SIZE=40M/SIZE=128M/g' "log2ram.conf"
```

Damos privilegios de ejecución al instalador y lo lanzamos para instalar:

```bash
chmod +x install.sh && sudo ./install.sh
```

Reiniciamos para activar los cambios:

```bash
sudo reboot
```

Para comprobar que el script esta siendo ejecutado, tras el reinicio ejecutaremos:

```bash
df -h
```

Adjunto ejemplo filtrando el resultado:

```bash
pi@ORPi3B:~$ df -h | grep log2ram
log2ram 128M 13M 116M 10% /var/log
```

Si por algún motivo no obtenemos los resultados deseados, el proceso de **desinstalación** es muy sencillo:

```bash
cd $HOME/source/log2ram && \
chmod +x uninstall.sh && \
sudo ./uninstall.sh && sudo reboot
```

Para comprobar si el **repositorio** que hemos clonado ha sido **actualizado** y tenemos acceso a la ultima versión:

```bash
cd $HOME/source/log2ram && \
git pull
```

> Y listo!
