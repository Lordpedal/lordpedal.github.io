---
title:  "Raspberry Pi 4B+: Servidor ARM"
date:   2019-12-31 10:00:00 -0300
last_modified_at: 2021-01-16T11:00:00-05:00
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
Anteriormente vimos como crear un [**Servidor doméstico con base de procesador PC (AMD64)**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/){:target="_blank"} en esta ocasión vamos a realizar la misma operación pero tomando como base una **placa SBC con procesador ARM**.

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
 | **Puertos** | 2x micro HDMI, 2xUSB2.0, 2xUSB3.0, 1xRJ45, GPIO 40 pines, 1xCSI (Cámara), 1xDSI (Pantalla Táctil), 1xJack, 1xUSB-C (Alimentación) |
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

## Primer arranque RPi

Una vez finalizada la grabación de la tarjeta microSD esta la insertamos en la Raspberry Pi y conectamos un cable de red a la toma RJ45, un teclado USB, cable mini-HDMI a un Monitor/TV y alimentamos la placa por el conector USB-C.

Durante el proceso de arranque, la **partición root** de la tarjeta se expandira a la totalidad del espacio libre de la misma y veremos una pantalla de login donde se nos solicita un usuario y contraseña:

 | Usuario | Contraseña |
 | `pi` | `raspberry` |
{: .notice--success}

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
     * `¿Quieres habilitar el servidor SSH?`**YES**
 * `Finish`

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/sshrpi.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/sshrpi.webm"  type="video/webm"  />
   </video>
</div>

Tras haber realizado estos pasos, apago la Raspberry Pi:

```bash
sudo poweroff
```

Desconecto teclado USB y salida Monitor/TV mini-HDMI, ya que el resto de configuración voy a realizarla por SSH, al ser un servidor headless. Es decir, estamos hablando de un dispositivo que no dispone de un monitor o pantalla en el que mostrar su información, por lo que es necesario que nos conectemos a él de forma remota para poder usarlo. 

> Entrada en desarrollo
