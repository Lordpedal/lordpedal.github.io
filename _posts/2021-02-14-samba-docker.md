---
title:  "Samba: Docker"
date:   2021-02-14 23:30:00
last_modified_at: 2021-02-14T23:45:00
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
Anteriormente ya vimos como *instalar/configurar* desde el gestor de paquetería de nuestra distribución **GNU/Linux**: [**Samba: APT**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/#samba){: .btn .btn--info}{:target="_blank"}

Te puede surgir la duda de cuando usar un metodo u otro, la lógica que se debe de aplicar es sencilla. 

Si **únicamente vas a compartir una ruta**, el metodo Docker es más limpio en cuanto a gestión del servidor, pero si quieres **compartir más de una ruta** mediante Samba en ese caso la opción de paquetería es la más acertada.

**NOTA**: No es compatible usar el protocolo de Samba desde Docker y Paquetería al mismo tiempo por compartir puertos de gestión.
{: .notice--warning}

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/samba/compartido && \
cd $HOME/docker/samba
```

A continuación debemos de darle permisos de escritura y lectura a la carpeta compartida:

```bash
chmod 777 -R $HOME/docker/samba/compartido
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/samba/docker-compose.yml
version: "2"
services:
  samba:
    image: lordpedal/samba
    container_name: Samba
    volumes:
      - '~/docker/samba/compartido:/lordpedal'
    ports:
      - "137:137"
      - "138:138"
      - "139:139"
      - "445:445"
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `~/docker/samba/compartido:/lordpedal` | Definimos ruta donde alojamos los ficheros compartidos |
| `137:137` | Puerto protocolo NetBios |
| `138:138` | Puerto protocolo NetBios |
| `139:139` | Puerto protocolo SMB |
| `445:445` | Puerto protocolo SMB |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

> Y listo!
