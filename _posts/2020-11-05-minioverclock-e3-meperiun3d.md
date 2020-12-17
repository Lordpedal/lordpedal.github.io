---
title:  "miniOverclock E3: Meperiun3D"
date:   2020-11-05 06:00:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
header:
  image: /assets/images/miniE3MP.png
  caption: "Imagen: [**Lordpedal**](https://lordpedal.github.io)"
categories:
  - 3D
tags:
  - Personal
  - 3D
  - Marlin
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

En esta entrada, voy a recopilar los cambios que realizo sobre el firmware stock de `Marlin 2.0.x` para adaptarlo a mi impresora 3D, remarcando los cambios que se modifican.

Los cambios, a nivel de hardware más importantes sobre la base de origen de la **Ender 3** *v1* son:

- **SKR Mini E3 v2.0 (TMC2209 UART x4)**
- Termistor **ATC Semitec 104GT-2**
- Extrusor **clon Bontech BMG**
- Antclabs **BLTouch** v3.1

Los archivos a modificar son:

- `Platformio.ini` – Fichero de configuración de compilación con [VSCode](https://lordpedal.github.io/gnu/linux/3d/visual-studio-code-debian/){:target="_blank"}
- `_Bootscreen.h` – Fichero con logo de arranque
- `_Statusscreen.h` – Fichero con logo en status LCD
- `Configuration.h` – Fichero de configuración Marlin
- `Configuration_adv.h` – Fichero de configuración avanzada Marlin

### Platformio.ini

Cambio la variable de compilación con el ID de placa, en el mismo fichero se busca la referencia de nuestra placa:

```bash
default_envs = STM32F103RC_btt_512K
```

### _Bootscreen.h

En la ruta de la carpeta **Marlin**, encontraremos los ficheros `Configuration.h` y `Configuration_adv.h`, lo que vamos a hacer es crear el fichero `_Bootscreen.h`

Desde la terminal de GNU/Linux editamos el fichero:

```bash
nano _Bootscreen.h
```

Y añadimos:

```bash
/**
* Marlin 3D Printer Firmware
* Copyright (c) 2019 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
*
* Based on Sprinter and grbl.
* Copyright (c) 2011 Camiel Gubbels / Erik van der Zalm
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*
*/
#pragma once

/**
* Custom Boot Screen bitmap
*
* Place this file in the root with your configuration files
* and enable SHOW_CUSTOM_BOOTSCREEN in Configuration.h.
*
* Use the Marlin Bitmap Converter to make your own:
* http://marlinfw.org/tools/u8glib/converter.html
*/

#define CUSTOM_BOOTSCREEN_TIMEOUT 1000
#define CUSTOM_BOOTSCREEN_BMPWIDTH 81
#define CUSTOM_BOOTSCREEN_INVERTED

const unsigned char custom_start_bmp[] PROGMEM = {
B11111111,B11111111,B11111111,B11111111,B11101111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11101111,B11101111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11100111,B11011111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11100111,B11011111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11100011,B11011111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11110011,B11001111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11100001,B11100001,B11001111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111110,B01111000,B00000000,B00000000,B00000011,B11011101,B11111111,B11111111,B11111111,B11111111,
B11111110,B11111111,B10000000,B01111110,B00000000,B00000001,B11101110,B11111111,B11111111,B11111111,B11111111,
B11111110,B01111101,B11001111,B11111100,B00000000,B00000000,B11110111,B01111111,B11111111,B11111111,B11111111,
B11111111,B10001110,B00000110,B00000000,B00000000,B00000000,B01111011,B10111111,B11111111,B11111111,B11111111,
B11111111,B11000000,B00000000,B00000000,B00000000,B00000000,B01111101,B11011111,B11111111,B11111111,B11111111,
B11111111,B11111100,B00000001,B11111110,B00000000,B00000000,B00111110,B11100111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111100,B00000000,B00000011,B00011111,B01110011,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111000,B00000000,B00000001,B10001111,B10000001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11100000,B00000000,B00000000,B10000011,B11111001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B00000000,B11111100,B00000000,B00000000,B11110000,B11111111,B11111111,B11111111,
B11111111,B11111111,B11100000,B00001111,B11111111,B11000000,B00000000,B00000000,B11111111,B11111111,B11111111,
B11111111,B11111110,B00000011,B11111111,B11111111,B11000000,B00000000,B00000000,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111001,B00000000,B00000000,B00000000,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111100,B00000000,B00000111,B11000000,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B00000000,B00000111,B11100000,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11100000,B00000111,B11110001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111100,B00000111,B11111001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B00000011,B11111001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B10000011,B11111001,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11000011,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11100001,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11110000,B10111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111011,B11111000,B00111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111001,B11111000,B00111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B01111110,B11110000,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B10001110,B00000011,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11100000,B00011111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B11111111,B01111111,B11111111,B11111111,B11111111,
B11111111,B00000000,B00000000,B01111111,B11111111,B11111111,B11111000,B01111111,B11111111,B11111111,B11111111,
B11111111,B10000000,B00000000,B01111111,B11111111,B11111111,B11100000,B01111111,B11111111,B11111111,B11111111,
B11111111,B11000011,B11111100,B11111111,B11111111,B11111111,B11111000,B11111111,B11111111,B11111111,B11111111,
B11111111,B11000011,B11111100,B11111111,B11111111,B11111111,B11111000,B11111111,B11111111,B11111111,B11111111,
B11111111,B10000111,B11111101,B11111111,B11111111,B11111111,B11110001,B11111111,B11111111,B11111111,B11111111,
B11111111,B10000111,B11111111,B11111111,B11111111,B11111111,B11110001,B11111111,B11111111,B11111111,B11111111,
B11111111,B00001111,B11100111,B11110011,B00001111,B11111100,B00100011,B11111100,B00111111,B11111111,B11111111,
B11111111,B00001111,B11101111,B10000000,B00000111,B11110000,B00000011,B11110000,B00011110,B00000000,B01111111,
B11111110,B00011111,B11001111,B10000001,B10000111,B11000111,B10000111,B11000111,B00001100,B00000000,B01111111,
B11111110,B00000000,B00011111,B11000111,B11000111,B10001111,B11000111,B10011111,B00001111,B00001100,B11111111,
B11111110,B00000000,B00011111,B10000111,B10001111,B00011111,B10001111,B00011111,B00001111,B00011111,B11111111,
B11111100,B00111111,B10011111,B10001111,B10001111,B00011111,B10001110,B00000000,B00011110,B00111111,B11111111,
B11111100,B01111111,B00111111,B00001111,B00011110,B00111111,B00011110,B00111111,B11111110,B00111111,B11111111,
B11111000,B01111111,B11111111,B00011111,B00011100,B00111111,B00011100,B01111111,B11111100,B01111111,B11111111,
B11111000,B11111111,B11111111,B00011110,B00011100,B01111110,B00011100,B01111111,B11111100,B01111111,B11111111,
B11110000,B11111111,B11001110,B00111110,B00111100,B01111110,B00111100,B01111111,B10111000,B11111111,B11111111,
B11110000,B11111111,B10011110,B00111100,B00111000,B01111100,B00111000,B01111110,B01111000,B11111111,B11111111,
B11100001,B11111111,B00111100,B01111100,B01111000,B01111100,B01111000,B00111100,B11110001,B11111111,B11111111,
B11100001,B11111000,B00111000,B01111000,B01111000,B00010000,B00011000,B00000001,B11110001,B11111111,B11111111,
B00000000,B00000000,B01100000,B00100000,B00111100,B00000000,B01111100,B00000111,B10000000,B01111111,B11111111,
B11111111,B11111111,B11111111,B11111111,B11111110,B00011111,B11111110,B00011111,B11111111,B11111111,B11111111
};
```

Guardamos el fichero y salimos del editor.

### _Statusscreen.h

En la ruta de la carpeta **Marlin**, encontraremos los ficheros `Configuration.h` y `Configuration_adv.h`, lo que vamos a hacer es crear el fichero `_Statusscreen.h`

Desde la terminal de GNU/Linux editamos el fichero:

```bash
nano _Statusscreen.h
```

Y añadimos:

```bash
/**
* Marlin 3D Printer Firmware
* Copyright (c) 2019 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
*
* Based on Sprinter and grbl.
* Copyright (c) 2011 Camiel Gubbels / Erik van der Zalm
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*
*/
#pragma once

/**
* Custom Status Screen bitmap
*
* Place this file in the root with your configuration files
* and enable CUSTOM_STATUS_SCREEN_IMAGE in Configuration.h.
*
* Use the Marlin Bitmap Converter to make your own:
* http://marlinfw.org/tools/u8glib/converter.html
*/

//
// Status Screen Logo bitmap
//
#define STATUS_LOGO_Y 8
#define STATUS_LOGO_WIDTH 39

const unsigned char status_logo_bmp[] PROGMEM = {
B11111000,B00000001,B10000000,B00000000,B00001100,
B01001000,B00000000,B10000000,B00000000,B00010010,
B01000011,B11000011,B10001100,B11010000,B00000010,
B01110001,B00100100,B10010010,B01100111,B11001100,
B01000001,B00100100,B10011110,B01000000,B00000010,
B01001001,B00100100,B10010000,B01000000,B00010010,
B11111011,B10110011,B11001110,B11100000,B00001100
};

//
// Use default bitmaps
//
#define STATUS_HOTEND_ANIM
#define STATUS_BED_ANIM
#define STATUS_HEATERS_XSPACE 20
#if HOTENDS < 2
#define STATUS_HEATERS_X 48
#define STATUS_BED_X 72
#else
#define STATUS_HEATERS_X 40
#define STATUS_BED_X 80
#endif
```

Guardamos el fichero y salimos del editor.

### Configuration.h

Debemos de recordar que si una variable puede estar comentada (no se ejecuta) o descomentada (si se ejecuta).

**Comentada lleva delante de la variable `//` y descomentada no las lleva**.

Me gusta empezar editando la variable de autoría de los cambios en el firmware:

```bash
#define STRING_CONFIG_H_AUTHOR "(Lordpedal - Meperiun3D)"
```

Activo las pantallas de inicio de Marlin:

```bash
#define SHOW_BOOTSCREEN
#define SHOW_CUSTOM_BOOTSCREEN
#define CUSTOM_STATUS_SCREEN_IMAGE
```

Configuro los puertos serie y los baudios de comunicación para poder interactuar con la impresora:

```bash
#define SERIAL_PORT 2
#define SERIAL_PORT_2 -1
#define BAUDRATE 115200
```

Definimos la placa para que Marlin pueda operar sobre las señales de la placa y los perifericos de la misma:

```bash
#ifndef MOTHERBOARD
  #define MOTHERBOARD BOARD_BTT_SKR_MINI_E3_V2_0
#endif
```

Defino el nombre de la impresora para mostar en el LCD:

```bash
#define CUSTOM_MACHINE_NAME "miniOverclock"
```

Configuro los termistores de fusor y cama caliente:

```bash
#define TEMP_SENSOR_0 5
#define TEMP_SENSOR_BED 1
```

Limito la temperatura máxima a la que podra llegar la cama caliente de origen:

```bash
#define BED_MAXTEMP 125
```

Configuro el PID del fusor:

```bash
#define PIDTEMP
#define BANG_MAX 255
#define PID_MAX BANG_MAX
#define PID_K1 0.95

#if ENABLED(PIDTEMP)
  #define PID_EDIT_MENU
  #define PID_AUTOTUNE_MENU
  //#define PID_PARAMS_PER_HOTEND

// Creality Ender-3 Mod by Lordpedal
#define DEFAULT_Kp 22.07
#define DEFAULT_Ki 1.65
#define DEFAULT_Kd 73.87

#endif // PIDTEMP
```

Configuro el PID de la cama:

```bash
#define PIDTEMPBED

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

Ajusto la longitud máxima de extrusión para carga y descarga:

```bash
#define PREVENT_LENGTHY_EXTRUDE
#define EXTRUDE_MAXLENGTH 200
```

Comprobamos que tenemos activa la protección térmica:

```bash
#define THERMAL_PROTECTION_HOTENDS
#define THERMAL_PROTECTION_BED
#define THERMAL_PROTECTION_CHAMBER
```

Al llevar instalado un BLtouch tengo que invertir la lógica de actuación en los finales de carrera del eje Z:

```bash
#define X_MIN_ENDSTOP_INVERTING false
#define Y_MIN_ENDSTOP_INVERTING false
#define Z_MIN_ENDSTOP_INVERTING true
#define X_MAX_ENDSTOP_INVERTING false
#define Y_MAX_ENDSTOP_INVERTING false
#define Z_MAX_ENDSTOP_INVERTING false
#define Z_MIN_PROBE_ENDSTOP_INVERTING true
```

Defino los drivers que llevo instalados en la placa SKR:

```bash
#define X_DRIVER_TYPE TMC2209
#define Y_DRIVER_TYPE TMC2209
#define Z_DRIVER_TYPE TMC2209
//#define X2_DRIVER_TYPE A4988
//#define Y2_DRIVER_TYPE A4988
//#define Z2_DRIVER_TYPE A4988
//#define Z3_DRIVER_TYPE A4988
//#define Z4_DRIVER_TYPE A4988
#define E0_DRIVER_TYPE TMC2209
//#define E1_DRIVER_TYPE A4988
//#define E2_DRIVER_TYPE A4988
//#define E3_DRIVER_TYPE A4988
//#define E4_DRIVER_TYPE A4988
//#define E5_DRIVER_TYPE A4988
//#define E6_DRIVER_TYPE A4988
//#define E7_DRIVER_TYPE A4988
```

**Configuro los pasos** de los motores, de **stock** serían *80 (Eje X),80 (Eje Y),400 (Eje Z) ,93 (Extrusor MK8)* definidos a **16microSteps**, en mi caso los configuro a **32microSteps** (`valor Stock x 2`) y configuro *BMG como extrusor*:

```bash
#define DEFAULT_AXIS_STEPS_PER_UNIT { 160, 160, 800, 830 }
```

Configuro las velocidades máximas, recordemos que es una impresora cartesiana:

```bash
#define DEFAULT_MAX_FEEDRATE { 300, 300, 15, 50 }
```

Configuro las aceleración máxima:

```bash
#define DEFAULT_MAX_ACCELERATION { 1000, 1000, 100, 5000 }
```

Ajusto la aceleración en movimientos de ejes, retración y desplazamientos sin impresión:

```bash
#define DEFAULT_ACCELERATION 500
#define DEFAULT_RETRACT_ACCELERATION 3000
#define DEFAULT_TRAVEL_ACCELERATION 500
```

**Classic Jerk actualmente no lo activo**, pero lo dejo preconfigurado con los parametros que usaba previamente, por si volviese a activarlo y **activo Desviation Junction**:

```bash
//#define CLASSIC_JERK
#if ENABLED(CLASSIC_JERK)
  #define DEFAULT_XJERK 20.0
  #define DEFAULT_YJERK 15.0
  #define DEFAULT_ZJERK 0.4

  #define TRAVEL_EXTRA_XYJERK 5.0

  //#define LIMITED_JERK_EDITING
  #if ENABLED(LIMITED_JERK_EDITING)
    #define MAX_JERK_EDIT_VALUES { 20, 20, 0.6, 10 }
  #endif
#endif

#define DEFAULT_EJERK 15.0

#if DISABLED(CLASSIC_JERK)
  #define JUNCTION_DEVIATION_MM 0.08
  #define JD_HANDLE_SMALL_SEGMENTS
#endif
```

Activo el control de aceleración S-Curve:

```bash
#define S_CURVE_ACCELERATION
```

Activo BLtouch:

```bash
#define BLTOUCH
```

Ajusto los offset del BLtouch y ajustes del mismo:

```bash
#define NOZZLE_TO_PROBE_OFFSET { 38, 0, -2.15 }

#define PROBING_MARGIN 20
#define XY_PROBE_SPEED 6000
#define MULTIPLE_PROBING 2

#define Z_CLEARANCE_DEPLOY_PROBE 10
#define Z_CLEARANCE_BETWEEN_PROBES 5
#define Z_CLEARANCE_MULTI_PROBE 5
#define Z_AFTER_PROBING 5
#define Z_PROBE_LOW_POINT -5

#define Z_PROBE_OFFSET_RANGE_MIN -50
#define Z_PROBE_OFFSET_RANGE_MAX 50

#define Z_MIN_PROBE_REPEATABILITY_TEST
```

Ajusto los sentidos de giro de los motores, se invierten con `true` o `false`:

```bash
#define INVERT_X_DIR true
#define INVERT_Y_DIR true
#define INVERT_Z_DIR false
#define INVERT_E0_DIR true
```

Ajusto el tamaño de la cama de impresión y los limites de las posiciones de los finales de carrera:

```bash
#define X_BED_SIZE 235
#define Y_BED_SIZE 235

#define X_MIN_POS 0
#define Y_MIN_POS 0
#define Z_MIN_POS 0
#define X_MAX_POS X_BED_SIZE
#define Y_MAX_POS Y_BED_SIZE
#define Z_MAX_POS 250
```

Defino el tipo de nivelado y la configuración a usar con BLtouch, [UBL es mi elección (configuración detallada)](https://lordpedal.github.io/3d/ubl-marlin-firmware/){:target="_blank"}:

```bash
#define AUTO_BED_LEVELING_UBL
```

Activo el menú de nivelación desde el LCD:

```bash
#define LCD_BED_LEVELING

#if ENABLED(LCD_BED_LEVELING)
  #define MESH_EDIT_Z_STEP 0.025
  #define LCD_PROBE_Z_RANGE 4
  #define MESH_EDIT_MENU
#endif

#define LEVEL_BED_CORNERS

#if ENABLED(LEVEL_BED_CORNERS)
  #define LEVEL_CORNERS_INSET_LFRB { 30, 30, 30, 30 }
  #define LEVEL_CORNERS_HEIGHT 0.0
  #define LEVEL_CORNERS_Z_HOP 4.0
  #define LEVEL_CENTER_TOO
#endif
```

Ajusto las velocidades al realizar Home:

```bash
#define HOMING_FEEDRATE_XY (50*60)
#define HOMING_FEEDRATE_Z (4*60)

#define VALIDATE_HOMING_ENDSTOPS
```

Activo el soporte de EEPROM:

```bash
#define EEPROM_SETTINGS
//#define DISABLE_M503
#define EEPROM_CHITCHAT
#define EEPROM_BOOT_SILENT
#if ENABLED(EEPROM_SETTINGS)
  #define EEPROM_AUTO_INIT
#endif
```

Ajusto y creo nuevos perfiles de temperatura para materiales:

```bash
#define PREHEAT_1_LABEL "PLA"
#define PREHEAT_1_TEMP_HOTEND 210
#define PREHEAT_1_TEMP_BED 55
#define PREHEAT_1_FAN_SPEED 0

#define PREHEAT_2_LABEL "PETG"
#define PREHEAT_2_TEMP_HOTEND 240
#define PREHEAT_2_TEMP_BED 75
#define PREHEAT_2_FAN_SPEED 0

#define PREHEAT_3_LABEL "ABS"
#define PREHEAT_3_TEMP_HOTEND 240
#define PREHEAT_3_TEMP_BED 100
#define PREHEAT_3_FAN_SPEED 0

#define PREHEAT_4_LABEL "ASA"
#define PREHEAT_4_TEMP_HOTEND 250
#define PREHEAT_4_TEMP_BED 90
#define PREHEAT_4_FAN_SPEED 0

#define PREHEAT_5_LABEL "TPU"
#define PREHEAT_5_TEMP_HOTEND 230
#define PREHEAT_5_TEMP_BED 40
#define PREHEAT_5_FAN_SPEED 0
```

Activo la función Nozzle Park, sera necesaria posteriormente para otras funciones:

```bash
#define NOZZLE_PARK_FEATURE

#if ENABLED(NOZZLE_PARK_FEATURE)
  #define NOZZLE_PARK_POINT { (X_MIN_POS + 10), (Y_MAX_POS - 10), 20 }
  //#define NOZZLE_PARK_X_ONLY
  //#define NOZZLE_PARK_Y_ONLY
  #define NOZZLE_PARK_Z_RAISE_MIN 2
  #define NOZZLE_PARK_XY_FEEDRATE 100
  #define NOZZLE_PARK_Z_FEEDRATE 5
#endif
```

Activo el contador de impresión:

```bash
#define PRINTJOB_TIMER_AUTOSTART
```

Defino el idioma de LCD:

```bash
#define LCD_LANGUAGE es
```

Activo el soporte de la tarjeta SD:

```bash
#define SDSUPPORT
#define SD_CHECK_AND_RETRY
```

Defino el tipo de LCD:

```bash
#define CR10_STOCKDISPLAY
```

Activo el soporte controlador ventilador:

```bash
#define FAN_SOFT_PWM
```

### Configuration_adv.h

Debemos de recordar que si una variable puede estar comentada (no se ejecuta) o descomentada (si se ejecuta).

**Comentada lleva delante de la variable `//` y descomentada no las lleva**.

Ajusto la protección de cama caliente para evitar falsos positivos:

```bash
#if ENABLED(THERMAL_PROTECTION_BED)
  #define THERMAL_PROTECTION_BED_PERIOD 60
  #define THERMAL_PROTECTION_BED_HYSTERESIS 10
```

Configuro el mosfet del ventilador de electronica:

```bash
#define USE_CONTROLLER_FAN
#if ENABLED(USE_CONTROLLER_FAN)
  #define CONTROLLER_FAN_PIN PC7
  //#define CONTROLLER_FAN_USE_Z_ONLY
  //#define CONTROLLER_FAN_IGNORE_Z
  #define CONTROLLERFAN_SPEED_MIN 0
  #define CONTROLLERFAN_SPEED_ACTIVE 255
  #define CONTROLLERFAN_SPEED_IDLE 0
  #define CONTROLLERFAN_IDLE_TIME 60
  #define CONTROLLER_FAN_EDITABLE
  #if ENABLED(CONTROLLER_FAN_EDITABLE)
    #define CONTROLLER_FAN_MENU
  #endif
#endif
```

Ajusto la configuración de home:

```bash
#define HOMING_BUMP_MM { 5, 5, 2 }
#define HOMING_BUMP_DIVISOR { 2, 2, 4 }

//#define HOMING_BACKOFF_POST_MM { 2, 2, 2 }

#define QUICK_HOME
//#define HOME_Y_BEFORE_X
//#define CODEPENDENT_XY_HOMING
```

Ajusto la sensibilidad y alimentación del BLtouch:

```bash
#define BLTOUCH_DELAY 375
#define BLTOUCH_SET_5V_MODE
```

Activo la opción [G35 Tramming y la configuramos segun entrada](https://lordpedal.github.io/){:target="_blank"}:

```bash
#define ASSISTED_TRAMMING
```

Ajusto Slowdown para adaptar el buffer:

```bash
#define SLOWDOWN
#if ENABLED(SLOWDOWN)
  #define SLOWDOWN_DIVISOR 8
#endif
```

Compruebo que esta deshabilitado los pasos suavizados:

```bash
//#define ADAPTIVE_STEP_SMOOTHING
```

Habilito el menu de información:

```bash
#define LCD_INFO_MENU
```

Ajusto la información que se muestra en el LCD:

```bash
#define STATUS_MESSAGE_SCROLLING

#define LCD_SET_PROGRESS_MANUALLY

#if ENABLED(SHOW_BOOTSCREEN)
  #define BOOTSCREEN_TIMEOUT 4000
#endif

#if HAS_GRAPHICAL_LCD && EITHER(SDSUPPORT, LCD_SET_PROGRESS_MANUALLY)
  #define PRINT_PROGRESS_SHOW_DECIMALS
  #define SHOW_REMAINING_TIME
  #if ENABLED(SHOW_REMAINING_TIME)
    #define USE_M73_REMAINING_TIME
    #define ROTATE_PROGRESS_DISPLAY
  #endif
#endif

#if HAS_CHARACTER_LCD && EITHER(SDSUPPORT, LCD_SET_PROGRESS_MANUALLY)
  #define LCD_PROGRESS_BAR
  #if ENABLED(LCD_PROGRESS_BAR)
    #define PROGRESS_BAR_BAR_TIME 2000
    #define PROGRESS_BAR_MSG_TIME 3000
    #define PROGRESS_MSG_EXPIRE 0
    //#define PROGRESS_MSG_ONCE
    //#define LCD_PROGRESS_BAR_TEST
  #endif
#endif
```

En la sección de soporte SD configuro:

```bash
#define SDCARD_SORT_ALPHA
#define LONG_FILENAME_HOST_SUPPORT
#define SCROLL_LONG_FILENAMES
#define SD_ABORT_ON_ENDSTOP_HIT
#define SDCARD_CONNECTION LCD
#define DOGM_SD_PERCENT
```

Ajusto los gráficos del LCD:

```bash
//#define STATUS_COMBINE_HEATERS
//#define STATUS_HOTEND_NUMBERLESS
#define STATUS_HOTEND_INVERTED
#define STATUS_HOTEND_ANIM
#define STATUS_BED_ANIM
#define STATUS_CHAMBER_ANIM
#define STATUS_CUTTER_ANIM
#define STATUS_ALT_BED_BITMAP
#define STATUS_ALT_FAN_BITMAP
#define STATUS_FAN_FRAMES 3
#define STATUS_HEAT_PERCENT
//#define BOOT_MARLIN_LOGO_SMALL
//#define BOOT_MARLIN_LOGO_ANIMATED

#define MARLIN_BRICKOUT
#define MARLIN_INVADERS
#define MARLIN_SNAKE
#define GAMES_EASTER_EGG
```

Activo el Baby-Step para ajustar en vivo el eje Z:

```bash
#define BABYSTEPPING
#if ENABLED(BABYSTEPPING)
  //#define INTEGRATED_BABYSTEPPING
  //#define BABYSTEP_WITHOUT_HOMING
  //#define BABYSTEP_XY
  #define BABYSTEP_INVERT_Z false
  //#define BABYSTEP_MILLIMETER_UNITS
  #define BABYSTEP_MULTIPLICATOR_Z 4
  #define BABYSTEP_MULTIPLICATOR_XY 10

  #define DOUBLECLICK_FOR_Z_BABYSTEPPING
  #if ENABLED(DOUBLECLICK_FOR_Z_BABYSTEPPING)
    #define DOUBLECLICK_MAX_INTERVAL 1250
    //#define MOVE_Z_WHEN_IDLE
    #if ENABLED(MOVE_Z_WHEN_IDLE)
      #define MOVE_Z_IDLE_MULTIPLICATOR 1
    #endif
  #endif

  #define BABYSTEP_DISPLAY_TOTAL
  #define BABYSTEP_ZPROBE_OFFSET
  #if ENABLED(BABYSTEP_ZPROBE_OFFSET)
    //#define BABYSTEP_HOTEND_Z_OFFSET
    #define BABYSTEP_ZPROBE_GFX_OVERLAY
  #endif
#endif
```

Activo la función Linear Advance, ajustado a cero para luego definirlo según material:

```bash
#define LIN_ADVANCE
#if ENABLED(LIN_ADVANCE)
  //#define EXTRA_LIN_ADVANCE_K
  #define LIN_ADVANCE_K 0
  //#define LA_DEBUG
  #define EXPERIMENTAL_SCURVE
#endif
```

Ajusto el buffer de memoria:

```bash
#if BOTH(SDSUPPORT, DIRECT_STEPPING)
  #define BLOCK_BUFFER_SIZE 8
#elif ENABLED(SDSUPPORT)
  #define BLOCK_BUFFER_SIZE 32
#else
  #define BLOCK_BUFFER_SIZE 32
#endif
```

Activo y ajusto el cambio de filamento **M600**:

```bash
#define ADVANCED_PAUSE_FEATURE
#if ENABLED(ADVANCED_PAUSE_FEATURE)
  #define PAUSE_PARK_RETRACT_FEEDRATE 60
  #define PAUSE_PARK_RETRACT_LENGTH 2
  #define FILAMENT_CHANGE_UNLOAD_FEEDRATE 10
  #define FILAMENT_CHANGE_UNLOAD_ACCEL 25
  #define FILAMENT_CHANGE_UNLOAD_LENGTH 200
  #define FILAMENT_CHANGE_SLOW_LOAD_FEEDRATE 6
  #define FILAMENT_CHANGE_SLOW_LOAD_LENGTH 0
  #define FILAMENT_CHANGE_FAST_LOAD_FEEDRATE 15
  #define FILAMENT_CHANGE_FAST_LOAD_ACCEL 25
  #define FILAMENT_CHANGE_FAST_LOAD_LENGTH 0
  //#define ADVANCED_PAUSE_CONTINUOUS_PURGE
  #define ADVANCED_PAUSE_PURGE_FEEDRATE 3
  #define ADVANCED_PAUSE_PURGE_LENGTH 50
  #define ADVANCED_PAUSE_RESUME_PRIME 0
  //#define ADVANCED_PAUSE_FANS_PAUSE

  #define FILAMENT_UNLOAD_PURGE_RETRACT 13
  #define FILAMENT_UNLOAD_PURGE_DELAY 5000
  #define FILAMENT_UNLOAD_PURGE_LENGTH 8
  #define FILAMENT_UNLOAD_PURGE_FEEDRATE 25

  #define PAUSE_PARK_NOZZLE_TIMEOUT 45
  #define FILAMENT_CHANGE_ALERT_BEEPS 10
  #define PAUSE_PARK_NO_STEPPER_TIMEOUT

  #define PARK_HEAD_ON_PAUSE
  #define HOME_BEFORE_FILAMENT_CHANGE

  #define FILAMENT_LOAD_UNLOAD_GCODES
  //#define FILAMENT_UNLOAD_ALL_EXTRUDERS
#endif
```

Ajusto el consumo de los motores y los **miroSteps (32)** en cada eje para los **drivers TMC2209 en UART**:

```bash
#if AXIS_IS_TMC(X)
  #define X_CURRENT 580
  #define X_CURRENT_HOME X_CURRENT
  #define X_MICROSTEPS 32
  #define X_RSENSE 0.11
  #define X_CHAIN_POS -1
#endif

#if AXIS_IS_TMC(Y)
  #define Y_CURRENT 580
  #define Y_CURRENT_HOME Y_CURRENT
  #define Y_MICROSTEPS 32
  #define Y_RSENSE 0.11
  #define Y_CHAIN_POS -1
#endif

#if AXIS_IS_TMC(Z)
  #define Z_CURRENT 580
  #define Z_CURRENT_HOME Z_CURRENT
  #define Z_MICROSTEPS 32
  #define Z_RSENSE 0.11
  #define Z_CHAIN_POS -1
#endif

#if AXIS_IS_TMC(E0)
  #define E0_CURRENT 620
  #define E0_MICROSTEPS 32
  #define E0_RSENSE 0.11
  #define E0_CHAIN_POS -1
#endif
```

Defino el bus de comunicación serie para cada eje:

```bash
#define X_SLAVE_ADDRESS 0
#define Y_SLAVE_ADDRESS 2
#define Z_SLAVE_ADDRESS 1
#define E0_SLAVE_ADDRESS 3
```

Activo configuración especifica para los TMC:

```bash
#define STEALTHCHOP_XY
#define STEALTHCHOP_Z
#define STEALTHCHOP_E

#define CHOPPER_TIMING CHOPPER_DEFAULT_24V

#define MONITOR_DRIVER_STATUS

#define SQUARE_WAVE_STEPPING

#define TMC_DEBUG
```

Activo los limites offset del trabajo y la información detallada:

```bash
#define NO_WORKSPACE_OFFSETS
#define M114_DETAIL
```

Activo el menú personalizado con scripts:

```bash
#define CUSTOM_USER_MENUS
#if ENABLED(CUSTOM_USER_MENUS)
  //#define CUSTOM_USER_MENU_TITLE "Custom Commands"
  #define USER_SCRIPT_DONE "M117 Script by Lordpedal"
  #define USER_SCRIPT_AUDIBLE_FEEDBACK
  //#define USER_SCRIPT_RETURN

  #define USER_DESC_1 "Cambiar color"
  #define USER_GCODE_1 "M600"

  #define USER_DESC_2 "Paro emergencia"
  #define USER_GCODE_2 "M112"

  #define USER_DESC_3 "Inicio & Info"
  #define USER_GCODE_3 "G28\nM503"

  #define USER_DESC_4 "Inicio & UBL Info"
  #define USER_GCODE_4 "G28\nG29 W"

  #define USER_DESC_5 "Precalentar " PREHEAT_1_LABEL
  #define USER_GCODE_5 "M140 S" STRINGIFY(PREHEAT_1_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_1_TEMP_HOTEND)

  #define USER_DESC_6 "Precalentar " PREHEAT_2_LABEL
  #define USER_GCODE_6 "M140 S" STRINGIFY(PREHEAT_2_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_2_TEMP_HOTEND)

  #define USER_DESC_7 "Precalentar " PREHEAT_3_LABEL
  #define USER_GCODE_7 "M140 S" STRINGIFY(PREHEAT_3_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_3_TEMP_HOTEND)

  #define USER_DESC_8 "Precalentar " PREHEAT_4_LABEL
  #define USER_GCODE_8 "M140 S" STRINGIFY(PREHEAT_4_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_4_TEMP_HOTEND)

  #define USER_DESC_9 "Precalentar " PREHEAT_5_LABEL
  #define USER_GCODE_9 "M140 S" STRINGIFY(PREHEAT_5_TEMP_BED) "\nM104 S" STRINGIFY(PREHEAT_5_TEMP_HOTEND)

#endif
```

### GCcodes Laminador

## Inicio:

```bash
M220 S100 ;Reset Alimentacion
M221 S100 ;Reset Caudal
G28 ;Home
G29 A ; Activa UBL
G29 L1 ; Lee UBL
G29 J ; Comprueba UBL
M117 Purgando Extrusor
G92 E0 ;Reset Extrusor
G1 Z2.0 F3000 ;Mueve eje Z Arriba
G1 X10.1 Y20 Z0.28 F5000.0 ;Mueve posicion inicio
G1 X10.1 Y200.0 Z0.28 F1500.0 E15 ;Dibuja la primea linea
G1 X10.4 Y200.0 Z0.28 F5000.0 ;Desplaza eje Xove to side a little
G1 X10.4 Y20 Z0.28 F1500.0 E30 ;Dibuja la segunda linea
G92 E0 ;Reset Extrusor
G1 Z2.0 F3000 ;Mueve eje Z Arriba
M117 lordpedal.github.io
```

## Final:

```bash
G91 ;Posicionamiento relativo
G1 E-2 F2700 ;Retrae un poco
G1 E-2 Z0.2 F2400 ;Retrae y aumento en Z
G1 X5 Y5 F3000 ;Limpia
G1 Z10 ;Aumento Z
G90 ;Posicionamiento absoluto
G1 X0 Y{machine_depth} ;Presenta impresion
M106 S0 ;Apaga ventilador
M104 S0 ;Apaga hotend
M140 S0 ;Apaga bed
M84 X Y E ;Desactiva motores menos Z
M117 Another fine release by Lordpedal!
```

Y hasta aquí la configuración.

> Y listo!
