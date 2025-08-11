---
title:  "OmniTools: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date: 2025-08-11 08:46:00
last_modified_at: 2025-08-11T09:01:00
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
[OmniTools](https://github.com/iib0011/omni-tools/){: .btn .btn--warning .btn--small}{:target="_blank"} es una aplicación web auto-hospedable que ofrece una enorme colección de herramientas útiles para tareas cotidianas, todo accesible desde tu navegador. Está diseñada para ser rápida, ligera y completamente privada: **no rastrea, no muestra anuncios y no envía datos a servidores externos**.

 - **Gran variedad de herramientas** tales como:
   - **Imágenes/Vídeos/PDFs:** Redimensionar, convertir, recortar, dividir, fusionar
   - **Texto y listas:** Cambiar mayúsculas/minúsculas, formatear, ordenar
   - **Fechas y tiempo:** Calculadoras de fechas, conversores de zonas horarias
   - **Matemáticas:** Generador de números primos, cálculos eléctricos
   - **Datos:** Herramientas para JSON, CSV, XML

Se complementa la perfección con [it-tools](https://lordpedal.github.io/gnu/linux/docker/ittools-docker/){: .btn .btn--inverse .btn--small}{:target="_blank"}

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/omnitools && \
cd $HOME/docker/omnitools
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/omnitools/docker-compose.yml
#version: '3'
services:
  omni-tools:
    image: iib0011/omni-tools:latest
    container_name: Omni-tools
    ports:
      - "1335:80"
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `1335:80` | Puerto de acceso **interfaz Web** `:1335` |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:1335](http://localhost:1335){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/omnitools.jpg"><img src="/assets/images/posts/omnitools.jpg"></a>
</figure>

> Y listo!
