---
title:  "Arduino UNO TTL: Debian GNU/Linux"
header:
  image: /assets/images/posts/arduino0.jpg
date:   2021-05-25 22:30:00
last_modified_at: 2021-05-25T22:45:00
categories:
  - GNU/Linux
  - Domotica
author: Sensineger
tags:
  - GNU/Linux
  - Debian
  - Personal
  - Domotica
toc: false
toc_sticky: false
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
Anteriormente vimos como instalar [Sonoff Basic Tasmota](https://lordpedal.github.io/gnu/linux/domotica/sonoff-tasmota-gnu/){: .btn .btn--success .btn--small}{:target="_blank"} y como alternativa del programador **TTL USB-UART** voy a plantear una alternativa si disponemos en casa de un **Arduino UNO**.

Vamos a necesitar como requisito previo tener instalado el IDE de Arduino instalado en el sistema, en el momento de escribir la entrada es la versión **1.8.15**:

 * Versión [Windows](https://downloads.arduino.cc/arduino-1.8.15-windows.zip){: .btn .btn--warning .btn--small}{:target="_blank"} 
 * Versión [Windows Store](https://www.microsoft.com/store/apps/9nblggh4rsd8?ocid=badge){: .btn .btn--warning .btn--small}{:target="_blank"} 
 * Versión [Linux 32bits](https://downloads.arduino.cc/arduino-1.8.15-linux32.tar.xz){: .btn .btn--info .btn--small}{:target="_blank"} 
 * Versión [Linux 64bits](https://downloads.arduino.cc/arduino-1.8.15-linux64.tar.xz){: .btn .btn--info .btn--small}{:target="_blank"} 
 * Versión [Linux ARM](https://downloads.arduino.cc/arduino-1.8.15-linuxarm.tar.xz){: .btn .btn--info .btn--small}{:target="_blank"} 
 * Versión [Mac OS X](https://downloads.arduino.cc/arduino-1.8.15-macosx.zip){: .btn .btn--danger .btn--small}{:target="_blank"} 

Preparamos el material antes de comenzar:

 * Placa **Arduino UNO o compatible**
 * Cable **USB Tipo A a USB Tipo B**
 * Cuatro cables **Dupont Macho-Macho**

**NOTA**: La placa ELEGOO UNO R3 es un clon compatible de Arduino UNO.
{: .notice--warning}

<figure>
    <a href="/assets/images/posts/arduino1.jpg"><img src="/assets/images/posts/arduino1.jpg"></a>
</figure>

Conectamos los cables Dupont en las tomas **`3.3V + GND + RX + TX`**, el conector **`USB Tipo B a la placa Arduino`** y el conector **`USB tipo A sobre un puerto del PC`**

<figure class="half">
    <a href="/assets/images/posts/arduino2.jpg"><img src="/assets/images/posts/arduino2.jpg"></a>
    <a href="/assets/images/posts/arduino3.jpg"><img src="/assets/images/posts/arduino3.jpg"></a>
</figure>

Ejecutamos el programa **Arduino IDE** y hacemos clic en el **menú Herramientas** para seleccionar las siguientes opciones:

 * Placa: `Arduino/Genuino UNO`
 * Puerto (*elegimos el puerto donde detecta la placa*): `/dev/ttyACM0 (Arduino/Genuino UNO)`
 * Programador: `AVRISP mkII`

<figure>
    <a href="/assets/images/posts/arduino4.jpg"><img src="/assets/images/posts/arduino4.jpg"></a>
</figure>

Hacemos clic en el **menú Archivo**, sobre la opción **Nuevo Ctrl+N** para que se generar el código por defecto

<figure>
    <a href="/assets/images/posts/arduino5.jpg"><img src="/assets/images/posts/arduino5.jpg"></a>
</figure>

A continuación tendremos que subir el sketch a nuestra placa con el **boton Subir** para poder programarla

<figure class="half">
    <a href="/assets/images/posts/arduino6.jpg"><img src="/assets/images/posts/arduino6.jpg"></a>
    <a href="/assets/images/posts/arduino7.jpg"><img src="/assets/images/posts/arduino7.jpg"></a>
</figure>

Cuando el proceso finaliza ya tendriamos configurado nuestro propio programador USB-UART con una placa Arduino UNO.

 | Arduino UNO | Cable Dupont |
 | ------ | ------ |
 | `3.3V` | `Rojo` |
 | `GND`  | `Marrón`  |
 | `TX`   | `Amarillo`   |
 | `RX`   | `Naranja`   |

<figure>
    <a href="/assets/images/posts/arduino8.jpg"><img src="/assets/images/posts/arduino8.jpg"></a>
</figure>

> Y listo!
