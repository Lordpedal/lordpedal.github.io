---
title:  "**Patrones de relleno**: Meperiun3D"
date:   2020-09-02 11:45:00 -0300
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
  teaser: /assets/images/Meperiun3D.png
---

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/Meperiun3D.png)
{: .full}
En esta entrada, vamos a realizar un repaso a los principales patrones de relleno que usaremos en la impresión 3D.

Vamos a tomar como referente [Ultimaker Cura](https://ultimaker.com/es/software/ultimaker-cura){:target="_blank"}, que es un software de laminado que nos permite cambiar el patrón de la estructura de relleno impresa según casos de uso.

- Se utilizan **rellenos 2D** fuertes para impresiones cotidianas
- **Los rellenos rápidos en 2D** se usan para modelos rápidos pero débiles
- **Los rellenos 3D** se utilizan para hacer que el objeto sea igualmente fuerte en todas las direcciones.
- **Los rellenos concéntricos 3D** se utilizan para materiales flexibles.

Las siguientes opciones de patrón están disponibles en el software:

- `Rejilla`: Relleno 2D fuerte
- `Líneas`: Relleno 2D rápido
- `Triángulos`: Relleno 2D fuerte
- `Tri-hexágono`: Relleno 2D fuerte
- `Cúbico`: Relleno 3D fuerte
- `Cúbico Subdividido`: Relleno 3D fuerte
- `Octeto`: Relleno 3D fuerte
- `Cúbico por cuartos`: Relleno 3D fuerte
- `Concéntrico`: Relleno 3D flexible
- `Zig-Zag`: Relleno en forma de cuadrícula, que imprime continuamente en una dirección diagonal
- `Cruz`: Relleno 3D flexible
- `Cruz 3D`: Relleno 3D flexible
- `Giroide`: Relleno con mayor fuerza para el peso más bajo.

![Rellenos]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Patrones3D.png)

## Rejilla

Este tipo de patrón de relleno se realiza principalmente con dos líneas perpendiculares, que juntas forman un cuadrado.

### Ventajas

- En el caso de la dirección vertical, este patrón de relleno dará la mayor resistencia.
- Este tipo de patrón brindará un apoyo justo a la superficie superior del modelo, como resultado, la superficie superior se verá suave.

### Desventajas

- No da suficiente fuerza en la dirección horizontal.
- Del mismo modo, este patrón de relleno tampoco le da fuerza al modelo, especialmente en la dirección diagonal.

## Líneas

En este patrón, cada línea es paralela entre sí, lo que en realidad se ve similar al patrón de rejilla.

### Ventajas

- Mayor velocidad de relleno en comparación con patrón de rejilla.

### Desventajas

- Extremadamente débil también en dirección vertical y horizontal.
- Esto no es adecuado para un modelo que requiera resistencia.

## Triángulos

Cuando tres líneas diferentes se cruzan entre sí para formar un ángulo equilátero (**ángulos 60°**)

### Ventajas

- Fuerza uniforme en todas las direcciones.
- Es capaz de resistir la fuerza que actúa paralela a la superficie.

### Desventajas

- No es adecuado cuando se requiere una superficie lisa, de lo contrario, es necesario aumentar el número de capas superiores.
- Cuando se aplica una alta tasa de relleno, este no funciona bien en términos de resistencia.

## Tri-hexágono

Cuando mires el interior de este patrón, observarás un patrón con un polígono de 6 lados.

### Ventajas

- La dirección horizontal proporciona la máxima resistencia en este patrón de relleno.
- Cada dirección da una fuerza uniforme.
- Alta resistencia al cizallamiento.

## Cúbico

Es uno de los patrones de relleno de cura más comunes por sus beneficios y casi cero incovenientes.

### Ventajas

- En términos de fuerza, este patrón también se recomienda principalmente.
- Da alta resistencia tanto en dirección horizontal como vertical.
- No permite **«pillowing»** (`pequeños agujeros, golpes en la superficie`) en el relleno.

