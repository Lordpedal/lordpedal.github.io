---
title:  "Plugins OctoPrint: Meperiun3D"
date:   2020-08-30 20:45:00 -0300
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
Una de la grandes mejoras que OctoPrint nos puede aportar a nuestro proyecto de servidor de impresión 3D, es la escalabilidad.

Esta escalabilidad se consigue en su mayor parte gracias a los [plugins de la comunidad de desarrollo](https://plugins.octoprint.org/){:target="_blank"} y a la modularidad de su sistema.

Los plugins son aplicaciones que se pueden instalar para proporcionar funcionalidad adicional dentro del software de gestión de impresión 3D, por ejemplo, puede obtener la capacidad de grabar secuencias de tiempo, transmitir a través de una cámara web, notificaciones remotas o configurar si esto es así, automatizaciones.

Su instalación es bastante sencilla, resumida en estos pasos:

- Hacer clic en Menú de configuración (*pequeño icono de llave inglesa en la barra superior*)
- Accedemos a la interfaz del `Administrador de complementos (Plugin Manager)`
- Hacemos clic en la pantalla, `Obtener más`
- Elegimos el `plugins de repositorio` o bien le proporcionamos un `link de instalación`

![OctoPrint]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Octoprint.jpg)

Tras esta breve intro, os voy a dejar lo que a mi entender son todo un **«must I have»** en la experiencia 3D.

## [Simple Emergency Stop](https://plugins.octoprint.org/plugins/simpleemergencystop/){:target="_blank"}

Arrancamos con el que sería el principal, pero con suerte jamás tendrías que usar, como su nombre indica este plugin añade un botón en la barra de navegación para ejecutar una parada de emergencia si se produce alguna anomália ejecutando el Gcode [M112](https://marlinfw.org/docs/gcode/M112.html){:target="_blank"}.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/Sebclem/OctoPrint-SimpleEmergencyStop/archive/master.zip
```

## [Navbar Temp](https://plugins.octoprint.org/plugins/navbartemp/){:target="_blank"}

Este sencillo plugin, nos mostrara la información de la temperatura tanto del **SoC** (Raspberry Pi en nuestro caso) sobre el que se ejecuta OctoPrint, como del **Fusor** y la **Cama** sobre la barra de navegación.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/imrahil/OctoPrint-NavbarTemp/archive/master.zip
```

## [Bed Level Visualizer](https://plugins.octoprint.org/plugins/bedlevelvisualizer/){:target="_blank"}

El complemento perfecto para complementar [UBL](https://lordpedal.github.io/3d/ubl-marlin-firmware/){:target="_blank"}, nos va a permitir visualizar en 3D el mallado de nivelado obtenido en la terminal, para obtenerlo ejecuta el Gcode [G29 T](https://marlinfw.org/docs/gcode/G029-ubl.html){:target="_blank"}

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/jneilliii/OctoPrint-BedLevelVisualizer/archive/master.zip
```

## [GcodeEditor](https://plugins.octoprint.org/plugins/GcodeEditor/){:target="_blank"}

Con este plugin se nos permite `modificar el Gcode` de la pieza/objeto laminado, mediante un sencillo **editor de textos online**.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/ieatacid/OctoPrint-GcodeEditor/archive/master.zip
```

## [OctoPrint-Telegram](https://plugins.octoprint.org/plugins/telegram/){:target="_blank"}

Un obligado para notificar estados de impresión vía Telegram, si lo potenciamos con una camara, obtendremos adicionalmente imagenes del proceso de impresión.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/fabianonline/OctoPrint-Telegram/archive/master.zip
```

Este plugin es un **bot de Telegram** que se tiene configurar de **forma resumida**:

1. Entablamos conversación con [@botfather](http://telegram.me/botfather){:target="_blank"}
2. Iniciaremos el proceso de creación de obtención de un Token para generar nuestro con la orden `/newbot`
3. Nos solicitara un nombre para el bot, por ejemplo: `Mi Impresora 3D`
4. Ahora nos pide un usuario para identificar el bot (debe de terminar con la palabra bot), por ejemplo: `Impresora3dbot`
5. En ese momento se nos devolvera un código alfanúmerico (`Token`), dicho código debemos de guardarlo para posterior
6. **Opcionalmente** podríamos asignarle un logo a nuestro bot con la orden `/setuserpic` y comandos de ayuda que nos recordara con la orden `/setcommands`
7. Podemos `cerrar y detener @botfather`
8. Volvemos a OctoPrint e instalamos el plugin `OctoPrint-Telegram`
9. En las opciones del plugin introducimos el `Token` que habiamos obtenido anteriomente en la casilla: `Telegram Token`
10. Pulsamos sobre el botón `Test this token` y después en Savey reservamos sin cerrar la ventana
11. Volvemos a nuestra cuenta de Telegram e iniciamos conversación con bot que creamos, según el ejemplo **@Impresora3dbot** y nos devolvera un `"Now I know you"`
12. Nuevamente sobre la ventana de configuración del plugin OctoPrint hacemos click en el boton `reload` y aparecera nuestro usuario de Telegram como cliente del bot
13. Guardamos haciendo click en `Save` para guardar el usuario
14. Sobre el usuario habilitamos `permisos de ejecución de comandos/notificaciones` haciendo click en los iconos
15. Volvemos a **guardar y listo**.

La configuración [más extendida y detallada la puedes revisar en el Github del proyecto](https://github.com/fabianonline/OctoPrint-Telegram/blob/stable/README.md){:target="_blank"}.

## [M73 Progress](https://plugins.octoprint.org/plugins/m73progress/){:target="_blank"}

Permite ver el avance de impresión en el **LCD** como si se estuviese imprimiendo desde la **SD/microSD**.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/cesarvandevelde/OctoPrint-M73Progress/archive/master.zip
```

### Configuración Marlin

![Marlin]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Marlin.jpg)

Pero para ello debemos de realizar un trabajo sobre nuestro Marlin para habilitar esta opción, tenemos que activar sobre el fichero `Configuration_adv.h` las siguientes opciones:

```bash
// Add an 'M73' G-code to set the current percentage
#define LCD_SET_PROGRESS_MANUALLY

// Show the E position (filament used) during printing
//#define LCD_SHOW_E_TOTAL

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

> Y listo!
