---
title:  "Magnetico: Docker"
date:   2021-02-21 23:30:00
last_modified_at: 2021-02-21T23:45:00
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
[Magnetico](https://github.com/boramalper/magnetico){: .btn .btn--warning .btn--small}{:target="_blank"} es el primer conjunto de motores de búsqueda `DHT` *(BitTorrent)* autónomo, diseñado en lenguaje **Go**.

Entrando en materia, BitTorrent, es un protocolo de intercambio de archivos **P2P** distribuido, el cual ha sufrido durante mucho tiempo ha generado cierta controversia, debido el ataque a servidores de las que las personas dependían para buscar torrents (*sitios web*) y para descubrir otros pares (*rastreadores*). 

Con la introducción de `DHT` (*tabla hash distribuida*) eliminó la necesidad de rastreadores, permitiendo que los pares se descubrieran entre sí a través de otros pares y obtuvieran metadatos de los *leechers* y *seeders*.

Aprovechando la idea, se emplea el uso de `DHT` para generar un índice local, lo que a su vez elimina cualquier posibilidad de bloqueo.

Ahora, eso si `Magnetico` tiene algo negativo, ya que tener un índice local suena muy tentador, pero el **software no cuenta con filtros**, por lo tanto, el índice podría terminar indexando contenido controvertido.

La suite consta de dos aplicaciones:

- **magneticod**: Motor rastreador autónomo de BitTorrent y metadatos P2P
- **magneticow**: Interfaz web de magneticod

Ambos programas combinados, permiten que cualquier persona con una conexión a Internet decente (*durante la creación de tablas consume grandes recursos de Servidor y conexión*), pueda acceder a la gran cantidad de torrents que esperan ser descubiertos de la red sin depender de ningún servidor centralizado.

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/magnetico/{config,datos,web} && \
cd $HOME/docker/magnetico
```

Opcionalmente instalamos dependencias si posteriomente queremos proteger el acceso a `magneticow` con usuario y contraseña:

```bash
sudo apt-get update && \
sudo apt-get -y install apache2-utils
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/magnetico/docker-compose.yml
version: "2"
services:
  magneticod:
    image: boramalper/magneticod:latest
    container_name: Magneticod
    volumes:
      - '~/docker/magnetico/datos:/root/.local/share/magneticod'
      - '~/docker/magnetico/config:/root/.config/magneticod'
    network_mode: "host"
    restart: always
    command:
      - "--indexer-addr=0.0.0.0:1212"

  magneticow:
    image: boramalper/magneticow:latest
    container_name: Magneticow
    volumes:
      - '~/docker/magnetico/datos:/root/.local/share/magneticod'
      - '~/docker/magnetico/web:/root/.config/magneticow'
    ports:
      - "8889:8080"
    restart: always
    command:
      - "--no-auth"
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `~/docker/magnetico/datos:/root/.local/share/magneticod` | Ruta donde se almacena la base de datos (**+10Gb**) |
| `~/docker/magnetico/config:/root/.config/magneticod` | Ruta donde se almacena configuración |
| `~/docker/magnetico/web:/root/.config/magneticow` | Ruta donde se almacenan credenciales de acceso Web |
| `network_mode: host` | Habilitamos el uso de la red host en vez de una Virtual |
| `--indexer-addr=0.0.0.0:1212` | Parámetro de indexación `DHT` |
| `--no-auth` | Parámetro de credenciales Web, por defecto no habilitadas |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos consultar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:8889](http://localhost:8889){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/magnetico1.jpg"><img src="/assets/images/posts/magnetico1.jpg"></a>
</figure>

Podemos analizar las estadisticas de indexación desde la propia intefaz web, importante recordar que es un proceso que lleva bastante tiempo y que puede interesar usar el contenedor `magneticod` únicamente en horarios de menor uso de red, mientras que el `magneticow` este siempre disponible:

<figure>
    <a href="/assets/images/posts/magnetico2.jpg"><img src="/assets/images/posts/magnetico2.jpg"></a>
</figure>

**NOTA:** Si queremos proteger el acceso al contenedor web con usuario/contraseña, debemos de seguir los siguientes pasos:
{: .notice--info}

Primeramente generamos el fichero de credenciales definiendo un usuario y una contraseña, para el ejemplo **empalador/nocturno**

```bash
htpasswd -bnBC 12 "empalador" "nocturno" | && \
tee $HOME/docker/torrents/web/credentials
```

Editamos o regeneramos el fichero `docker-compose.yml` comentando las líneas de credenciales:

```
cat << EOF > $HOME/docker/magnetico/docker-compose.yml
version: "2"
services:
  magneticod:
    image: boramalper/magneticod:latest
    container_name: Magneticod
    volumes:
      - '~/docker/magnetico/datos:/root/.local/share/magneticod'
      - '~/docker/magnetico/config:/root/.config/magneticod'
    network_mode: "host"
    restart: always
    command:
      - "--indexer-addr=0.0.0.0:1212"

  magneticow:
    image: boramalper/magneticow:latest
    container_name: Magneticow
    volumes:
      - '~/docker/magnetico/datos:/root/.local/share/magneticod'
      - '~/docker/magnetico/web:/root/.config/magneticow'
    ports:
      - "8889:8080"
    restart: always
#    command:
#      - "--no-auth"
EOF
```

Y volvemos a lanzar el servicio:

```bash
docker-compose up -d
```

> Y listo!
