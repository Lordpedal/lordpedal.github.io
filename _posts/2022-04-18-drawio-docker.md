---
title:  "draw.io: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2022-04-18 12:30:00
last_modified_at: 2022-04-18T13:00:00
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
[draw.io](https://drawio-app.com/){: .btn .btn--warning .btn--small}{:target="_blank"} s una herramienta de creación y edición de diagramas libre que permite la integración con diversas plataformas.

Es una herramienta que en principio puede estar pensada para uso profesional, pero realmente se puede usar si se tiene un nivel de destrezas mínimas. Simple, sencilla e intuitiva. Sus principales ventajas son:

	* **Integración**: se puede utilizar en versión online o de escritorio. En versiones online se puede vincular a diferentes cuentas y guardar los trabajos en sistemas de almacenamiento en la nube.
	* **Plantillas y librerías**: tanto para profes como para alumnos los inicios a veces son duros, por lo que la herramienta dispone de una serie de plantillas organizadas por tipos que hacen el trabajo más sencillo y más rápido.
	* **Sencillez de uso**: la interfaz de Draw.io es sencilla, cuenta con las herramientas básicas para poder desarrollar la experiencia, lo que facilita la utilización.
	* **Compartir y cooperar**: Creando archivos que pueden ser editados por varias personas al mismo tiempo y que permite publicar o compartir cualquier archivo a través de un link.

En esta entrada vamos a centrarnos en crear un servidor propio de diseño como siempre de forma sencilla.

## Instalación

Vamos a realizar unos pasos previos para preparar el entorno, para ello en primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/drawio && \
cd $HOME/docker/drawio
```

Ahora llega el turno de crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/drawio/docker-compose.yml
version: '3'
services:
  drawio:
    image: jgraph/drawio:latest
    container_name: DrawIO
    ports:
      - 8992:8080
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080 || exit 1"]
      interval: 1m30s
      timeout: 10s
      retries: 5
      start_period: 10s
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8992:8080` | Puerto de comunicación público **SERVIDOR** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos el servicio para ser configurado y ejecutado:

```bash
docker-compose up -d
```

En mi caso, el servicio estaría disponible en la dirección web [http://192.168.1.90:8992](http://localhost:8992){: .btn .btn--inverse .btn--small}{:target="_blank"}

### Nginx Proxy Manager

Configuramos dominios y certificados:

<figure>
    <a href="/assets/images/posts/drawio.png"><img src="/assets/images/posts/drawio.png"></a>
</figure>

<div class="lordvideo">
   <video  style="display:block; width:100%; height:auto;" controls loop="loop">
       <source src="{{ site.baseurl }}/assets/videos/npm05.mp4" type="video/mp4" />
   </video>
</div>

#### Guías

En la web oficial se incluyen unas [guías de aprendizaje](https://drawio-app.com/tutorials/){: .btn .btn--info .btn--small}{:target="_blank"} bastante sencillas que recomiendo revisar.

> Y listo!
