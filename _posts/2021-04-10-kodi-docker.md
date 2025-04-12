---
title:  "Kodi: Docker" 
header:
  image: /assets/images/posts/dockerkodi.jpg
date:   2021-04-10 22:30:00
last_modified_at: 2021-04-10T22:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Dockerold.png){: .align-center}
{: .full}
[Kodi](https://kodi.tv/){: .btn .btn--info .btn--small}{:target="_blank"} es una aplicación con la que puedes convertir tu ordenador en un centro multimedia en el que ver con una interfaz limpia y clara todo tipo de contenidos.

Una de las grandes bazas de **Kodi** es que su **código es libre** bajo la licencia `GNU/GPL`, desarrollado en **Python**, dispone de versiones tanto para `Windows` como para `GNU/Linux, macOS, iOS, Android, Raspberry Pi, ...` y prácticamente para cualquier otro que necesites.

Otra de sus principales características es que es una **aplicación totalmente modular** que puedes adaptar a tu medida. No sólo porque tiene temas para cambiar su interfaz, sino porque también tiene un sistema de add-ons con los que añadirle diferentes tipos de funcionalidades según cuales sean tus características. 

Estos **add-ons** te permiten por ejemplo poder ver en Kodi diferentes *canales de televisión a través de Internet, mostrar predicciones metereológicas, o bien conectarte a servicios como TVHeadend, Plex, SoundCloud o YouTube*.

En el momento de escribir esta entrada la **versión estable** es la **19.0** denominada **Matrix**, y en el repositorio oficial de **Debian 10** la **versión estable** que se dispone es **Kodi 17.6**, si quieres actualizar dicha versión surgen diversas alternativas, en esta entrada lo que pretendo es explicar la más sencilla y funcional:

 * [Compilar desde repositorio oficial Kodi](https://github.com/xbmc/xbmc/blob/master/docs/README.Linux.md){: .btn .btn--danger .btn--small}{:target="_blank"} No recomendada para gente sin experiencia en compilar código fuente.
 * [Repositorios adicionales Ubuntu](https://kodi.wiki/view/HOW-TO:Install_Kodi_for_Linux#Installing_Kodi_on_Ubuntu-based_distributions){: .btn .btn--warning .btn--small}{:target="_blank"} No la recomiendo por posibles conflictos en el sistema y librerías.
 * `Dockerizar Kodi`: La forma más sencilla y limpia de disfrutar de las novedades **(Opción recomendada)**. 

**NOTA**: Comentar que el docker seleccionado no soporta arquitecturas ARM (*working progress*) y se limita el uso a procesadores PC 64bits.
{: .notice--info}

Comenzamos instalado un bash script que se encargara de preparar un entorno gráfico, para lanzar el docker en el sistema llamado [x11docker](https://github.com/mviereck/x11docker/){: .btn .btn--warning .btn--small}{:target="_blank"}

```bash
curl -fsSL https://raw.githubusercontent.com/mviereck/x11docker/master/x11docker | sudo bash -s -- --update
```

Características opcionales `x11docker`:
 * Aceleración de hardware por GPU OpenGL
 * Salida sonido soporte Pulseaudio o ALSA
 * Compartir portapapeles
 * Acceso a la impresora
 * Acceso a webcam
 * Carpeta de inicio persistente
 * Soporte entornos Xorg y Wayland
 * Creación de configuración regional de idioma
 * Varios sistemas de inicio y DBus en contenedor

**NOTA**: Para actualizar el script *x11docker* ejecutamos `sudo x11docker --update`, en el momento de escribir la entrada la versión es la **6.8.0**
{: .notice--info}

Creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/kodi/config && \
cd $HOME/docker/kodi
```

Ahora vamos a crear un script lanzador de Kodi ejecutando el siguiente comando:

```bash
cat <<'EOF' >$HOME/docker/kodi/kodi.sh
#!/bin/bash
#
# https://lordpedal.gitlab.io
# Another fine release by Lordpedal
#
x11docker --xorg \
          --pulseaudio \
          --gpu \
          --network \
          --home=$HOME/docker/kodi/config \
          -- -v /media/raidnas/Descargas:/media:ro -- \
          erichough/kodi
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `--xorg` | Habilita acceso servidor gráfico `X.Org X`, **opción alternativa** `Wayland` |
| `--pulseaudio` | Habilita salida audio `Pulseaudio`, **opción alternativa** `ALSA` |
| `--gpu` | Habilita la `acceleración de video OpenGL` |
| `--network` | Habilita acceso a la red `Internet` |
| `--home=$HOME/docker/kodi/config` | Ruta donde almacena `configuración del docker Kodi` |
| `-- -v /media/raidnas/Descargas:/media:ro --` | Ruta acceso solo lectura `contenido multimedia local`, **debes de modificar la variable /media/raidnas/Descargas por la ruta de tu sistema** |
{: .notice--warning}

Tras haber modificado el lanzador con la ruta de nuestro contenido multimedia, damos privilegios de ejecución al script:

```bash
chmod +x $HOME/docker/kodi/kodi.sh
```

Generamos un enlace simbolico para actuar de lanzador:

```bash
sudo ln -s $HOME/docker/kodi/kodi.sh \
/usr/local/bin/dockerkodi
```

Lanzamos la aplicación:

```bash
dockerkodi
```

**NOTA**: Comentar que el docker se inicia al ejecutar el script y se detiene al salir de la aplicación, no se queda en ejecución de segundo plano ahorrando recursos.
{: .notice--info}

Si es la primera ejecución al no encontrar el docker creado nos preguntara si deseamos construirlo, respondemos con la tecla **`Y`** para continuar, dejo un ejemplo de ejecución:

```bash
Image erichough/kodi not found locally.
Do you want to pull it from docker hub?
(timeout after 60s assuming no) [Y|n]: Y

x11docker note: Pulling image 'erichough/kodi' from docker hub
Using default tag: latest
latest: Pulling from erichough/kodi
83ee3a23efb7: Pull complete
db98fc6f11f0: Pull complete
f611acd52c6c: Pull complete
4b3e4a4ee00d: Pull complete
95ebc55a8959: Pull complete
9403378b9f9a: Pull complete
Digest: sha256:f68c635adc43962de4df2f82b99e1b9fedb736c37d83635c1517b31169ad5ec9
Status: Downloaded newer image for erichough/kodi:latest
docker.io/erichough/kodi:latest
```

Tras finalizar este apartado se ejecutara Kodi y nos saldra un asistente en pantalla por si queremos configurar/habilitar plugins adicionales.

**NOTA**: Recordar que en la ruta `$HOME/docker/kodi/config` encontramos la ruta $HOME de Kodi, por si surge la necesidad de añadir plugins/roms/ ....
{: .notice--info}

> Y listo!
