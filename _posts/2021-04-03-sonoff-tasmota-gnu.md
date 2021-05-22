---
title:  "Sonoff Basic Tasmota: Debian GNU/Linux"
header:
  image: /assets/images/posts/tasmota0.png
date:   2021-04-03 22:30:00
last_modified_at: 2021-04-03T22:45:00
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
Anteriormente vimos como instalar [Tasmotizer](https://lordpedal.github.io/gnu/linux/tasmotizer-debian-gnu/){: .btn .btn--success .btn--small}{:target="_blank"} en nuestro sistema Debian GNU/Linux y en este tutorial vamos a explicar como instalar el firmware en un caso práctico.

Recordemos que el `Firmware Tasmota` esta diseñado para controlar un dispositivo `ESP8266` como pueda ser un `Sonoff`.

**NOTA**: Sonoff de origen lleva un firmware de control remoto llamado Ewelink que aloja los datos en servidores externos.
{: .notice--warning}

La principal **ventaja** de instalar Tasmota sobre nuestro Sonoff es que los **datos que enviamos de activación del réle se quedan en nuestra red interna y no alimentan ninguna base de datos externa**.

Para realizar este proyecto necesitaremos los siguientes materiales, adjunto enlaces de compra no monetizados:

 * **Sonoff Basic** [Amazon](https://www.amazon.es/Sonoff-Basic-Interruptor-Inteligente-Temporizador/dp/B07XYVKHNH){: .btn .btn--info .btn--small}{:target="_blank"} [AliExpress](https://es.aliexpress.com/item/4000390205431.html){: .btn .btn--warning .btn--small}{:target="_blank"}
 * **Programador TTL USB-UART** [Amazon](https://www.amazon.es/DSD-TECH-convertidor-Compatible-Windows/dp/B072K3Z3TL){: .btn .btn--info .btn--small}{:target="_blank"} [AliExpress](https://es.aliexpress.com/item/32830707982.html){: .btn .btn--warning .btn--small}{:target="_blank"}
 * **Cables Dupont** [Amazon](https://www.amazon.es/Macho-Hembra-Macho-Macho-Hembra-Hembra-Prototipo-Protoboard/dp/B01NGTXASZ){: .btn .btn--info .btn--small}{:target="_blank"} [AliExpress](https://es.aliexpress.com/item/1005002000655439.html){: .btn .btn--warning .btn--small}{:target="_blank"}

El siguiente paso es conseguir el firmware que usaremos para programar nuestro Sonoff, nos dirigimos a la siguiente Web:

```bash
http://ota.tasmota.com/tasmota/release/
```

Elegimos la versión a descargar, en nuestro caso usaremos la versión en Español y veremos dos opciones de descarga *(indiferente cual usar)*:

 * Versión comprimida [tasmota-ES.bin.gz](http://ota.tasmota.com/tasmota/release/tasmota-ES.bin.gz){: .btn .btn--small}{:target="_blank"} 
 * Versión descomprimida [tasmota-ES.bin](http://ota.tasmota.com/tasmota/release/tasmota-ES.bin){: .btn .btn--small}{:target="_blank"} 

<figure>
    <a href="/assets/images/posts/tasmota1.png"><img src="/assets/images/posts/tasmota1.png"></a>
</figure>

Como disponemos de lo necesario a nivel de Software, debemos pasarnos a preparar el hardware para poder Tasmotizarlo. Comenzamos abriendo la carcasa del Sonoff:

<figure>
    <a href="/assets/images/posts/tasmota2.png"><img src="/assets/images/posts/tasmota2.png"></a>
</figure>

Con el modulo abierto tendremos acceso a la placa y nos fijamos que dispone de cuatro pines para **comunicación serie** `3.3V TX RX GND`

**NOTA**: LLegado a este punto recomiendo soldar los cables Dupont macho sobre la placa Sonoff y deja el extremo hembra libre para conectar el programador TTL.
{: .notice--info}

<figure class="half">
    <a href="/assets/images/posts/tasmota3.png"><img src="/assets/images/posts/tasmota3.png"></a>
    <a href="/assets/images/posts/tasmota4.png"><img src="/assets/images/posts/tasmota4.png"></a>
</figure>

Conectamos el programador con la placa Sonoff guardando el siguiente esquema:

 | TTL USB-UART | Sonoff Basic |
 | ------ | ------ |
 | `3.3V` | `3.3V` |
 | `GND`  | `GND`  |
 | `TX`   | `RX`   |
 | `RX`   | `TX`   |

**NOTA**: Es muy importante realizar el cruce de los terminales **TX** con **RX**.
{: .notice--warning}

<figure>
    <a href="/assets/images/posts/tasmota5.png"><img src="/assets/images/posts/tasmota5.png"></a>
</figure>

Volvemos al PC, ejecutamos la aplicación Tasmotizer:

```bash
tasmotizer.py
```

Hacemos clic en `Open` para seleccionar el firmware descargado `.bin` 

**NOTA**: En caso de haber bajado la versión comprimida es importante descomprimirla antes.
{: .notice--info}

<figure class="half">
    <a href="/assets/images/posts/tasmota6.png"><img src="/assets/images/posts/tasmota6.png"></a>
    <a href="/assets/images/posts/tasmota7.png"><img src="/assets/images/posts/tasmota7.png"></a>
</figure>

Para realizar el flasheo seguir estos pasos:

 * **Dejar pulsado sin soltar** el boton que lleva el Sonoff
 * **Conectamos el programador TTL** a un puerto USB del PC libre
 * Hacemos clic en `Refresh` para reconocer el puerto, en nuestro caso `ttyUSB0`
 * Hacemos clic en `Tasmotize!` este proceso borrara el fimware Stock e introduce el firmware Tasmota
 * Al finalizar el proceso podremos **soltar el boton de Sonoff**
 * **Desconectar los cables Dupont** y programador TTL del PC

<figure class="third">
    <a href="/assets/images/posts/tasmota8.png"><img src="/assets/images/posts/tasmota8.png"></a>
    <a href="/assets/images/posts/tasmota9.png"><img src="/assets/images/posts/tasmota9.png"></a>
    <a href="/assets/images/posts/tasmota10.png"><img src="/assets/images/posts/tasmota10.png"></a>
</figure>

Volvemos a encender el SonOff bien por la alimentación de 3.3V + GND del TTL o bien por la linea de entrada 220V y descubrimos una nueva conexión *Wi-Fi* disponible con algún identificador que inicia con **tasmota_**

<figure class="half">
    <a href="/assets/images/posts/tasmota11.png"><img src="/assets/images/posts/tasmota11.png"></a>
    <a href="/assets/images/posts/tasmota12.png"><img src="/assets/images/posts/tasmota12.png"></a>
</figure>

Al conectarnos sobre ella, iniciamos un asistente de configuración para conectar el dispositivo SonOff a nuestra red Wi-Fi introduciendo los parámetros:

<figure class="third">
    <a href="/assets/images/posts/tasmota13.png"><img src="/assets/images/posts/tasmota13.png"></a>
    <a href="/assets/images/posts/tasmota14.png"><img src="/assets/images/posts/tasmota14.png"></a>
    <a href="/assets/images/posts/tasmota15.png"><img src="/assets/images/posts/tasmota15.png"></a>
</figure>

Tras el reset que hace al dispositivo a la red Wi-Fi doméstica, podremos entrar en su menú de configuración tras haber obtenido una ip local

<figure>
    <a href="/assets/images/posts/tasmota16.png"><img src="/assets/images/posts/tasmota16.png"></a>
</figure>

> Y listo!
