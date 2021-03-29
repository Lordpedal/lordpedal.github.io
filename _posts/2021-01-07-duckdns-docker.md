---
title:  "DuckDNS: Docker"
date:   2021-01-07 15:30:00
last_modified_at: 2021-03-29T15:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Servidor
  - Debian
  - Docker
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
[DuckDNS](https://www.duckdns.org/){:target="_blank"} un servicio DDNS (DNS dinámico) diseñado para convertir nuestra dirección IP pública, complicada de recordar, en un dominio mucho más sencillo de recordar y, además, mantenerlo siempre actualizado de manera que podamos estar seguros de que la conexión con nuestra red está siempre garantizada, incluso aunque tengamos IP dinámica.

Este servicio nos permite crear hasta 5 dominios DDNS totalmente gratuitos con una cuenta.

Anteriormente [ya vimos de configurar **DuckDNS en el Servidor**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/#configurando-dns-p%C3%BAblica){:target="_blank"}, aunque ahora lo dejo como servicio Docker para realizar la actualización de IP.
{: .notice--info}

**NOTA**: El token de referencia del post no tiene validez, haz de usar tu propio bot u otro token conocido.
{: .notice--info}

Vamos a realizar unos pasos previos para preparar el entorno. 

En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/duckdns && \
cd $HOME/docker/duckdns
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/duckdns/docker-compose.yml
version: "2.1"
services:
  duckdns:
    image: ghcr.io/linuxserver/duckdns
    container_name: DuckDNS
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
      - SUBDOMAINS=lordpedal
      - TOKEN=9e84bbbc-9a63-4f11-b42b-66f2c1f721cf
      - LOG_FILE=true
    volumes:
      - ~/docker/duckdns:/config
    restart: always
EOF
```

**FIX ARM 32bits**: [Bug: libsecccomp](https://docs.linuxserver.io/faq#libseccomp){: .btn .btn--info .btn--small}{:target="_blank"} - *Gracias Sensineger por el aviso*
{: .notice--danger}

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `SUBDOMAINS=lordpedal` | Subdominio/s creados con la cuenta de usuario, en caso de disponer multiples, por *ejemplo* 3 sería: `SUBDOMAINS=lordpedal,overclock,overspeed` |
| `TOKEN=9e84bbbc-9a63-4f11-b42b-66f2c1f721cf` | Token de cuenta Duck DNS que obtenemos al registrar subdominios |
| `LOG_FILE=true` | Habilitamos la creación del LOG de ejecución **duck.log** |
| `~/docker/duckdns:/config` | Ruta donde almacenaremos el `LOG de ejecución` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras haber lanzado el comando, ya tendriamos el servicio disponible. 

Para comprobar el correcto funcionamiento, revisamos el log que se crea y actualiza cada `5min`:

```bash
pi@overclock:~/docker/duckdns$ ls
docker-compose.yml  duck.log
pi@overclock:~/docker/duckdns$ cat duck.log
Your IP was updated at Thu Jan 6 18:25:07 CET 2021
```

> Y listo!
