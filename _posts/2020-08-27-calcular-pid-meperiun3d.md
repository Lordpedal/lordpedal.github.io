---
title:  "Calcular PID: Meperiun3D"
date:   2020-08-27 19:00:00 -0300
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
---

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)
{: .full}
El objetivo de los ajustes de los parámetros [PID](https://es.wikipedia.org/wiki/Controlador_PID){:target="_blank"} es lograr que el de control de temperatura corrija eficazmente y en el mínimo tiempo los efectos de las perturbaciones.

Los valores que se obtienen al calibrar el PID son tres variables para obtener un algoritmo óptimo `Kp`, `Ki` y `Kd`:

- `Kp`: Se corresponde a la parte **proporcional** y dice cuanta caña hay que darle para corregir el error. Si el valor es muy alto llegas rápido a la temperatura objetivo, pero te vas a pasar en la «frenada»
- `Ki`: Es la parte **integral**, y la idea es reducir la oscilación, cuando llegue a la temperatura objetivo.
- `Kd`: Es la parte **derivativa**, y se ajusta para que no te pases del valor objetivo y quemes el plástico.

Para poder ajustar estos parametros debemos de tener debidamente configuradas las siguientes secciones en el [firmware de Marlin](https://marlinfw.org/){:target="_blank"} dentro del fichero `configuration.h`:

- **Additional Features: Eeprom** (Gestión memoria)
- **Thermal Settings** (Tipo de [termistor](https://es.wikipedia.org/wiki/Termistor){:target="_blank"} usado en Fusor & Cama)
- **PID Settings** (Habilitar PID en Fusor)
- **PID > Bed Temperature Control** (Habilitar PID en cama)

Sino definimos el control por **PID en Fusor & Cama**, el firmware asume el funcionamiento de control por `bang-bang` (menos eficiente y preciso).

Vamos a revisar los parametros y como se deberian de configurar, tomando como base la configuración de mi impresora **Ender 3**.

![Marlin]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Marlin.jpg)

## Firmware Marlin

### Additional Features: Eeprom

Para poder interactuar con la memoria de la impresora 3D, debemos de tener activa esta configuración

```bash
#define EEPROM_SETTINGS // Habilitamos Eeprom
//#define DISABLE_M503 
#define EEPROM_CHITCHAT // Texto terminal
#define EEPROM_BOOT_SILENT
#if ENABLED(EEPROM_SETTINGS)
 #define EEPROM_AUTO_INIT // Resetea Eeprom si falla
#endif // EEPROM_SETTINGS
```

| Comando G-code | Acción |
| ------ | ------ |
| [M500](https://marlinfw.org/docs/gcode/M500.html){:target="_blank"} | Guarda configuración Eeprom |
| [M501](https://marlinfw.org/docs/gcode/M501.html){:target="_blank"} | Lee configuración Eeprom |
| [M502](https://marlinfw.org/docs/gcode/M502.html){:target="_blank"} | Resetea a valores fábrica `(definidos Marlin)` |

### Thermal Settings

Como veras tengo configurado el parametro **TEMP_SENSOR_0** y **TEMP_SENSOR_BED**, los parametros cuya parametro es 0 no estan habilitados, en caso de disponer de ellos tendriamos que configurarlo.

```bash
#define TEMP_SENSOR_0 5
#define TEMP_SENSOR_1 0
#define TEMP_SENSOR_2 0
#define TEMP_SENSOR_3 0
#define TEMP_SENSOR_4 0
#define TEMP_SENSOR_5 0
#define TEMP_SENSOR_6 0
#define TEMP_SENSOR_7 0
#define TEMP_SENSOR_BED 1
#define TEMP_SENSOR_PROBE 0
#define TEMP_SENSOR_CHAMBER 0
```

- En **TEMP_SENSOR_0 5** tengo definido el tipo de termistor nº 5 para el Fusor, el termistor de origen era el nº1 pero fue sustituido al cambiar el tipo de fusor, en ambos casos equivale a una **resistencia de 100k ohm**.
- En **TEMP_SENSOR_BED 1** tengo definido el tipo de termisor nº1, termistor de origen para la cama.

El listado de posibles termistores es amplio, algunos requieren configuraciones específicas como por ejemplo las **PT-100**:

```bash
* -5 : PT100 / PT1000 with MAX31865 (only for sensors 0-1)
* -3 : thermocouple with MAX31855 (only for sensors 0-1)
* -2 : thermocouple with MAX6675 (only for sensors 0-1)
* -4 : thermocouple with AD8495
* -1 : thermocouple with AD595
* 0 : not used
* 1 : 100k thermistor - best choice for EPCOS 100k (4.7k pullup)
* 331 : (3.3V scaled thermistor 1 table for MEGA)
* 332 : (3.3V scaled thermistor 1 table for DUE)
* 2 : 200k thermistor - ATC Semitec 204GT-2 (4.7k pullup)
* 202 : 200k thermistor - Copymaster 3D
* 3 : Mendel-parts thermistor (4.7k pullup)
* 4 : 10k thermistor !! do not use it for a hotend. It gives bad resolution at high temp. !!
* 5 : 100K thermistor - ATC Semitec 104GT-2/104NT-4-R025H42G (Used in ParCan, J-Head, and E3D) (4.7k pullup)
* 501 : 100K Zonestar (Tronxy X3A) Thermistor
* 502 : 100K Zonestar Thermistor used by hot bed in Zonestar Prusa P802M
* 512 : 100k RPW-Ultra hotend thermistor (4.7k pullup)
* 6 : 100k EPCOS - Not as accurate as table 1 (created using a fluke thermocouple) (4.7k pullup)
* 7 : 100k Honeywell thermistor 135-104LAG-J01 (4.7k pullup)
* 71 : 100k Honeywell thermistor 135-104LAF-J01 (4.7k pullup)
* 8 : 100k 0603 SMD Vishay NTCS0603E3104FXT (4.7k pullup)
* 9 : 100k GE Sensing AL03006-58.2K-97-G1 (4.7k pullup)
* 10 : 100k RS thermistor 198-961 (4.7k pullup)
* 11 : 100k beta 3950 1% thermistor (Used in Keenovo AC silicone mats and most Wanhao i3 machines) (4.7k pullup)
* 12 : 100k 0603 SMD Vishay NTCS0603E3104FXT (4.7k pullup) (calibrated for Makibox hot bed)
* 13 : 100k Hisens 3950 1% up to 300°C for hotend "Simple ONE " & "Hotend "All In ONE"
* 15 : 100k thermistor calibration for JGAurora A5 hotend
* 18 : ATC Semitec 204GT-2 (4.7k pullup) Dagoma.Fr - MKS_Base_DKU001327
* 20 : Pt100 with circuit in the Ultimainboard V2.x with 5v excitation (AVR)
* 21 : Pt100 with circuit in the Ultimainboard V2.x with 3.3v excitation (STM32 \ LPC176x....)
* 22 : 100k (hotend) with 4.7k pullup to 3.3V and 220R to analog input (as in GTM32 Pro vB)
* 23 : 100k (bed) with 4.7k pullup to 3.3v and 220R to analog input (as in GTM32 Pro vB)
* 201 : Pt100 with circuit in Overlord, similar to Ultimainboard V2.x
* 60 : 100k Maker's Tool Works Kapton Bed Thermistor beta=3950
* 61 : 100k Formbot / Vivedino 3950 350C thermistor 4.7k pullup
* 66 : 4.7M High Temperature thermistor from Dyze Design
* 67 : 450C thermistor from SliceEngineering
* 70 : the 100K thermistor found in the bq Hephestos 2
* 75 : 100k Generic Silicon Heat Pad with NTC 100K MGB18-104F39050L32 thermistor
* 99 : 100k thermistor with a 10K pull-up resistor (found on some Wanhao i3 machines)
*
* 1k ohm pullup tables - This is atypical, and requires changing out the 4.7k pullup for 1k.
* (but gives greater accuracy and more stable PID)
* 51 : 100k thermistor - EPCOS (1k pullup)
* 52 : 200k thermistor - ATC Semitec 204GT-2 (1k pullup)
* 55 : 100k thermistor - ATC Semitec 104GT-2 (Used in ParCan & J-Head) (1k pullup)
*
* 1047 : Pt1000 with 4k7 pullup (E3D)
* 1010 : Pt1000 with 1k pullup (non standard)
* 147 : Pt100 with 4k7 pullup
* 110 : Pt100 with 1k pullup (non standard)
*
* 1000 : Custom - Specify parameters in Configuration_adv.h
*
* Use these for Testing or Development purposes. NEVER for production machine.
* 998 : Dummy Table that ALWAYS reads 25°C or the temperature defined below.
* 999 : Dummy Table that ALWAYS reads 100°C or the temperature defined below.
```

### PID Settings

Activamos la configuración `#define PIDTEMP` para poder usar el control de temperatura por **PID** en vez de **bang-bang**:

```bash
#define PIDTEMP // Activa control PID
#define BANG_MAX 255
#define PID_MAX BANG_MAX
#define PID_K1 0.95

#if ENABLED(PIDTEMP)
 #define PID_EDIT_MENU // Permite ajuste desde LCD
 #define PID_AUTOTUNE_MENU // Ejecutar desde LCD
 //#define PID_PARAMS_PER_HOTEND // Activar si >1 fusor

 // Creality Ender-3 Mod by Lordpedal
 #define DEFAULT_Kp 22.07
 #define DEFAULT_Ki 1.65
 #define DEFAULT_Kd 73.87

#endif // PIDTEMP
```

### PID > Bed Temperature Control

Activamos la configuración `#define PIDTEMPBED` para poder usar el control de temperatura por **PID** en vez de **bang-bang**:

```bash
#define PIDTEMPBED // Activa control PID
//#define BED_LIMIT_SWITCHING
#define MAX_BED_POWER 255

#if ENABLED(PIDTEMPBED)
 //#define MIN_BED_POWER 0
 //#define PID_BED_DEBUG

 // Creality Ender-3 Mod by Lordpedal
 #define DEFAULT_bedKp 70.61
 #define DEFAULT_bedKi 13.35
 #define DEFAULT_bedKd 249.04

#endif // PIDTEMPBED
```

Tras haber configurado estas opciones mencionadas en **Marlin**, tendriamos que volver a **flashear el firmware** en la impresora para poder usarlas y ya podriamos ajustar el control por PID.

**Recuerda que tras flashear un firmware siempre debes de hacer un reset a la Eeprom** con los G-codes: **M502** y **M500** (ejecutar en ese orden)

![OctoPrint]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Octoprint.jpg)

## OctoPrint

### Calcular PID del Hotend (Fusor)

Vamos a calcularlo desde una Terminal de comandos como pueda ser por ejemplo: [OctoPrint](https://lordpedal.github.io/docker/3d/octoprint-docker/){:target="_blank"}, Pronterface, para ello la impresora debe de estar conectada por USB para el envio de [Gcodes](https://es.wikipedia.org/wiki/G-code){:target="_blank"}.

- El G-code encargado de ejecutar esta tarea es [M303](https://marlinfw.org/docs/gcode/M303.html){:target="_blank"}, vamos a calibrarlo para una impresora que normalmente imprime material [PLA](https://es.wikipedia.org/wiki/%C3%81cido_polil%C3%A1ctico){:target="_blank"}, en la terminal lanzamos:

```bash
M303 E0 S210 C8
```

> El comando le esta pidiendo a la impresora que el fusor 0, lo caliente y enfríe a una temperatura de 210º durante 8 veces, para poder calcular un PID medio que nos mostrara en la terminal al finalizar:

```bash
Clasic PID
Kp: 19.56
Ki: 1.71
Kd: 80.26
PID Autotune finished !
```

- Los valores obtenidos debemos de configurarlos y asignarlos para que sean efectivos. El G-code encargado de ejecutar esta tarea es [M301](https://marlinfw.org/docs/gcode/M301.html){:target="_blank"}, con el ejemplo anterior definimos:

```bash
M301 P19.56 I1.71 D80.26
```

- Tras finalizar debemos de memorizar los cambios en Eeprom:

```bash
M500
```
### Calcular PID de Cama

Vamos a calcularlo nuevamente desde una Terminal de comandos como pueda ser por ejemplo: [OctoPrint](https://lordpedal.github.io/docker/3d/octoprint-docker/){:target="_blank"}, Pronterface, para ello la impresora debe de estar conectada por USB para el envio de [Gcodes](https://es.wikipedia.org/wiki/G-code){:target="_blank"}.

- El G-code encargado de ejecutar esta tarea es [M303](https://marlinfw.org/docs/gcode/M303.html){:target="_blank"}, vamos a calibrarlo para una impresora que normalmente imprime material [PLA](https://es.wikipedia.org/wiki/%C3%81cido_polil%C3%A1ctico){:target="_blank"}, en la terminal lanzamos:

```bash
M303 E-1 S60 C8
```

> El comando le esta pidiendo a la impresora que la cama, la caliente y enfríe a una temperatura de 60º durante 8 veces, para poder calcular un PID medio que nos mostrara en la terminal al finalizar:

```bash
Clasic PID
Kp: 72.63
Ki: 14.19
Kd: 247.56
PID Autotune finished !
```

- Los valores obtenidos debemos de configurarlos y asignarlos para que sean efectivos. El G-code encargado de ejecutar esta tarea es [M304](https://marlinfw.org/docs/gcode/M304.html){:target="_blank"}, con el ejemplo anterior definimos:

```bash
M304 P72.63 I14.19 D247.56
```

- Tras finalizar debemos de memorizar los cambios en Eeprom:

```bash
M500
```

Con esto, ya habriamos activado, configurado y regulado el PID de nuestra **impresora 3D**

> Y listo!
