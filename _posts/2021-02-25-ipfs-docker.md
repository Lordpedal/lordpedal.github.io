---
title:  "IPFS: Docker"
date:   2021-02-25 23:30:00
last_modified_at: 2021-02-25T23:45:00
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
[IPFS](https://ipfs.io){: .btn .btn--warning .btn--small}{:target="_blank"} es un protocolo `P2P` diseñado para hacer que la Web sea más rápida, segura y abierta.

Las siglas `IPFS` proviene de **InterPlanetary File System**, el cual es un nuevo protocolo de internet que renueva los demás protocolos ofreciendo una respuesta a todo, como alternativa sobre **HTTP**.

Este nuevo protocolo aún se encuentra en su etapa prematura de desarrollo (*Alpha*), y no brinda demasiadas posibilidades a nivel técnico, a pesar de ello, el protocolo funciona y facilita un seriado de guias y casos prácticos para así tener una toma de contacto con él.

El protocolo surge en el año *2014*, inicialemtne basando su desarrollo en el **Blockchain de Bitcoin**.

Las diferencias fundamentales entre el protocolo actualmente más extendido (HTTP) y el IPFS se puede ver en la siguiente comparativa, especialmente cuando lanzamos una consulta: 

![IPFS]({{ site.url }}{{ site.baseurl }}/assets/images/posts/ipfshttp.png){: .align-center}
{: .full}

IPFS proporciona distribución de datos de alto rendimiento y baja latencia. También es descentralizado y seguro. Se puede utilizar para enviar contenido a sitios web, almacenar archivos a nivel mundial con versiones y copias de seguridad automáticas, facilitar el intercambio seguro de archivos y la comunicación cifrada.

Algunos proyectos interesantes que se están construyendo bajo esta iniciativa son:

- [Akasha](https://akasha.world){: .btn .btn--primary .btn--small}{:target="_blank"} - Una red social de próxima generación
- [BlockFreight](https://blockfreight.com){: .btn .btn--primary .btn--small}{:target="_blank"} - Una red abierta para el transporte mundial de mercancías
- [Digix](https://digix.global){: .btn .btn--primary .btn--small}{:target="_blank"} - Una plataforma para tokenizar oro físico
- [Infura](https://infura.io){: .btn .btn--primary .btn--small}{:target="_blank"} - Un proveedor de infraestructura para DApps
- [Livepeer](https://livepeer.org){: .btn .btn--primary .btn--small}{:target="_blank"} - Una plataforma descentralizada de transmisión de video en vivo
- [Origen](https://www.originprotocol.com){: .btn .btn--primary .btn--small}{:target="_blank"} - Un mercado peer-to-peer para la economía colaborativa
- [uPort](https://www.uport.me){: .btn .btn--primary .btn--small}{:target="_blank"} - Un sistema de identidad auto-soberano

A pesar del impresionante rendimiento de IPFS, algunos problemas aún no se han resuelto por completo. En primer lugar, el direccionamiento de contenido en IPNS actualmente no es muy fácil de recordar. Un enlace IPNS típico se ve así:

[https://ipfs.fleek.co/ipfs/QmbKsfZSFNLdnxtPwHcZPWtWJLte413gHJWsx2vmbi8cq8](https://ipfs.fleek.co/ipfs/QmbKsfZSFNLdnxtPwHcZPWtWJLte413gHJWsx2vmbi8cq8){: .btn .btn--danger .btn--small}{:target="_blank"}

Pero también surgen alternativas de redirección, por ejemplo del enlace previo, una ruta más sencilla de recordar sería:

[https://lordpedal.on.fleek.co](https://lordpedal.on.fleek.co){: .btn .btn--success .btn--small}{:target="_blank"}

Si te apetece investigar sobre esta red, una forma sencilla es mediante Docker, para ello vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/ipfs/config && \
cd $HOME/docker/ipfs
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/ipfs/docker-compose.yml
version: "2.1"
services:
  ipfs:
    image: ghcr.io/linuxserver/ipfs
    container_name: IPFS
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - '~/docker/ipfs/config:/config'
    ports:
      - 1080:80
      - 4001:4001
      - 5001:5001
      - 2080:8080
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `PUID=1000` | UID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `PGID=1000` | GID de nuestro usuario. Para saber nuestro ID ejecutar en terminal: `id` |
| `TZ=Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `~/docker/ipfs/config:/config` | Ruta donde se almacena la configuración |
| `1080:80` | Puerto de gestión intefaz Web |
| `4001:4001` | Puerto para compartir contenido `P2P` |
| `5001:5001` | Puerto comunicación API: `Web UI + IPFS` |
| `2080:8080` | Puerto de puerta enlace para servir contenido IPFS  |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:1080](http://localhost:1080){: .btn .btn--inverse .btn--small}{:target="_blank"}. 

Durante el primer acceso veremos un error de comunicación en la interfaz:

<figure>
    <a href="/assets/images/posts/ipfs1.jpg"><img src="/assets/images/posts/ipfs1.jpg"></a>
</figure>

Definimos la **IP** (*192.168.1.90*) y el **puerto API** (*5001*) en nuestro servidor y hacemos clic sobre enviar:

<figure>
    <a href="/assets/images/posts/ipfs2.jpg"><img src="/assets/images/posts/ipfs2.jpg"></a>
</figure>

Nos saldra un emergente informando que ya estamos conectados a la red IPFS:

<figure>
    <a href="/assets/images/posts/ipfs3.jpg"><img src="/assets/images/posts/ipfs3.jpg"></a>
</figure>

En la pestaña de **Estado** podremos evaluar el rendimiento y consumo del servicio:

<figure>
    <a href="/assets/images/posts/ipfs4.jpg"><img src="/assets/images/posts/ipfs4.jpg"></a>
</figure>

En la pestaña **Archivos** añadimos el contenido a compartir mediante la red:

<figure>
    <a href="/assets/images/posts/ipfs5.jpg"><img src="/assets/images/posts/ipfs5.jpg"></a>
</figure>

En la pestaña **Explorar** podremos analizar como se estructuran los datos relacionando cada nodo:

<figure>
    <a href="/assets/images/posts/ipfs6.jpg"><img src="/assets/images/posts/ipfs6.jpg"></a>
</figure>

En la pestaña **Pares** descubrimos usuarios que estan interconectados a la red:

<figure>
    <a href="/assets/images/posts/ipfs7.jpg"><img src="/assets/images/posts/ipfs7.jpg"></a>
</figure>

En la pestaña **Configuración** podremos personalizar nuestra interacción:

<figure>
    <a href="/assets/images/posts/ipfs8.jpg"><img src="/assets/images/posts/ipfs8.jpg"></a>
</figure>

Como comentamos cuando analizamos el `docker-compose` vimos que para poder usar plenamente la red debiamos de abrir el puerto `4001` en nuestro sistema para exteriorizar el servicio:

<figure>
    <a href="/assets/images/posts/ipfs9.jpg"><img src="/assets/images/posts/ipfs9.jpg"></a>
</figure>

**NOTA**: Recomiendo encarecidamente revisar la documentación del proyecto se encuentra muy bien detallada en esta [guía](https://docs.ipfs.io/how-to/){: .btn .btn--inverse .btn--small}{:target="_blank"}, para poder completar la experiencia de esta red.
{: .notice--info}

> Y listo!
