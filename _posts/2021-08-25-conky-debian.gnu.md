---
title:  "Conky: Debian GNU/Linux"
header:
  image: /assets/images/posts/debiantt.gif
date:   2021-08-24 23:30:00
last_modified_at: 2021-08-24T23:45:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
  - Servidor
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[**Conky**](https://github.com/brndnmtthws/conky){: .btn .btn--warning .btn--small}{:target="_blank"} es un **monitor de sistema** liviano y gratuito diseñado inicialmente para entornos gráficos `X`. 

Se distribuye bajo licencia **GPL 3.0**, su configuración se basa en un fichero de texto plano, donde le indicaremos los parámetros que queremos monitorear y controlar para que sean mostrados en el escritorio.

`Conky` no solo tiene muchos complementos incorporados, sino que también puede mostrar casi cualquier información mediante el uso de scripts y otros programas externos.

Dicho de otra forma, de un simple vistazo poder conocer el estado del **Servidor** y actuar en consecuencia.

Para ampliar información recomiendo:

 * Revisar [Wiki del proyecto](https://github.com/brndnmtthws/conky/wiki){: .btn .btn--inverse .btn--small}{:target="_blank"} 

 * Revisar [documentación de variables](http://conky.sourceforge.net/variables.html){: .btn .btn--inverse .btn--small}{:target="_blank"}

En esta entrada voy a compartir la configuración que he estado usando en **Mate** y posteriormente adaptando en el servidor, dejo unas capturas de pantalla:

<figure class="third">
    <a href="/assets/images/posts/conky0.jpg">DualCore<img src="/assets/images/posts/conky0.jpg"></a>
    <a href="/assets/images/posts/conky00.jpg">HexaCore<img src="/assets/images/posts/conky00.jpg"></a>
    <a href="/assets/images/posts/conky000.jpg">QuadCore<img src="/assets/images/posts/conky000.jpg"></a>
</figure>

## Instalación GNU/Linux 64bits

Previo paso de instalación `Conky`, comentar que **debemos de tener instalado y configurado** [LM-SENSORS](https://lordpedal.github.io/gnu/linux/debian-11-servidor/#modding){: .btn .btn--info .btn--small}{:target="_blank"}

Dicho esto, entramos en materia según *sistema*.

### Dependencias: Debian 10 Buster

Comenzamos actualizando repositorios del sistema e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install compton conky-all
```

Realizado este paso podemos pasar al apartado común de **configuración**.

### Dependencias: Debian 11 Bullseye

Comenzamos actualizando repositorios del sistema e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install picom conky-all
```

Realizado este paso podemos pasar al apartado común de **configuración**.

### Configuración: Debian GNU/Linux

Creamos en caso de no disponer de ello de la carpeta donde alojaremos la fuente gráfica que usa el perfil y la carpeta de autoarranque del script:

```bash
mkdir -p $HOME/.local/share/fonts && \
mkdir -p $HOME/.config/autostart
```

Bajamos la fuente y la alojamos en la carpeta de nuestro usuario:

```bash
curl -o $HOME/.local/share/fonts/ConkySymbols.ttf \
https://lordpedal.github.io/lordpedal/ConkySymbols.ttf
```

Creamos el lanzador de autoarranque para que **Conky** se ejecute al arrancar el entorno `X`:

```bash
cat << EOF | tee $HOME/.config/autostart/conky.desktop
[Desktop Entry]
Type=Application
Exec=conky -p 5
Hidden=false
X-MATE-Autostart-enabled=true
Name[es_ES]=Conky
Name=Conky
Comment[es_ES]=Conky
Comment=Conky
EOF
```

Descargamos el fichero de configuración:

```bash
curl -o $HOME/.conkyrc \
https://lordpedal.github.io/lordpedal/conkyrc
```

A continuación veremos como adaptarlo paso a paso.


## Configuración: Conky

Para evitar errores de configuración partimos del fichero `$HOME/.conkyrc` que hemos obtenido.

La configuración se basa en un procesador `Quad-Core + Sistema RAID + Red Bridge` aunque vamos a revisar de adaptarla por ejemplo a sistemas `Dual-Core` o `Hexa-Core`.

Abrimos el editor de texto y vamos configurando según secciones.

```bash
nano $HOME/.conkyrc
```

En la estructura del fichero veremos dos secciones diferenciadas:

 * `conky.config = { ... }`: Apartado donde ajustamos tamaño, ubicación, resolución, colores ... de los datos a mostrar

 * `conky.text = { ... }`: Apartado donde ajustamos las variables a mostrar

### Conky: Resolución

Una forma sencilla de adaptarlo según resolución del sistema es ajustar la siguiente variable:

```bash
    font = 'Roboto Mono:size=8',
```

Que no es otra opción que la fuente usada del sistema y su tamaño

<figure class="third">
    <a href="/assets/images/posts/conky0.png"><img src="/assets/images/posts/conky0.png">Roboto Mono:size=6</a>
    <a href="/assets/images/posts/conky00.png"><img src="/assets/images/posts/conky00.png">Roboto Mono:size=9</a>
    <a href="/assets/images/posts/conky000.png"><img src="/assets/images/posts/conky000.png">Roboto Mono:size=8</a>
</figure>

### Conky: GNU/Linux

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}s${font} ${voffset -10} GNU/Linux${color}
${color1}${goto 35}OS: ${color}${execi 86400 cat `ls -atr /etc/*-release | tail -2` | grep "PRETTY_NAME" | cut -d= -f2 |  sed 's/"//g'}
${color1}${goto 35}Kernel: ${color}$kernel on $machine
${color1}${goto 35}Usuario: ${color}${exec whoami}
${color1}${goto 35}Fecha: ${color}${time %a,%d %B}
${color1}${goto 35}Hora: ${color}${time %k:%M:%S}
${color1}${goto 35}Actividad: ${color}$uptime
${color1}${goto 35}Promedios: ${color}$loadavg
${color1}${goto 35}Total Procesos: ${color}$processes
```
<figure>
    <a href="/assets/images/posts/conky01.png"><img src="/assets/images/posts/conky01.png"></a>
</figure>

### Conky: Sistema

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}f${font} ${voffset -10} Sistema${color}
${color1}${goto 35}Core 0 : ${color}${freq_g 0}GHz ${alignr}${cpu cpu0}% ${cpubar cpu0 4,100}
${color1}${goto 35}Core 1 : ${color}${freq_g 1}GHz ${alignr}${cpu cpu1}% ${cpubar cpu1 4,100}
${color1}${goto 35}Core 2 : ${color}${freq_g 2}GHz ${alignr}${cpu cpu2}% ${cpubar cpu2 4,100}
${color1}${goto 35}Core 3 : ${color}${freq_g 3}GHz ${alignr}${cpu cpu3}% ${cpubar cpu3 4,100}
${color1}${goto 35}Core 4 : ${color}${freq_g 4}GHz ${alignr}${cpu cpu4}% ${cpubar cpu4 4,100}
${color1}${goto 35}Core 5 : ${color}${freq_g 5}GHz ${alignr}${cpu cpu5}% ${cpubar cpu5 4,100}
${color1}${goto 35}Core 6 : ${color}${freq_g 6}GHz ${alignr}${cpu cpu6}% ${cpubar cpu6 4,100}
${color1}${goto 35}Core 7 : ${color}${freq_g 7}GHz ${alignr}${cpu cpu7}% ${cpubar cpu7 4,100}
```

<figure>
    <a href="/assets/images/posts/conky02.png"><img src="/assets/images/posts/conky02.png"></a>
</figure>

### Conky: Temperaturas

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}h${font} ${voffset -10} Temperaturas${color}
${color1}${goto 35}Core 0 : ${color}${execi 3 sensors | grep 'Core 0' | cut -c16-25} ${color1}TSH : ${color}${execi 3 sensors | grep 'Core 0' | cut -c34-41} ${color1}TSHH : ${color}${execi 3 sensors | grep 'Core 0' | cut -c51-59}
${color1}${goto 35}Core 1 : ${color}${execi 3 sensors | grep 'Core 1' | cut -c16-25} ${color1}TSH : ${color}${execi 3 sensors | grep 'Core 1' | cut -c34-41} ${color1}TSHH : ${color}${execi 3 sensors | grep 'Core 1' | cut -c51-59}
${color1}${goto 35}Core 2 : ${color}${execi 3 sensors | grep 'Core 2' | cut -c16-25} ${color1}TSH : ${color}${execi 3 sensors | grep 'Core 2' | cut -c34-41} ${color1}TSHH : ${color}${execi 3 sensors | grep 'Core 2' | cut -c51-59}
${color1}${goto 35}Core 3 : ${color}${execi 3 sensors | grep 'Core 3' | cut -c16-25} ${color1}TSH : ${color}${execi 3 sensors | grep 'Core 3' | cut -c34-41} ${color1}TSHH : ${color}${execi 3 sensors | grep 'Core 3' | cut -c51-59}
${color1}${goto 35}Core 4 : ${color}Virtual
${color1}${goto 35}Core 5 : ${color}Virtual
${color1}${goto 35}Core 6 : ${color}Virtual
${color1}${goto 35}Core 7 : ${color}Virtual
```

<figure>
    <a href="/assets/images/posts/conky03.png"><img src="/assets/images/posts/conky03.png"></a>
</figure>

### Conky: Almacenamiento

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}k${font} ${voffset -10} Almacenamiento${color}
${color1}${goto 35}SSD${color} $alignr ${fs_used /} / ${fs_size /}
${goto 35}${fs_bar /}
${color1}${goto 35}RAID${color} $alignr ${fs_used /media/raidnas} / ${fs_size /media/raidnas} 
${goto 35}${fs_bar /media/raidnas}
```

<figure>
    <a href="/assets/images/posts/conky04.png"><img src="/assets/images/posts/conky04.png"></a>
</figure>

### Conky: Memoria

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}J${font} ${voffset -10} Memoria${color}
${color1}${goto 35}RAM${color} $alignr $mem / $memmax
${goto 35}${membar}
${color1}${goto 35}SWAP${color} $alignr $swap / $swapmax
${goto 35}$swapbar
```

<figure>
    <a href="/assets/images/posts/conky05.png"><img src="/assets/images/posts/conky05.png"></a>
</figure>

### Conky: Procesos

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}n${font} ${voffset -10} Procesos${color}
${color1}${goto 35}Top consumo CPU${color}
${goto 35}${top name 1}$alignr${top cpu 1}%
${goto 35}${top name 2}$alignr${top cpu 2}%
${goto 35}${top name 3}$alignr${top cpu 3}%
${goto 35}${top name 4}$alignr${top cpu 4}%
${goto 35}${top name 5}$alignr${top cpu 5}%
${color1}${goto 35}Top consumo RAM${color}
${goto 35}${top_mem name 1}$alignr${top_mem mem 1}%
${goto 35}${top_mem name 2}$alignr${top_mem mem 2}%
${goto 35}${top_mem name 3}$alignr${top_mem mem 3}%
${goto 35}${top_mem name 4}$alignr${top_mem mem 4}%
${goto 35}${top_mem name 5}$alignr${top_mem mem 5}%
```

<figure>
    <a href="/assets/images/posts/conky06.png"><img src="/assets/images/posts/conky06.png"></a>
</figure>

### Conky: Red

Contenido representado en la siguiente sección:

```bash
${color2}${font ConkySymbols:size=16}i${font} ${voffset -10} Red${color}
${color1}${goto 35}IP Red: ${color}${addr br0}
${color1}${goto 35}Subida: ${color}${totalup br0}  ${color1}Velocidad: ${color}${upspeed br0}/s
${goto 35}${upspeedgraph br0 30,250 0000ff ff0000}
${color1}${goto 35}Bajada: ${color}${totaldown br0}  ${color1}Velocidad: ${color}${downspeed br0}/s
${goto 35}${downspeedgraph br0 30,250 01df01 10fd10}
```

<figure>
    <a href="/assets/images/posts/conky07.png"><img src="/assets/images/posts/conky07.png"></a>
</figure>

## Notas

Al finalizar guardaremos los cambios, saldremos del editor y reiniciamos el entorno `X`

> Y listo!
