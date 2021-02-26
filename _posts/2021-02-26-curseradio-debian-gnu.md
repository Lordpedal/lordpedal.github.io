---
title:  "Curseradio: Debian GNU/Linux"
date:   2021-02-26 23:30:00
last_modified_at: 2021-02-24T23:45:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
[Curseradio](https://github.com/chronitis/curseradio){: .btn .btn--warning .btn--small}{:target="_blank"} es un sencillo reproductor de radio para la terminal del sistema.

Aunque no dispone de interfaz gráfica, es extremadamente fácil de utilizar y no requiere ninguna configuración ni tampoco necesita tutoriales especializados.

Desarrollado sobre `Python` está diseñado para utilizar por defecto el diretorio **Tunein** que se encuentra en [http://opml.radiotime.com](http://opml.radiotime.com){: .btn .btn--small}{:target="_blank"} pero puede ser personalizado para reproducir otras listas.

Para poder usar el programa debemos de cubrir algunas dependencias del sistema:

```bash
sudo apt-get update && \
sudo apt-get -y install mpv git python3-pip python3-setuptools python3-lxml python3-requests python3-xdg
```

Creamos una ruta donde alojar el repositorio:

```bash
mkdir -p $HOME/source && \
cd $HOME/source
```

Clonamos el repositorio alojado en **Github** y entramos en el:

```bash
git clone https://github.com/chronitis/curseradio.git && \
cd $HOME/source/curseradio
```

Instalamos el proyecto que se va a alojar en la ruta `/usr/local/bin`:

```bash
sudo python3 setup.py install
```

A partir de ese momento ya podremos ejecutar libremente el progama desde cualquier ruta del sistema con la siguiente orden:

```bash
curseradio
```

La interfaz es muy simple como previamente comentamos, nos vamos a manejar por ella con el teclado con la siguientes teclas:

| Tecla(s) | Función |
| ------ | ------ |
| <kbd></kbd>, <kbd></kbd> | Navegar en listado |
| <kbd>PgUp</kbd>, <kbd>PgDn</kbd> | Navegar rápidamente en listado |
| <kbd>Home</kbd>, <kbd>End</kbd> | Ir hacia arriba/abajo | 
| <kbd>Enter</kbd> | Abrir/cerrar carpetas, reproducir emisora |
| <kbd>k</kbd> | Detener la reproducción de la emisora |
| <kbd>q</kbd> | Salir |
| <kbd>f</kbd> | Des/activar como favorito |
{: .notice--info}

<figure>
    <a href="/assets/images/posts/curseradio.png"><img src="/assets/images/posts/curseradio.png"></a>
</figure>

> Y listo!
