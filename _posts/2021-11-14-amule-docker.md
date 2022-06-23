---
title:  "aMule: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-11-14 21:30:00
last_modified_at: 2022-06-23T14:30:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
toc: false
toc_sticky: false
toc_label: "Secciones"
toc_icon: "cog"
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
[aMule](https://amule.org/){: .btn .btn--warning .btn--small}{:target="_blank"} es un programa de intercambio de redes P2P, libre y multiplataforma.

La versión más conocidad en la comunidad es eMule, pero su desarrollo esta limitado a Microsoft Windows.

Al igual que él, funciona tanto en la **red eDonkey ed2k** como en la **red Kademlia**.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/amule/{config,descargas,temporal} && \
cd $HOME/docker/amule
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/amule/docker-compose.yml
version: "2.1"
services:
  amule:
    image: ngosang/amule
    container_name: aMule
    environment:
      - TZ=Europe/Madrid
      - PUID=1000
      - PGID=1000
      - GUI_PWD=lordpedal
      - WEBUI_PWD=lordpedal
      - MOD_AUTO_RESTART_ENABLED=true
      - MOD_AUTO_RESTART_CRON=0 6 * * *
      - MOD_FIX_KAD_GRAPH_ENABLED=true
    ports:
      - "4711:4711"
      - "4712:4712"
      - "4662:4662"
      - "4665:4665/udp"
      - "4672:4672/udp"
    volumes:
      - '~/docker/amule/config:/home/amule/.aMule'
      - '~/docker/amule/descargas:/incoming'
      - '~/docker/amule/temporal:/temp'
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `GUI_PWD=lordpedal` | Contraseña de acceso a la interfaz Web `:4711` |
| `WEBUI_PWD=lordpedal` | Contraseña de gestión terminal `:4712` |
| `MOD_AUTO_RESTART_ENABLED=true` | Habilita el reinicio de la aplicación |
| `MOD_AUTO_RESTART_CRON=0 6 * * *` | Activa el reinicio todos los días a las `6am` |
| `MOD_FIX_KAD_GRAPH_ENABLED=true` | Corrige un `bug` en gráficos de red KAD |
| `4711:4711` | Puerto de acceso interfaz Web `:4711` |
| `4712:4712` | Puerto de acceso gestión terminal `:4712` |
| `4662:4662` | Puerto de acceso red Edonkey **ed2k**, para mejorar ratios de descarga se tiene que abrir acceso en el router (TCP) |
| `4665:4665/udp` | Puerto de busqueda contenido red Edonkey **ed2k**, para mejorar ratios de consulta se tiene que abrir acceso en el router (UDP) |
| `4672:4672/udp` | Puerto de acceso red Kademlia **KAD**, para mejorar ratios de descarga se tiene que abrir acceso en el router (UDP) |
| `~/docker/amule/config:/home/amule/.aMule` | Ruta donde almacena la **configuración** |
| `~/docker/amule/descargas:/incoming` | Ruta donde almacena **descargas completadas** |
| `~/docker/amule/temporal:/temp` | Ruta donde almacena **descargas parciales/incompletas** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos nuevamente el servicio para ser reconfigurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:4711](http://localhost:4711){: .btn .btn--inverse .btn--small}{:target="_blank"}

NOTA: Importante añadir servidores [servidores ed2k](https://www.emule-security.org/serverlist/){:target="_blank"}.
{: .notice--info}

<figure class="half">
    <a href="/assets/images/posts/amule01.jpg"><img src="/assets/images/posts/amule01.jpg"></a>
    <a href="/assets/images/posts/amule02.jpg"><img src="/assets/images/posts/amule02.jpg"></a>
</figure>

> Y listo!
