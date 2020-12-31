---
title:  "OctoPrint Optimizar GCodes: Meperiun3D"
date:   2020-11-04 07:45:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
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

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)
{: .full}
En esta entrada, vamos a recordar que cuando usamos el software de laminado para un modelo de **impresión 3D**, generamos un archivo **GCode** y que este archivo es esencialmente: una lista secuencial de segmentos de línea conectados y organizados por capa.

Pero cuando las características del modelo original son más complejas o cuando el modelo representa más curvas pequeñas, se traduce en un aumento de segmentos para representar esta información, muchos detalles se traducen en muchos segmentos pequeños, y esto ocasiona una carga importante en el procesamiento de la información.

El resultado es que algunas impresoras simplemente ralentizan la impresión, lo que genera tiempos de impresión mucho más altos de lo que deberían ser.

[Arc Welder](https://github.com/FormerLurker/ArcWelderPlugin){:target="_blank"}, es una herramienta de compresión de **GCode** diseñada por [FormerLurker](https://github.com/FormerLurker){:target="_blank"} que examina los archivos de **GCode**, busca estos pequeños segmentos e intenta reemplazar grupos contiguos de ellos con un número menor de arcos.

El resultado es que el número de comandos de **GCode** necesarios para representar el modelo disminuye sustancialmente a medida que los grupos conectados de comandos de segmento se convierten en comandos de arco único.

![Arc Welder]({{ site.url }}{{ site.baseurl }}/assets/images/posts/arcwelder1.png)

Todo este programa funciona bajo el supuesto de que el controlador de movimiento integrado de su impresora 3D acepta comandos de arco, específicamente **M115, G2** y **G3**.

Hace unos años, esto hubiera sido poco común ya que, técnicamente, la **impresión 3D** y el archivo **STL** solo requieren moverse en segmentos de línea recta.

Vamos a analizar el [Barco Benchy (STL)](https://www.thingiverse.com/thing:763622){:target="_blank"}

![Benchy]({{ site.url }}{{ site.baseurl }}/assets/images/posts/arcwelder2.png)

El resultado es un archivo **GCode** que es un **56,2% más pequeño** (relación de compresión 2,3) con un **75,0% menos de comandos de extrusión / retracción**.

Se muestra una clara disminución masiva en los movimientos de extrusión pequeños entre 0.01 mm y 1 mm de longitud:

```bash
   Min          Max   Source  Target  Change
--------------------------------------------
  0.000mm to   0.002mm     0      0     0.0%
  0.002mm to   0.005mm     0      0     0.0%
  0.005mm to   0.010mm     0      0     0.0%
  0.010mm to   0.050mm     7      1   -85.7%
  0.050mm to   0.100mm    29      6   -79.3%
  0.100mm to   0.500mm  1342     74   -94.5%
  0.500mm to   1.000mm   810    114   -85.9%
  1.000mm to   5.000mm   145    341   135.2%
  5.000mm to  10.000mm     1     25  2400.0%
 10.000mm to  20.000mm     2     14   600.0%
 20.000mm to  50.000mm     8      8     0.0%
 50.000mm to 100.000mm     2      2     0.0%
          >= 100.000mm     2      2     0.0%
--------------------------------------------
       Total distance:............1929.879mm
   Total count source:..................2348
   Total count target:...................587
 Total percent change:................-75.0%
```

Debemos de revisar los siguientes apartados para  poder continuar  sin errores:

- `Configuration_adv.h` – Fichero de configuración avanzada Marlin
- `Dependencias OctoPrint` – Librerías de desarrollo Python 3

![Marlin]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Marlin.jpg)

### Marlin: Configuration_adv.h

Editamos el fichero `Configuration_adv.h` y comprobamos que la siguiente variable se encuentra activa (por defecto lo esta):

```bash
#define ARC_SUPPORT
```

En caso de no estar activada, tendríamos que volver a recompilar el firmware.

Otra forma de comprobar si el firmware lo soporta, es enviarle el GCode:

- **M115** (`Marlin de tu Impresora ≥ Marlin 2.0.6`)
- **G2** o bien **G3**(`Marlin de tu Impresora < Marlin 2.0.6`)

Si la respuesta recibida es **unknown command / comando desconocido** no se encontraría activa la opción.

### Prerequisitos OctoPrint

Antes de continuar con la instalación del complemento, tenemos que satisfacer las dependencias de desarrollo de [Python 3](https://www.python.org/download/releases/3.0/){:target="_blank"} para el plugin, que no se incluyen activas por defecto en **OctoPrint**.

Desde la terminal de GNU/Linux ejecutamos la siguiente orden:

```bash
sudo apt-get update && \ 
sudo apt-get -y install python3-dev
```

Y añadimos a nuestra colección de [plugins de OctoPrint](https://lordpedal.github.io/3d/plugins-octoprint-meperiun3d/){:target="_blank"} el siguiente:

![OctoPrint]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Octoprint.jpg)

### [Arc Welder](https://plugins.octoprint.org/plugins/arc_welder/){:target="_blank"}

Un complemento para OctoPrint que se usa para convertir comandos [G0 / G1](https://marlinfw.org/docs/gcode/G000-G001.html){:target="_blank"} (*movimientos lineales*) en comandos [G2 / G3](https://marlinfw.org/docs/gcode/G002-G003.html){:target="_blank"} (*movimientos circulares*).

A su vez reduce el tamaño de los archivos gcode y reduce la cantidad de gcodes por segundo enviados a su impresora, lo que significa una reducción de los tiempos de impresión.

Si queremos instalarlo de forma manual, su link sería:

```bash
https://github.com/FormerLurker/ArcWelderPlugin/archive/master.zip
```

Las principales características del plugin son:

- **Resolución personalizadle:** Controlar la desviación máxima permitida de la trayectoria de la herramienta original. Los valores más altos resultarán en más compresión pero más desviación. Los valores más bajos producirán un GCode más preciso pero menos compresión. El valor predeterminado de 0,05 mm (+ – 0,025 mm) produce excelentes resultados en la mayoría de los casos. Recomendaría un valor más bajo solo para casos extremos, como modelos de resolución extremadamente alta con boquillas pequeñas y alturas de capa muy bajas. No se recomiendan valores superiores a 0,05.
- **Procesamiento automático y / o manual:** Arc Welder se puede configurar para procesar automáticamente el archivo recién agregado o para permitir el procesamiento manual a través de una integración con el administrador de archivos OctoPrint.
- **Cambiar el nombre o sobrescribir el archivo de origen:** Elegir mantener el archivo de GCode original o reemplazarlo por completo con el nuevo archivo generado.
- **Eliminar el archivo de origen después del procesamiento:** Puedes crear un nuevo archivo y hacer que Arc Welder elimine el archivo original automáticamente en la mayoría de los casos.
- **Consulte Estadísticas de conversión detalladas:** Arc Welder crea y almacena estadísticas para cada archivo convertido, incluido el porcentaje y la relación de compresión, el tamaño del archivo de origen / destino y el recuento de líneas, así como una comparación detallada de los recuentos de extrusión / retracción en varias longitudes entre el origen y el archivo de destino.
- **Barra de progreso de conversión detallada:** Ver información de progreso en tiempo real a medida que Arc Welder procesa el archivo.
- **Configuración de registro avanzada:** Puedes controlar el registro desde la página de configuración del complemento si tiene problemas.
- **Restaurar los valores predeterminados del complemento:** Restaurar fácilmente la configuración predeterminada si surgen problemas.

> Y listo!
