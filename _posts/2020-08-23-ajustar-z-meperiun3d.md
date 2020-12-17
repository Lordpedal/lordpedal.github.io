---
title:  "Ajustar Offset Z con Terminal: Meperiun3D"
date:   2020-08-23 04:00:00 -0300
last_modified_at: 2020-12-16T10:00:00-05:00
categories:
  - 3D
tags:
  - 3D
---

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)

Ajustar el **Offset del eje Z** es una tarea que especialmente debemos de realizar si hemos modificado nuestra **impresora 3D**, por ejemplo con un sensor de nivelado como vimos en la anterior entrada de UBL, aunque no sería el único contexto en el que fuese aplicable.

Como veremos más adelante, en futuros posts sobre la configuración de **Marlin**, la opción más directa, sencilla y visual es realizarlo desde el propio [LCD](https://reprap.org/wiki/RepRapDiscount_Full_Graphic_Smart_Controller){:target="_blank"} de la impresora (configurando [Baby Stepping](https://marlinfw.org/docs/gcode/M290.html){:target="_blank"}), pero si no dispones de LCD sino de [TFT](https://reprap.org/wiki/Mks_tft){:target="_blank"}, esta opción no se contempla de la misma forma y debe de realizarse desde una Terminal de comandos como pueda ser por ejemplo: [OctoPrint](https://lordpedal.github.io/docker/3d/octoprint-docker/){:target="_blank"}, [Pronterface](https://www.pronterface.com/){:target="_blank"}, …

El proceso no es laborioso de realizar pero se ha de realizar de forma especifica en la secuencia de comandos.

- **Calentar cama y fusor** a sus temperaturas de impresión habitual, esperando unos minutos para que se estabilicen las dilataciones que se producen

- Fijamos el **desfase a valor 0** enviando el siguiente comando:

```bash
M851 Z0
```

- **Guardamos** en la **EEPROM** el nuevo valor con el comando:

```bash
M500
```

- Mandamos de hacer un **Home** a todos los ejes (XYZ)con el comando

```bash
G28
```

- Con los controles de movimiento integrados en el software de gestión, ajustamos hasta asegurar que el eje Z baja hasta su cota 0. **Recomiendo bajar en la escala de 1mm**.

- Dado que existe una **protección en el firmware** que impide los movimientos hacia posiciones negativas, tendremos que **desactivarla** mientras realizamos este ajuste, enviando el comando:

```bash
M211 S0
```

- Nuevamente seguiremos con los controles de movimiento del eje Z hasta que hallamos podido ajustar la altura de la boquilla del extrusor al huelgo de **0.1mm** (roce folio de papel o galga de 1 décima). **Recomiendo bajar con pulsos cortos < 1mm** para evitar sorpresas.

- Nos fijamos el valor del desfase obtenido en nuestra **LCD/TFT** y lo tendremos que memorizar en la EEPROM con el comando `M851 Z-x.xx` (si el valor obtenido es negativo < 0) o `M851 Zx.xx` (si el valor obtenido es positivo > 0) .  Vamos a por un **ejemplo** de supuesto desfase de **-1.95mm** en ese caso enviamos el comando:

```bash
M851 Z-1.95
```

- A partir de este momento para la lógica de Marlin el 0 físico equivaldría según el ejemplo previo en -1.95mm, para evitar situaciones no deseadas, **volveremos a activar la protección** de movimientos negativos de los ejes, con el comando:

```bash
M211 S1
```

- **Guardamos** el  nuevo valor y la protección en la **EEPROM** nuevamente con el comando:

```bash
M500
```

📝 **NOTA**: Si a posterior lanzáramos el comando `M502` **borraremos el offset que hemos hecho de la EEPROM** y tendríamos que repetir nuevamente el proceso.

Si sabemos que el valor es fijo en ese caso mejor definirlo en **Marlin** (`configuration.h`) dentro de la variable

```bash
#define NOZZLE_TO_PROBE_OFFSET
```

> Y listo!
