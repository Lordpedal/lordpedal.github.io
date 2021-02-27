---
title:  "Cortar piezas 3D: Meperiun3D"
date:   2021-02-27 23:50:00
last_modified_at: 2021-02-27T23:55:00
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

![Meperiun3D]({{ site.url }}{{ site.baseurl }}/assets/images/miniE3MP.png){: .align-center}
{: .full}
[Slic3r](https://slic3r.org){: .btn .btn--warning .btn--small}{:target="_blank"} es un software de corte actúa como intermediario entre el modelo diseñado en 3D y la impresora 3D. 

Esto significa que el software rebana un modelo en capas para traducir cada una de ellas a un lenguaje especial llamado **Gcode** que contiene información específica capa a capa.

Es un **software de código abierto**, *independiente de empresas comerciales o fabricantes de impresión*, cuya **última versión estable** se lanzó al mercado de forma oficial a mediados de **2018**.

Se podría pensar que esta obsoleto y en parte lo está, pero entre sus opciones incluye algunas utilidades que nos facilitan enormemente ciertas tareas en la impresión 3D.

En esta entrada quiero compartir una de ellas.

## Slic3r 1.3.0

Primeramente nos dirigimos a la sección de descargas en su [**Web Oficial**](https://slic3r.org/download/){: .btn .btn--info .btn--small}{:target="_blank"} o bien [**Github**](https://github.com/slic3r/Slic3r/releases){: .btn .btn--info .btn--small}{:target="_blank"}

Comentar que es software multiplataforma y soporta entornos de trabajos basados tanto en `Microsoft Windows, MacOSX y GNU/Linux`.

### GNU/Linux 64bits

Inicialmente he preparado una carpeta para alojar el software en mi $HOME

```bash
mkdir -p $HOME/Slic3r && \
cd $HOME/Slic3r
```

A continuación descargo el Software:

```bash
wget https://dl.slic3r.org/linux/Slic3r-1.3.0-x86_64.AppImage
```

Lo único que me queda por hacer es darle permisos de ejecución antes de iniciar el software:

```bash
chmod +x Slic3r-1.3.0-x86_64.AppImage
```

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/slic3r1.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/slic3r1.webm"  type="video/webm"  />
   </video>
</div>

Iniciamos la aplicación desde nuestro gestor de escritorio y seguimos el sencillo asistente de primera ejecución.

### Corte 3D

Imagina que has diseñado una pieza o bien descargado alguna cuya superficie de impresión es superior a la de tu mesa de impresión, pues no queda otra que seccionar el fichero 3D en partes más pequeñas. 

Primeramente seleccionamos la pieza/objeto:

<figure>
    <a href="/assets/images/posts/slic3r1.png"><img src="/assets/images/posts/slic3r1.png"></a>
</figure>

Clicamos en la opción Cortar (**Cut**):

<figure>
    <a href="/assets/images/posts/slic3r2.png"><img src="/assets/images/posts/slic3r2.png"></a>
</figure>

Se nos abre una ventana con parámetros de configuración que vamos a revisar:

- **Axis**: Nos permite elegir sobre que eje queremos realizar el corte (**X**, **Y** o **Z**).
- **Slice**: Podremos desplazarnos en el eje de corte, seleccionamos la capa sobre la que cortar.
- **Upper part**: Lo dejamos activo para conservar un lado del corte.
- **Lower part**: Lo dejamos activo para conservar la otra parte del corte.

Entre las opciones de corte se nos presentan dos opciones:

- **Corte por eje**: Dividimos en dos partes la pieza, según seleccionemos eje y capa.
- **Corte por cuadrícula**: Dividimos en cuadrículas de tamaños definidos en las coordenadas **X** e **Y**, `especialmente útil para piezas de grandes dimensiones`.

**NOTA**: Una vez tenemos una pieza cortada en trozos, es importante que exportemos cada una de las piezas a un fichero STL nuevo, de esta forma no perderemos las secciones que posteriormente iremos imprimiendo. Este paso es importante ya que realizar el corte exactamente igual para que luego las piezas encajen puede ser bastante complicado.
{: .notice--info}

#### Corte por eje 

Seleccionamos el eje de corte: 

<figure>
    <a href="/assets/images/posts/slic3r3.png"><img src="/assets/images/posts/slic3r3.png"></a>
</figure>

Determinamos la capa de corte, nos aseguramos de tener activas las dos caras de la sección y clicamos en realizar corte (**Perform cut**)

<figure>
    <a href="/assets/images/posts/slic3r4.png"><img src="/assets/images/posts/slic3r4.png"></a>
</figure>

Ya solo nos quedaría exportar las piezas dividas para su laminación e impresión:

<figure>
    <a href="/assets/images/posts/slic3r5.png"><img src="/assets/images/posts/slic3r5.png"></a>
</figure>

Adjunto ejemplo:

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/slic3r2.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/slic3r2.webm"  type="video/webm"  />
   </video>
</div>

#### Corte por cuadrícula

Seleccionamos el corte por cuadrícula (**Cut by grid...**):

<figure>
    <a href="/assets/images/posts/slic3r6.png"><img src="/assets/images/posts/slic3r6.png"></a>
</figure>

Definimos el tamaño de la cuadrícula en el **eje X** (*mm´s*):

<figure>
    <a href="/assets/images/posts/slic3r7.png"><img src="/assets/images/posts/slic3r7.png"></a>
</figure>

Definimos tamaño de la cuadrícula en el **eje Y** (*mm´s*):

<figure>
    <a href="/assets/images/posts/slic3r8.png"><img src="/assets/images/posts/slic3r8.png"></a>
</figure>

Ya solo nos quedaría exportar las piezas dividas para su laminación e impresión:

<figure>
    <a href="/assets/images/posts/slic3r5.png"><img src="/assets/images/posts/slic3r5.png"></a>
</figure>

Adjunto ejemplo:

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/slic3r3.mp4" type="video/mp4" />
       <source src="{{ site.baseurl }}/assets/videos/slic3r3.webm"  type="video/webm"  />
   </video>
</div>

> Y listo!
