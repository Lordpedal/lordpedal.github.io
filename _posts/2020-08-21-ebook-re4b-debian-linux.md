---
title:  "Ebook RE4B: Debian GNU/Linux"
date:   2020-08-21 23:00:00 -0300
last_modified_at: 2020-12-16T10:00:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[Reverse Engineering for Beginners](https://beginners.re/){:target="_blank"} es un libro con un buen material de iniciación a las técnicas de ingenieria inversa.

Está registrado bajo una licencia [Creative Commons](https://creativecommons.org/){:target="_blank"} y como peculiaridad no solamente puedes bajarlo y leerlo previo registro en su web sino que puedes ver su código latex y renderizar el libro a pdf como detallo a continuación con estos sencillos pasos.

Comenzamos actualizando repositorios e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install wget bzip2 \
make texlive texlive-xetex \
texlive-generic-extra \
texlive-generic-recommended \
texlive-science \
texlive-fonts-extra
```

Creamos directorio de trabajo:

```bash
cd && \
mkdir -p $HOME/source/ebook && \
cd $HOME/source/ebook
```

Bajamos la última versión [Source](https://beginners.re/src/){:target="_blank"} disponible:

```bash
wget -q "https://beginners.re/src/RE4B-20200225.tar.bz2" \
-O RE4B-20200225.tar.bz2
```

Descomprimimos los archivos:

```bash
bzip2 -d RE4B-20200225.tar.bz2 && \
tar xfv RE4B-20200225.tar
```

Entramos en la ruta de trabajo:

```bash
cd RE-book
```

Limpiamos dependencias:

```bash
make clean
```

Compilamos a PDF:

```bash
make RE4B-EN
```

> Y listo, disfrutamos de la lectura
