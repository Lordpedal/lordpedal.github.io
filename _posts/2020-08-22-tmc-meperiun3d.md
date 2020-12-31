---
title:  "**Regular amperaje TMC**: Meperiun3D"
date:   2020-08-22 19:00:00 -0300
last_modified_at: 2020-12-16T10:00:00-05:00
categories:
  - 3D
tags:
  - 3D
header:
  teaser: /assets/images/Meperiun3D.png
---

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)
{: .full}
Los drivers [TMC](https://www.trinamic.com/){:target="_blank"} son una gran mejora en el mundo de la **impresión 3D**, sobre todo por sus opciones de configuración y resolución.

En esta entrada vamos a ver la formula, que usaremos para el calculo de su amperaje máximo.

Para ello tendremos que restar al menos un **10%** (*factor de seguridad*) al resultado de dividir la corriente **máxima del Stepper** (*valor RMS* según sus especificaciones) entre **1.42**

```bash
Imax = (Irms / 1,42) - 10%
```

✏️ **TIP**: Sino disponemos del valor RMS en las especificaciones pero si el valor pico, podríamos calcular el valor RMS de la siguiente forma:

```bash
Irms = Ipico x 0.7
```

A partir de este momento que ya sabemos su valor máximo, pasaremos a configurarlo.

La regulación se podría realizar tanto con potenciómetro en el supuesto de tener el driver en  modo **Step/dir** como a través del **LCD** si esta en **UART/SPI**.

Vamos a ver diferentes diferentes ejemplos de amperajes según Steppers.

| Driver | Comunicación | Formula |
| ------ | ------ | ------ |
| TMC2100 | Step/Dir | (1200/1.42) – 10% = +/-760mA |
| TMC2130 | Step/Dir – SPI | (1200/1.42) – 10% = +/-760mA |
| TMC2208 | Step/Dir – UART | (1200/1.42) – 10% = +/-760mA |
| TMC2209 | Step/Dir – UART | (1500/1.42) – 10% = +/-950mA |
| TMC5160 | Step/Dir – SPI | (3000/1.42) – 10% = +/-1.9A |
| TMC2225 | Step/Dir – UART | (1400/1.42) – 10% = +/-890mA |
| TMC2226 | Step/Dir – UART | (1800/1.42) – 10% = +/-1.1A |

En la configuración del firmware **Marlin**, cuando definimos un driver que podría soportar  UART o SPI, pero bien por limitación de nuestra electrónica o bien porque el driver no lleva los puentes necesarios realizados, tendríamos que definirlo como con la coletilla `standalone` y se convertiría en `Step/Dir`.

```bash
TMC2208 > TMC2208_STANDALONE
```

Si por el contrario tenemos soporte del protocolo **UART** o **SPI** lo definiríamos sin la coletilla standalone, para poder disfrutar de la configuración avanzada.

> Y listo!