## Cúbico Subdividido

Es un patrón similar en comparación con el patrón cúbico pero viene con diferentes formaciones.
En realidad, un cubo de gran tamaño se centra con 8 cubos de pequeño tamaño. En otras palabras, un cubo grande se subdivide en 8 cubos pequeños.

### Ventajas

- Utiliza menos filamento pero también proporciona una buena cantidad de resistencia.
- Este patrón de relleno también proporciona uniformidad en todas las direcciones en términos de la resistencia del modelo.
- Mejora la calidad superficial de la impresión.

### Desventajas

- Esto lleva un poco más de tiempo para cortar en comparación con otros patrones de relleno.
- Debido a la formación de este patrón, se recomienda utilizar una densidad de relleno más alta según se desee.

## Octeto

Se imprimen varias líneas de relleno para hacer este tipo de patrón, se considera una combinación de forma tetraédrica y de cubo.

### Ventajas

- Dado que la carga sobre la estructura se distribuye en el área general, funciona bien cuando se requiere una resistencia moderada.
- También evita que se forme efecto almohada (deformidad) en superficie.

## Cúbico por cuartos

Por apariencia, puede parecer similar al patrón cúbico, pero existen algunas diferencias en la funcionalidad.

### Ventajas

- Al igual que el patrón de octetos, la distribución de la carga es fácil y eficaz, por lo tanto dispone de alta resistencia.
- Adecuado para modelos 3D incluso cuando el grosor de la pared es delgado.

## Concéntrico

Este tipo de estructura de relleno se puede identificar fácilmente mirando la impresión.
Los anillos paralelos se forman paralelamente dentro de la estructura, siempre que vaya a utilizar un relleno al 100%, es recomendable elegir este patrón.

### Ventajas

- Debido a su estructura, la carga se distribuirá fácilmente por toda el área de relleno.
- Da más fuerza especialmente en la dirección vertical.

### Desventajas

- Nuevamente, si no va a usar una densidad de relleno del 100%, no debe usar el patrón concéntrico, ya que no le da suficiente resistencia a la estructura.
- La fuerza en la dirección horizontal es menor.

## Zig-Zag

Es otro de los patrones de relleno más comunes y utilizados por la mayoría de los propietarios de impresoras 3D.
Es un patrón bastante adecuado para la boquilla, ya que evita cualquier interrupción durante cada capa.

### Ventajas

- Da más fuerza, especialmente cuando se elige una alta densidad de relleno.
- Da una superficie superior extremadamente lisa.

### Desventajas

- No proporciona alta resistencia tanto en dirección vertical como horizontal.
- No resiste el cizallamiento.

## Cruz

El patrón de relleno en cruz, casi parece un rompecabezas, ya que parece una curva dentro de la estructura.

### Ventajas

- Ideal para estructuras impresas suaves y flexibles.
- Más fuerte en la dirección vertical en comparación con la dirección horizontal.

### Desventajas

- Dado que no hay una línea recta dentro del patrón de relleno, esto hace que la estructura sea débil.
- El tiempo de laminado es más largo que otros patrones de relleno.
- Extremadamente débil en dirección horizontal.

## Cruz 3D

Bastante similar al patrón de relleno en Cruz, debido a este patrón, la dirección vertical se vuelve muy débil.

### Ventajas

- Siempre que se requiera una estructura suave y flexible, puede optar por este patrón de relleno.
- Fácil de imprimir ya que no se requiere retracción.

### Desventajas

- Débil en todas direcciones.
- Toma más tiempo en laminar.

## Giroide

Es un patrón bastante diferente a otros, debido a su estructura de patrón ondulado.
Es adecuado para un modelo que requiera pasar fluidos por la superficie (**ofrece permeabilidad**).

### Ventajas

- Proporciona fuerza uniforme.
- Bueno para filamento flexible


> Y listo!
