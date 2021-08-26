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

Dicho de otra forma, de un simple vistazo concer el estado del **Servidor**.

Para ampliar información recomiendo:

 * Revisar [Wiki del proyecto](https://github.com/brndnmtthws/conky/wiki){: .btn .btn--inverse .btn--small}{:target="_blank"} 

 * Revisar [documentación de variables](http://conky.sourceforge.net/variables.html){: .btn .btn--inverse .btn--small}{:target="_blank"}

En esta entrada voy a compartir la configuración que he estado usando en **Mate** y posteriormente adaptando en el servidor, dejo unas capturas de pantalla:

<figure class="third">
    <a href="/assets/images/posts/conky0.jpg"><img src="/assets/images/posts/conky0.jpg"></a>
    <a href="/assets/images/posts/conky00.jpg"><img src="/assets/images/posts/conky00.jpg"></a>
    <a href="/assets/images/posts/conky000.jpg"><img src="/assets/images/posts/conky000.jpg"></a>
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

 * `conky.config = { ... }`: Apartado donde ajustamos el tipo, tamaño, ubicación, resolución, ... de los datos a mostrar

 * `conky.text = { ... }`: Apartado donde ajustamos las variables a mostrar

### Conky: Resolución (conky.config)

Una forma sencilla de adaptarlo según resolución del sistema es ajustar la siguiente variable:

```bash
    font = 'Roboto Mono:size=8',
```

Que no es otra opción que la fuente usada del sistema y su tamaño

<figure class="third">
    <a href="/assets/images/posts/conky0.png">Roboto Mono:size=6<img src="/assets/images/posts/conky0.png"></a>
    <a href="/assets/images/posts/conky00.png">Roboto Mono:size=10<img src="/assets/images/posts/conky00.png"></a>
    <a href="/assets/images/posts/conky000.png">Roboto Mono:size=8<img src="/assets/images/posts/conky000.png"></a>
</figure>

### Conky: GNU/Linux (conky.text)

### Conky: Sistema (conky.text)

### Conky: Temperaturas (conky.text)

### Conky: Almacenamiento (conky.text)

### Conky: Memoria (conky.text)

### Conky: Procesos (conky.text)

Al finalizar guardaremos los cambios, saldremos del editor y reiniciamos el entorno `X`

> Y listo!
