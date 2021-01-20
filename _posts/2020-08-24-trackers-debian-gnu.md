---
title:  "Trackers: Debian GNU/Linux"
date:   2020-08-24 04:00:00 -0300
last_modified_at: 2020-12-16T10:00:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[Fasttracker 2](https://web.archive.org/web/19980530083017/http://www.starbreeze.com/ft2.htm){:target="_blank"} supuso en mi «experiencia musical digital», un punto de partida y a día de hoy me recuerda más si cabe la evolución que hemos ido experimentando en la informática domestica.

Mucho antes del boom tecnológico que conllevo el desarrollo del formato [MP3](https://es.wikipedia.org/wiki/MP3){:target="_blank"}, existió una alternativa en los **trackers musicales**, unas aplicaciones para crear música que se convirtieron en un fenómeno muy de moda en la década de los 90. Los más veteranos quizás sepan de que hablo si menciono formatos de archivo como **MOD, XM, S3M** o **IT**.

Estos programas permitían crear **canciones** (`módulos`), mediante una serie de *«partituras»* cronológicas (`patterns`), dónde el músico especificaba las notas del **instrumento** que seleccionaba, que no era más que muestras de sonido previamente grabado (`samples`) con un **editor de sonido**. A estas notas se le podían aplicar ciertas variaciones como el volumen, tono, repetir indefinidamente (`looping`) o jugar con el estéreo (`panning`), entre otros.

Cada canción (`módulo`) tenía a disposición varios **canales** con los que podíamos jugar y aplicar un instrumento diferente en cada uno, que finalmente se mezclaría para obtener la canción resultante.

Para situar a los que no vivieron este fenómeno, se podría decir (a grandes rasgos) que se convirtió en algo similar a la comunidad del **software libre**, ya que cualquier persona podía crear o modificar canciones, reutilizar samples o aprender de otros observando las técnicas utilizadas en cada módulo.

En España se hizo muy frecuente la contribución de módulos y trackers por distintos medios, como por ejemplo, por parte de los lectores mediante concursos de la revista [PCManía](https://es.wikipedia.org/wiki/Personal_Computer_%26_Internet){:target="_blank"}.

Tras esta introducción y gracias al trabajo de [Olav Sørensen](https://16-bits.org/){:target="_blank"} por portar el código a una versión clonada no he podido resistirme a compilarme mi propio **Fasttracker 2 y Protracker 2**.

## Protracker 2

Vamos a ir preparando el lugar de trabajo:

```bash
mkdir -p $HOME/source && \
mkdir -p $HOME/.protracker && \
cd $HOME/source
```

Clonamos el repositorio y entramos en su carpeta:

```bash
git clone \
https://github.com/8bitbubsy/pt2-clone.git && \
cd $HOME/source/pt2-clone
```

Instalamos las dependencias necesarias para poder compilar el programa:

```bash
sudo apt-get update && \
sudo apt-get -y install build-essential libsdl2-dev
```

Damos permisos de ejecución al script de compilación y lo ejecutamos:

```bash
chmod +x make-linux.sh && ./make-linux.sh
```

Cuando termine la compilación, tendremos acceso al programa en la siguiente ruta, adicionalmente pasamos la configuración a la carpeta .protracker:

```bash
cp \
$HOME/source/pt2-clone/release/other/protracker.ini \
$HOME/.protracker && \
cd $HOME/source/pt2-clone/release/other
```

Damos permisos de ejecución y ya podríamos lanzar el programa:

```bash
chmod +x pt2-clone && ./pt2-clone
```

Si quieres actualizar el programa a su última versión, recuerda que deberas de recompilarlo nuevamente tras realizar el ugprade del repositorio:

```bash
cd $HOME/source/pt2-clone && git pull
```

Enjoy **PT2!**

## Fasttracker 2

Vamos a ir preparando el lugar de trabajo:

```bash
mkdir -p $HOME/source && cd $HOME/source
```

Clonamos el repositorio y entramos en su carpeta:

```bash
git clone \
https://github.com/8bitbubsy/ft2-clone.git && \
cd $HOME/source/ft2-clone
```

Instalamos las dependencias necesarias para poder compilar el programa:

```bash
sudo apt-get update && \
sudo apt-get -y install build-essential \
libsdl2-dev
```

Damos permisos de ejecución al script de compilación y lo ejecutamos:

```bash
chmod +x make-linux.sh && ./make-linux.sh
```

Cuando termine la compilación, tendremos acceso al programa en la siguiente ruta:

```bash
cd $HOME/source/ft2-clone/release/other
```

Damos permisos de ejecución y ya podríamos lanzar el programa:

```bash
chmod +x ft2-clone && ./ft2-clone
```

Si quieres actualizar el programa a su última versión, recuerda que deberas de recompilarlo nuevamente tras realizar el ugprade del repositorio:

```bash
cd $HOME/source/ft2-clone && git pull
```

![FT2]({{ site.url }}{{ site.baseurl }}/assets/images/posts/FT2.jpg){: .align-center}

Enjoy **FT2!**, si necesitas canciones te [recomiendo esta web](https://modarchive.org/){:target="_blank"}.

> Y listo!
