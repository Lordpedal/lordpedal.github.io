---
title:  "dupeGuru: Docker"
date:   2021-04-07 22:30:00
last_modified_at: 2021-04-07T22:45:00
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
[dupeGuru](https://dupeguru.voltaicideas.net/){: .btn .btn--warning .btn--small}{:target="_blank"} es una herramienta que te permite detectar y eliminar los archivos duplicados del sistema.

`dupeGuru` es multiplataforma y dispone de versiones precompiladas para los principales **Sistemas Operativos**, es una aplicación desarrollado en **Python**.

Para empezar a utilizar dupeGuru sólo tenemos que elegir las carpetas que queremos analizar. 

Una vez seleccionadas, la aplicación comenzará a analizarlas y encontrará todas las coincidencias. 

En una ventana nos mostrará el nombre de los archivos duplicados, el tanto por ciento de coincidencia, dónde está ubicado y su tamaño. A partir de ahí, sólo tenemos que seleccionar aquellos que queramos borrar y mandarlos a la papelera de reciclaje.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/dupeguru/{config,papelera} && \
cd $HOME/docker/dupeguru
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/tubesync/docker-compose.yml
version: '2'
services:
  dupeguru:
    image: jlesage/dupeguru
    container_name: dupeGuru
    ports:
      - 5801:5800
    environment:
      - TZ=Europe/Madrid
      - PUID=1000
      - PGID=1000
    volumes:
      - '~/docker/dupeguru/config:/config:rw'
      - '/media/NAS/Descargas:/storage:rw'
      - '~/docker/dupeguru/papelera:/trash:rw'
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `5801:5800` | Puerto de acceso interfaz Web `:5801` |
| `~/docker/dupeguru/config:/config:rw` | Ruta donde almacena la **configuración** |
| `/media/NAS/Descargas:/storage:rw` | Ruta donde **busca duplicados** |
| `~/docker/dupeguru/papelera:/trash:rw` | Ruta que actuara de **papelera de reciclaje** |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:5801](http://localhost:5801){: .btn .btn--inverse .btn--small}{:target="_blank"}.

<figure>
    <a href="/assets/images/posts/dupeguru1.jpg"><img src="/assets/images/posts/dupeguru1.jpg"></a>
</figure>

Añadimos directorio `/storages` a la ruta definida para buscar duplicidades:

<figure>
    <a href="/assets/images/posts/dupeguru2.jpg"><img src="/assets/images/posts/dupeguru2.jpg"></a>
</figure>

Haccemos clic en `Scan` nos detallara de duplicidades encontradas:

<figure>
    <a href="/assets/images/posts/dupeguru3.jpg"><img src="/assets/images/posts/dupeguru3.jpg"></a>
</figure>

Entre las opciones de configuración del programa encontramos el soporte multi-idioma:

<figure>
    <a href="/assets/images/posts/dupeguru4.jpg"><img src="/assets/images/posts/dupeguru4.jpg"></a>
</figure>

Una vez configurado nuevo idioma, tendremos que reiniciar el contenedor:

```bash
docker-compose up restart
```
> Y listo!
