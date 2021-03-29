---
title:  "RetroPie: Debian GNU/Linux"
date:   2021-03-29 23:30:00
last_modified_at: 2021-03-29T23:45:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
  - Personal
toc: false
toc_sticky: false
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[RetroPie](https://retropie.org.uk/){: .btn .btn--warning .btn--small}{:target="_blank"} es un proyecto de código abierto diseñado en un principio para emular consolas retro en las Raspberry Pi's que se ha hecho extensible a otros sistemas.

RetroPie puede emular más de 50 plataformas de videojuegos para que puedas usar las ROMs de sus juegos para revivirlos en la actualidad. Las más conocidas son:
 * Nintendo NES
 * SuperNintendo
 * Master Syestem
 * PlayStation 1
 * Genesis
 * GameBoy
 * GameBoy Advance
 * Atari 7800
 * Game Boy Color
 * Atari 2600
 * Sega SG1000
 * Nintendo 64
 * Sega 32X
 * Sega CD
 * Atari Lynx
 * NeoGeo
 * NeoGeo Pocket Color
 * Amstrad CPC
 * Sinclair ZX81
 * Atari ST
 * Sinclair ZX Spectrum
 * DreamCast
 * PSP
 * Commodore 64
 * ScummVM
 * **Y alguno más que se me escapa**…

Antes de continuar, te informo que debes de tener algún mando para poder disfrutar de los juegos, una opción económica que funciona muy bien es este [Pack mandos USB x2](https://www.amazon.es/dp/B00PL271Y0){: .btn .btn--danger .btn--small}{:target="_blank"}.

Comenzamos actualizando repositorios del sistema e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install git
```

Creamos la carpeta donde vamos a alojar el código fuente:

```bash
mkdir -p $HOME/source && \
cd $HOME/source
```

Clonamos el repositorio del proyecto en nuestro sistema:

```bash
git clone https://github.com/RetroPie/RetroPie-Setup.git
```

Entramos en la carpeta del proyecto y le damos privilegios de ejecución a los scripts:

```bash
cd $HOME/source/RetroPie-Setup && \
chmod +x *.sh
```

Ejecutamos el asistente de instalación:

```bash
sudo ./retropie_setup.sh
```

<figure>
    <a href="/assets/images/posts/retropie1.png"><img src="/assets/images/posts/retropie1.png"></a>
</figure>

Seleccionamos la opción `Basic Install`:

<figure>
    <a href="/assets/images/posts/retropie2.png"><img src="/assets/images/posts/retropie2.png"></a>
</figure>

Confirmamos que queremos continuar `Sí`:

<figure>
    <a href="/assets/images/posts/retropie3.png"><img src="/assets/images/posts/retropie4.png"></a>
</figure>

**NOTA**: El proceso tardará un buen rato, ten paciencia.
{: .notice--info}

Para el futuro en caso de querer actualizar el script de instalación y los programas compilados, tendremos que hacer clic en las siguientes opciones:

<figure>
    <a href="/assets/images/posts/retropie4.png"><img src="/assets/images/posts/retropie4.png"></a>
</figure>

<figure>
    <a href="/assets/images/posts/retropie5.png"><img src="/assets/images/posts/retropie5.png"></a>
</figure>

<figure>
    <a href="/assets/images/posts/retropie6.png"><img src="/assets/images/posts/retropie6.png"></a>
</figure>

<figure>
    <a href="/assets/images/posts/retropie7.png"><img src="/assets/images/posts/retropie7.png"></a>
</figure>

<figure>
    <a href="/assets/images/posts/retropie8.png"><img src="/assets/images/posts/retropie8.png"></a>
</figure>

<figure>
    <a href="/assets/images/posts/retropie9.png"><img src="/assets/images/posts/retropie9.png"></a>
</figure>

Cuando termine el proceso, saldremos del asistente y reiniciamos el sistema:

```bash
sudo reboot
```

Tras el reinicio del sistema, conectaremos por ejemplo los mandos USB y podremos lanzar el sistema que hemos compilado:

```bash
emulationstation
```

**NOTA**: Recuerda que necesita de un entorno gráfico para su funcionamiento.
{: .notice--info}

En el primer arranque nos pedira configurar los mandos:

<figure>
    <a href="/assets/images/posts/retropieb1.png"><img src="/assets/images/posts/retropieb1.png"></a>
</figure>

Y ya podremos tener acceso a los emuladores:

<figure>
    <a href="/assets/images/posts/retropieb2.png"><img src="/assets/images/posts/retropieb2.png"></a>
</figure>

**NOTA**: Por temas legales apenas incluye contenido, en las redes P2P y buscadores encontraras muchas fuentes fiables de contenido descargable.
{: .notice--info}

<figure>
    <a href="/assets/images/posts/retropieb3.png"><img src="/assets/images/posts/retropieb3.png"></a>
</figure>

Para añadir contenido de emulación debes de tener en cuenta las siguientes rutas:
 * `$HOME/RetroPie/BIOS` : Ruta donde alojaremos las Bios de los sistemas que lo requieran, por ejemplo **PSX1**
 * `$HOME/RetroPie/ROMS` : Ruta donde alojaremos las Roms de los sistemas, recuerda alojar cada Rom en la carpeta del sistema a emular.

> Y listo!
