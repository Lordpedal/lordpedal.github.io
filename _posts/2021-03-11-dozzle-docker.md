---
title:  "Dozzle: Docker"
date:   2021-03-11 23:30:00
last_modified_at: 2021-03-11T23:45:00
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
[Dozzle](https://dozzle.dev/){: .btn .btn--warning .btn--small}{:target="_blank"} es un visor de registros en tiempo real para contenedores `Docker`.

**Dozzle** es una aplicación simple y liviana que le brinda una interfaz basada en web para monitorear los registros de los contenedores *Docker en tiempo real*. 

No almacena información de registro, es solo para el monitoreo en vivo de los registros de su contenedor.

Desarrollado en `Go` es un contenedor liviano y funcional, pensado con el objetivo de mantenerse simple, pequeño y gratuito.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/dozzle && \
cd $HOME/docker/dozzle
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/dozzle/docker-compose.yml
version: '2'
services:
  dozzle:
    image: amir20/dozzle:latest
    container_name: Dozzle
    ports:
      - 8880:8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `8880:8080` | Puerto de acceso interfaz Web |
| `/var/run/docker.sock:/var/run/docker.sock` | Ruta donde lee la configuración Dockers |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:8880](http://localhost:8880){: .btn .btn--inverse .btn--small}{:target="_blank"}. 

<figure>
    <a href="/assets/images/posts/dozzle1.jpg"><img src="/assets/images/posts/dozzle1.jpg"></a>
</figure>

Haciendo clic en el docker de ejecución, vemos el `log` en tiempo real:

<figure>
    <a href="/assets/images/posts/dozzle2.jpg"><img src="/assets/images/posts/dozzle2.jpg"></a>
</figure>

Y podremos descarga el `log` para poder analizarlo a posterior:

<figure>
    <a href="/assets/images/posts/dozzle3.jpg"><img src="/assets/images/posts/dozzle3.jpg"></a>
</figure>

> Y listo!
