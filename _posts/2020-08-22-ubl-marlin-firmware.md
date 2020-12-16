---
title:  "UBL: Marlin Firmware"
date:   2020-08-22 10:30:00 -0300
last_modified_at: 2020-12-17T10:00:00-05:00
categories:
  - 3D
tags:
  - Marlin
  - 3D
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

En esta entrada vamos a realizar una rápida comparativa entre los dos mejores sistemas actuales de nivelación con sensor:

**Bilinear Leveling**: Sondea una cuadrícula y crea una malla para representar imperfecciones en la cama, dicha malla se almacena en la **RAM** no en la EEPROM.

**UBL (Unified Bed Leveling)**: Combina la nivelación Bilinear y el guardado de malla. Ademas agrega varias herramientas, como la edición matricial, para afinar los resultados del sondeo. Otra gran característica es que puede guardar múltiples mallas en la **EEPROM**.

El nivelado basado en Bilinear lo considero obsoleto pudiendo disponer de UBL.

Este tiene muchas más opciones de ajuste, en una placa con suficiente memoria como es el caso de la mayoria de las actuales **(+256kb)**.

## Configurar Marlin

Ahora vamos detallar de forma sencilla como activar **UBL con BLTouch**, para ello activamos los siguientes ajustes en Marlin:

1º Definir posición de **BLTouch con respecto al Nozzle** `(configuration.h)`:

```bash
#define NOZZLE_TO_PROBE_OFFSET { -43, -9, -2.95 }
```

2º Activamos la opción de usar el BLTouch como **Endstop** en el **eje Z** (configuration.h):

```bash
#define Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN
```

3º Activamos **UBL** `(configuration.h)`:

```bash
/#define AUTO_BED_LEVELING_3POINT

//#define AUTO_BED_LEVELING_LINEAR
//#define AUTO_BED_LEVELING_BILINEAR
#define AUTO_BED_LEVELING_UBL
//#define MESH_BED_LEVELING
```

4º Activamos la opción de restaurar tras hacer un home **G28** `(configuration.h)`:

```bash
#define RESTORE_LEVELING_AFTER_G28
```

5º Habilitamos **SAFE_HOMING** para que realice el home de Z en el centro de la cama `(configuration.h)`:

```bash
#define Z_SAFE_HOMING
```

6º Comprobamos los siguientes ajustes para ajustar la **altura del eje Z** en test y tras ellos `(configuration.h)`:

```bash
#define Z_CLEARANCE_DEPLOY_PROBE 10
#define Z_CLEARANCE_BETWEEN_PROBES 5
#define Z_CLEARANCE_MULTI_PROBE 5
#define Z_AFTER_PROBING 5
```

7º Activamos soporte **BLTouch** `(configuration.h)`:

```bash
#define BLTOUCH
```

8º Con el **Gcode M119** se espera que Z_MIN reporte estado “triggered” con el pin introducido y “open” con el pin extraído. Debido a esto seguramente habrá que invertir la señal respecto a lo que seria habitual en un final de carrera, hay que dejar configurados los endstop de Z como sigue `(configuration.h)`:

```bash
#define Z_MIN_ENDSTOP_INVERTING true
#define Z_MIN_PROBE_ENDSTOP_INVERTING true
```

9º Recomiendo **configurar un delay** para evitar problemas en la respuesta de BLTouch `(configuration_adv.h)`:

```bash
#define BLTOUCH_DELAY 375
```

**NOTA**: Solamente si el BLTouch que tienes es **v3.0 o superior** es necesario activar la siguiente opción `(configuration_adv.h)`:

```bash
#define BLTOUCH_SET_5V_MODE
```

10º Agregamos la opción **DEBUG** al leveling para aportar info adicional cuando cuando hacemos comunicación por terminal `(configuration.h)`:

```bash
#define DEBUG_LEVELING_FEATURE
```

11º Opcionalmente yo prefiero activar la siguiente opción de cara a facilitar un primer nivelado manual `(configuration.h)`:

```bash
#define LEVEL_BED_CORNERS
```

12º Activando esta opción se realizará una corrección de nivelado hasta la altura deseada “difuminando” el desnivel progresivamente para finalmente llegar a la cota deseada a un nivel 0 en el que ya no será necesario seguir realizando auto corrección y reduciendo por tanto la carga sobre los steppers en Z `(configuration.h)`:

```bash
#define ENABLE_LEVELING_FADE_HEIGHT
```

