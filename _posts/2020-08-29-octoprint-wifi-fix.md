---
title:  "OctoPrint Wifi: Fix GNU/Linux"
date:   2020-08-29 16:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

Un problema que os podeís encontrar si usáis la `conexión vía wifi` de la **Raspberry Pi**, por ejemplo para [OctoPrint](https://lordpedal.github.io/docker/3d/octoprint-docker/){:target="_blank"}, es que esta pierda la conexión tras haber entrado en hibernación debido a una protección heredada de los sistemas `GNU/Linux` sobre redes inalambricas.
Conectándonos por [SSH](https://es.wikipedia.org/wiki/Secure_Shell){:target="_blank"} o bien con desde la interfaz `tty1` podremos comprobar si esta activa o no dicha protección.

Para ello ejecutamos en terminal:

```bash
sudo iwconfig
```

El resultado que esperamos ver es `Power Management: off`, para evitar desconexiones por hibernacion, en ese supuesto no debemos de realizar ningún cambio.
Sin embargo si la respuesta es `Power Management: on`, podemos solucionarlo de esta forma:

```bash
sudo nano /etc/rc.local
```

Y agregamos el siguiente codigo justo antes de la orden `exit 0`:

```bash
# Deshabilitar hibernación Wifi
/sbin/iwconfig wlan0 power off
```

Guardariamos el fichero, saldríamos del editor y reiniciariamos la Raspberry

```bash
sudo reboot
```

> Y listo!
