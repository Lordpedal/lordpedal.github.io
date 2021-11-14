---
title:  "EmulatorJS: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-11-15 21:30:00
last_modified_at: 2021-11-15T21:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
[EmulatorJS](https://github.com/linuxserver/emulatorjs){: .btn .btn--warning .btn--small}{:target="_blank"} es un fork de **NeptunJS**, una plataforma de emulación creada en **JavaScript**, que permite jugar con emuladores a través del navegador web.

**EmulatorJS** añade sobre **NeptunJS** una capa de gestión para añadir roms y poder realizar un servicio auto alojado.

Hasta el momento es capaz de emular unas **30 diferentes plataformas de juego** entre las que podemos destacar:

 * **Nintendo:** `Gameboy, NES, SNES, ...`
 * **Sega:** `Master System, Megadrive, ...`
 * **Arcade:** `Neogeo, ...`
 * **PSX1**
 * **DOOM**
 * **...**

Como veremos a posterior obtendremos dos interfaces web, la primera que incluye el apartado de configuración y la secundaria donde podremos jugar online. 

Un dato importante de este proyecto es que parte de la gestión de contenido multimedia esta alojado en la [red IPFS](https://lordpedal.github.io/gnu/linux/docker/ipfs-docker/){:target="_blank"}.

### Instalación

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/emulator/config && \
cd $HOME/docker/emulator
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/emulator/docker-compose.yml
version: "2.1"
services:
  emulatorjs:
    image: lscr.io/linuxserver/emulatorjs
    container_name: EmulatorJS
    environment:
      - TZ=Europe/Madrid
      - PUID=1000
      - PGID=1000
      - SUBFOLDER=/ # Proxys Inversos
    volumes:
      - '~/docker/emulator/config:/data'
    ports:
      - 3002:3000
      - 3001:80
      - 4001:4001 # Red IPFS
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `SUBFOLDER=/` | Parametro opcional subcarpeta de proxys inversos |
| `~/docker/emulator/config:/data` | Ruta donde almacena la **configuración** |
| `3002:3000` | Puerto de acceso **interfaz Web configuración** `:3002` |
| `3001:80` | Puerto de acceso **interfaz Web juego** `:3001` |
| `4001:4001` | Puerto de acceso red **IPFS** para compartir contenido *(parametro opcional)* |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

### Configuración

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:3002](http://localhost:3002){: .btn .btn--inverse .btn--small}{:target="_blank"}

#### Contenido adicional **(REQUERIDO)**

Al iniciar veremos que nos solicita descargar contenido adicional multimedia y nos crea la estructura de carpetas que usaremos a posterior.

Tan solo debemos de hacer clic en el boton **Download**:

<figure class="third">
    <a href="/assets/images/posts/retrodock01.png"><img src="/assets/images/posts/retrodock01.png"></a>
    <a href="/assets/images/posts/retrodock02.png"><img src="/assets/images/posts/retrodock02.png"></a>
    <a href="/assets/images/posts/retrodock03.png"><img src="/assets/images/posts/retrodock03.png"></a>
</figure>

Cuando finaliza el proceso somos notificados que no se incluye ninguna rom de juego por motivos legales, teclas de función, ...

#### Personalización interfaz **(OPCIONAL)**

Podremos personalizar la intefaz de ejecución de emuladores y como se visualizaran cada uno de ellos:

<figure class="half">
    <a href="/assets/images/posts/retrodock04.png"><img src="/assets/images/posts/retrodock04.png"></a>
    <a href="/assets/images/posts/retrodock05.png"><img src="/assets/images/posts/retrodock05.png"></a>
</figure>

#### Añadir ROM´s **(REQUERIDO)**

Con posibilidad de arrastrar y soltar para añadir contenido, aprovechamos para incluir el contenido en el emulador que vayamos a usar:

<figure class="third">
    <a href="/assets/images/posts/retrodock06.png"><img src="/assets/images/posts/retrodock06.png"></a>
    <a href="/assets/images/posts/retrodock07.png"><img src="/assets/images/posts/retrodock07.png"></a>
    <a href="/assets/images/posts/retrodock08.png"><img src="/assets/images/posts/retrodock08.png"></a>
</figure>

#### Configurando ROM´s **(REQUERIDO)**

El sistema detecta la rom añadida pero ha de escanearla para anexarla debidamente:

<figure class="third">
    <a href="/assets/images/posts/retrodock09.png"><img src="/assets/images/posts/retrodock09.png"></a>
    <a href="/assets/images/posts/retrodock10.png"><img src="/assets/images/posts/retrodock10.png"></a>
    <a href="/assets/images/posts/retrodock11.png"><img src="/assets/images/posts/retrodock11.png"></a>
</figure>

En el caso del ejemplo no ha identificado la versión exacta, vamos a definirla manualmente:

<figure class="half">
    <a href="/assets/images/posts/retrodock12.png"><img src="/assets/images/posts/retrodock12.png"></a>
    <a href="/assets/images/posts/retrodock13.png"><img src="/assets/images/posts/retrodock13.png"></a>
</figure>

Una vez identificada correctamente falta añadir el multimedia y la rom al sistema para poder disfrutarla:

<figure class="third">
    <a href="/assets/images/posts/retrodock14.png"><img src="/assets/images/posts/retrodock14.png"></a>
    <a href="/assets/images/posts/retrodock15.png"><img src="/assets/images/posts/retrodock15.png"></a>
    <a href="/assets/images/posts/retrodock16.png"><img src="/assets/images/posts/retrodock16.png"></a>
</figure>

### Entretenimiento

Con el sistema ya debidamente configurado, ahora toca el turno de jugar, para ello navegamos hacía la dirección web [http://192.168.1.90:3001](http://localhost:3001){: .btn .btn--inverse .btn--small}{:target="_blank"} en mi caso.

<figure>
    <a href="/assets/images/posts/retrodock17.png"><img src="/assets/images/posts/retrodock17.png"></a>
</figure>

> Y listo!
