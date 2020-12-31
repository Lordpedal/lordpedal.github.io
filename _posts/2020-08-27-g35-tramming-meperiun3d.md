---
title:  "G35 Tramming: Meperiun3D"
date:   2020-08-27 19:30:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - 3D
tags:
  - 3D
  - Marlin
  - Personal
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
header:
  teaser: /assets/images/miniE3MPth.png
---

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)
{: .full}
Una de las mejoras que se introdujeron en el firmware [2.0.6](https://es.wikipedia.org/wiki/Controlador_PID){:target="_blank"} de **Marlin**, fue un asistente de ayuda al nivelado de cama, **Gcode** [G35](https://marlinfw.org/docs/gcode/G035.html){:target="_blank"}.

La principal función de este comando es que cuando lo ejecutemos, nos tomara lecturas en las esquinas de nuestra cama y nos devolvera la corrección a aplicar sobre las ruedas de nivelación para un ajuste óptimo, de esa forma obtendremos una mejor primera capa de impresión.

Es muy sencillo de configurar pero **debemos de tener instalado y configurado un sensor de nivelado** en la impresora 3D, en mi caso tengo un [BLTouch v3.1](https://www.antclabs.com/bltouch-v3){:target="_blank"}.

![Marlin]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Marlin.jpg)

## Firmware Marlin

Parámetros que debemos de tener en cuenta para poder configurarlo en el firmware:

- Los parametros de la variable `#define NOZZLE_TO_PROBE_OFFSET`
- El tamaño de la cama de impresión `#define X_BED_SIZE` y `#define Y_BED_SIZE`
- La **metrica de las tuercas** de regulación de las ruedas de la cama y **sentido rosca** (*horario vs anti-horario*)

### Configurar G35: Tramming

Vamos a tomar como referencia para el ejemplo de configuración los parametros de mi impresora:

- `#define NOZZLE_TO_PROBE_OFFSET { 38, 0, -2.15 }`
- `#define X_BED_SIZE 235 y #define Y_BED_SIZE 235`
- Metrica `M4` y sentido `horario`

Navegamos entre la configuración del fichero `configuration_adv.h` y activamos el asistente:

```bash
#define ASSISTED_TRAMMING // Activación G35
```

A continuación debemos de configurar las cotas donde se realizaran las medidas, para ello vamos a modificar la orden `//define TRAMMING_POINT_XY { { A, A }, { B, A }, { B, B }, { A, B } }`

- El valor de la **variable A es igual al parametro del eje X** en la sección `NOZZLE_TO_PROBE_OFFSET` en mi caso **38**
- El valor del la **variable B es la diferencia entre el tamaño de la cama y la variable A**, en mi caso 235-38 = **197**

Teniendo en cuenta estos valores ya podremos configurar las cotas, quedando de la siguiente forma el comando:

```bash
#define TRAMMING_POINT_XY { { 38, 38 }, { 197, 38 }, { 197, 197 }, { 38, 197 } }
```

Y ahora quedaría definir la metrica y el sentido de rosca de las ruedas de regulación en el parametro `#define TRAMMING_SCREW_THREAD`

- M3: `30` = Horario, `31` = Anti-horario
- M4: `40` = Horario, `41` = Anti-horario
- M5: `50` = Horario, `51` = Anti-horario

Quedando en mi caso de la siguiente forma:

```bash
#define TRAMMING_SCREW_THREAD 40
```

Adjunto detalle de configuración:

![G35_Marlin]({{ site.url }}{{ site.baseurl }}/assets/images/posts/G35_Tramming_1.jpg)

Tras haber configurado estas opciones mencionadas en **Marlin**, tendriamos que volver a **flashear el firmware** en la impresora para poder usarlo.

**Recuerda que tras flashear un firmware siempre debes de hacer un reset a la Eeprom** con los Gcodes: **M502** y **M500** (ejecutar en ese orden)

Si dispones de **LCD** veras que se ha activado una nueva opción que te permite lanzarlo a demanda.

![OctoPrint]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Octoprint.jpg)

## OctoPrint: Terminal

![G35_OctoPrint]({{ site.url }}{{ site.baseurl }}/assets/images/posts/G35_Tramming_2.jpg)

Adjunto ejemplo de la corrección que me devuelve:

```bash
Recv: Turn Front-Right Clockwise by 0 turns and 3 minutes
Recv: Turn Back-Right Clockwise by 0 turns and 2 minutes
Recv: Turn Back-Left Clockwise by 0 turns
```

Mi desviación de cama es de unos 0.08mm y me esta diciendo que para corregirla aún más, debo de girar la rueda de nivelación frontal derecha 3min sentido horario y trasera derecha 2min, si partimos de que 60min equivaldrían a 1 vuelta completa…

> Y listo!
