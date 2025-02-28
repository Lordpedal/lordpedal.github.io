---
title:  "Tasmotizer: Debian GNU/Linux"
header:
  image: /assets/images/posts/tasmotizer1.png
date:   2021-04-01 23:30:00
last_modified_at: 2025-02-28T11:45:00
categories:
  - GNU/Linux
  - Domotica
author: Sensineger
tags:
  - GNU/Linux
  - Debian
  - Personal
  - Domotica
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[Tasmota](https://tasmota.github.io/docs/){: .btn .btn--warning .btn--small}{:target="_blank"} es un firmware de `código abierto` alternativo para placas con el **chip ESP8266 y de forma experimental ESP32** con funciones para poder domotizar sistemas.

Los creadores de dicho firmware han decidido simplificar la tarea de programar los chips ESP con una aplicación llamada `Tasmotizer`.

`Tasmotizer` no es más que una aplicación diseñada en **Python 3** que gracias a la herramienta integrada [ESPtool by Espressif](https://github.com/espressif/esptool){: .btn .btn--info .btn--small}{:target="_blank"} permite el flasheo de los dispositivos ESP mediante una interfaz gráfica muy comoda.

Las principales novedades son:

 * Realiza una copia de seguridad del firmware actual antes del flasheo para poder volver atrás **(Backups de hasta 16MB almacenamiento)**
 * Puede flashear un fichero local `.bin` o bien los descarga de sus `repositorios de Internet bajo demanda`.
 * Permite la configuración inicial para evitar tener que conectarnos al dispositivo, pudiendo dejar listo la **WiFi, MQTT, Módulo o bien el Template a usar**.

Comenzamos actualizando repositorios e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install python3-pip
```

Instalamos las dependencias y software Tasmotizer:

```bash
sudo pip3 install PyQt5 pyserial tasmotizer --break-system-packages
```

## FIXES

En el momento de escribir la entrada se encontraron unos `fallos` que no permitian la correcta ejecución del programa.

Vamos a ver como solucionarlas en las versiones de `Debian` probadas.

### Debian 10 Fix

**NOTA**: Comentar que el proceso ha sido probado sobre *Debian 10* y *Python 3.7*
{: .notice--info}

El `bug` en el momento de escribir la entrada debemos de crear un enlace símbolico a la librería `XCB`:

```bash
sudo ln -s /usr/lib/x86_64-linux-gnu/libxcb-util.so.0 /usr/lib/x86_64-linux-gnu/libxcb-util.so.1
```

### Debian 12 Fix

**NOTA**: Comentar que el proceso ha sido probado sobre *Debian 12* y *Python 3.11*
{: .notice--info}

El `bug` consiste en la falta de librerías `XCB`:

```bash
sudo apt-get update && \
sudo apt-get install -y '^libxcb.*-dev' libx11-xcb-dev libglu1-mesa-dev libxrender-dev libxi-dev libxkbcommon-dev 
libxkbcommon-x11-dev
```

## Tasmotizer

A continuación nos aseguramos de estar ejecuando el Entorno gráfico del Sistema y podremos lanzar desde la terminal la aplicación con este sencillo comando:

```bash
tasmotizer.py
```

Vista de interfaz de la aplicación tras su ejecución:

<figure>
    <a href="/assets/images/posts/tasmotizer2.png"><img src="/assets/images/posts/tasmotizer2.png"></a>
</figure>

Y vista del apartado de configuración:

<figure>
    <a href="/assets/images/posts/tasmotizer3.png"><img src="/assets/images/posts/tasmotizer3.png"></a>
</figure>

> Y listo!