13º Opcional podemos activar la siguiente opción para comprobar de forma impresa la niveación de la cama `(configuration.h)`:

```bash
#define G26_MESH_VALIDATION
```

14º Creamos y activamos el **script de automatización de UBL**, para ello buscamos y añadimos bajo el siguiente script `(configuration.h)`:

```bash
//#define Z_PROBE_END_SCRIPT
#define Z_PROBE_END_SCRIPT "G29 P3 \n G29 P3 \n G29 S1 \n G29 F10.0 \n G29 A \n M500 \n G29 T \n M300 S440 P200 \n M300 S660 P250 \n M300 S880 P300"
```

Tras finalizar ya tendriamos dispnible en nuestra impresora UBL.

## Activar/Configurar UBL

Pasos a seguir para realizar un nivelado UBL y guardado de malla desde una terminal: **Pronterface, OctoPrint**

1º Comprobar que no hay obstrucciones en la zona de test, que cualquier superficie de impresión (cristal, fleje …) se encuentre bien colocado y limpio.

2º Ajuste manual del nivelado de las esquinas con la opción desde el LCD o bien cualquier otro método de nivelado manual que consideremos oportuno.

3º Enviamos el gcode G28 para hacer home en todos los ejes

4º Calentamos la cama y el fusor a temperaturas de trabajo

5º Enviamos el gcode `G29 P1` para iniciar el proceso de mallado

6º Enviamos el gcode `G29 P3` para interporlar puntos no medidos

7º Enviamos nuevamente el gcode `G29 P3` para asegurar que se han alcanzado todos los puntos no alcanzables del mallado.

8º Enviamos el gcode `G29 T` para ver mallado:

```bash
Send: G29 T
Recv:
Recv: Bed Topography Report:
Recv:
Recv: ( 1,234) (234,234)
Recv: 0 1 2 3 4 5 6 7 8 9
Recv: 9 | +0.032 +0.032 +0.047 +0.086 +0.077 +0.095 +0.124 +0.118 +0.111 +0.114
Recv: |
Recv: 8 | +0.025 +0.025 +0.038 +0.053 +0.060 +0.089 +0.109 +0.117 +0.115 +0.113
Recv: |
Recv: 7 | +0.017 +0.017 +0.028 +0.021 +0.044 +0.082 +0.095 +0.107 +0.119 +0.131
Recv: |
Recv: 6 | +0.006 +0.006 +0.017 +0.009 +0.022 +0.057 +0.094 +0.081 +0.081 +0.081
Recv: |
Recv: 5 | +0.022 +0.022 +0.025 +0.025 +0.032 +0.041 +0.060 +0.081 +0.103 +0.124
Recv: |
Recv: 4 | -0.016 -0.016 -0.014 -0.022 -0.005 +0.027 +0.045 +0.063 +0.082 +0.100
Recv: |
Recv: 3 | -0.005 -0.007 -0.009 -0.022 -0.020 -0.014 +0.004 -0.004 -0.004 -0.004
Recv: |
Recv: 2 | +0.055 +0.030 +0.005 -0.015 -0.021 -0.006 -0.014 -0.018 -0.018 -0.018
Recv: |
Recv: 1 | +0.004 -0.006 -0.016 -0.026 -0.034 -0.014 -0.016 -0.012 -0.008 -0.005
Recv: |
Recv: 0 | +0.004 -0.006 -0.016 -0.026 -0.034 -0.014 -0.016 -0.006 +0.004 +0.013
Recv: 0 1 2 3 4 5 6 7 8 9
Recv: ( 1, 1) (234, 1)
```

9º Como vemos la desaviación en nuestro caso no ha sido mayor a 1-1.5decimas por lo que no voy a corregir cama, en caso de corregir algún punto volveriamos al primer punto. Procedemos a grabar el mallado en el primer slot de memoria con el gcode `G29 S1`

10º Activamos la opción de realizar el Fade de 10mm ya lo vimos en el punto 6 de la activación en Marlin. Para ello enviamos el gcode `G29 F10.0`

11º Activamos UBL ya debidamente configurado con el gcode `G29 A`

12º Guardamos ajustes en **EEPROM** con el gcode `M500` y pasamos a nuestro laminador habitual, añadimos en el gcode de inicio las siguienes ordenes tras G28, para que active el mallado y para realizar un test de 3 puntos:

```bash
G29 A
G29 L1
G29 J
```

> Y listo!
