---
title:  "it-tools: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2025-08-11 08:45:00
last_modified_at: 2025-08-11T09:00:00
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
[IT-Tools](https://github.com/sharevb/it-tools/){: .btn .btn--warning .btn--small}{:target="_blank"} es una colección de herramientas web útiles para desarrolladores y profesionales de TI, empaquetadas como una aplicación web que puedes auto-hospedar fácilmente usando Docker.

 - **Herramientas útiles** como:
   - Generador de contraseñas
   - Conversor de código
   - Generador de códigos OTP
   - Constructor de consultas SQL
   - Analizador de JWT
   - ... y muchas más.
 - **Interfaz web moderna y fácil de usar**
 - **Código abierto bajo licencia GNU GPLv3**

Tiene la función de poder marcar tus herramientas favoritas para tener un acceso rápido a ellas.

Vamos a crear el servicio en nuestro servidor de forma sencilla.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/it-tools && \
cd $HOME/docker/it-tools
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/it-tools/docker-compose.yml
#version: '3'
services:
  it-tools:
    image: sharevb/it-tools:latest
    container_name: It-tools
    ports:
      - "1334:8080"
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `1334:8080` | Puerto de acceso **interfaz Web** `:1334` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:1334](http://localhost:1334){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/ittools.jpg"><img src="/assets/images/posts/ittools.jpg"></a>
</figure>

> Y listo!
