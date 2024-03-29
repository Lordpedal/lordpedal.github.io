---
title:  "Scrutiny: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-02-19 23:30:00
last_modified_at: 2022-10-16T23:45:00
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
[Scrutiny](https://github.com/AnalogJ/scrutiny){: .btn .btn--warning .btn--small}{:target="_blank"} es un `WebUI` para monitorear estado **S.M.A.R.T.** de nuestros medios de almacenamiento.

Hasta ahora para el monitoreado del servidor usaba el demonio `smartd`, pero no disponía de metricas online.

Scrutiny es una aplicación simple pero de uso enfocado especialmente en los servidores, desarrollada en **Go**. 

Entre otras, cuenta con las siguientes características principales:

- Panel de interfaz de usuario web: centrado en métricas críticas
- Integración smartd (sin reinventar la rueda)
- Detección automática de todos los discos duros conectados
- Seguimiento de métricas S.M.A.R.T para tendencias históricas
- Umbrales personalizados utilizando tasas de falla reales
- Seguimiento de temperatura
- Alertas / notificaciones configurables en el futuro a través de webhooks
- Prueba y seguimiento del rendimiento del disco duro *(en desarrollo)*

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/scrutiny/config && \
cd $HOME/docker/scrutiny
```

Ejecutamos en la terminal la siguiente orden para identificar los HD's que posteriormente anotaremos para editar el fichero docker-compose:

```bash
lsblk
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/scrutiny/docker-compose.yml
version: "2.1"
services:
  scrutiny:
    image: ghcr.io/analogj/scrutiny:master-omnibus
    container_name: Scrutiny
    cap_add:
      - SYS_RAWIO
    volumes:
     - '~/docker/scrutiny/config:/config'
     - /run/udev:/run/udev:ro
    ports:
      - 8088:8080
    devices:
      - /dev/sda:/dev/sda
      - /dev/sdb:/dev/sdb
      - /dev/sdc:/dev/sdc
      - /dev/sdd:/dev/sdd
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `~/docker/scrutiny/config:/config` | Ruta donde almacenaremos la configuración |
| `/run/udev:/run/udev:ro` | Ruta donde consultaremos los metadatos del sistema |
| `8088:8080` | Puerto gestión web `8088` |
| `/dev/sda:/dev/sda` | Monitorizar el HD `sda`, ejecutamos `lsblk` para listar HD's |
| `/dev/sdb:/dev/sdb` | Monitorizar el HD `sdb`, ejecutamos `lsblk` para listar HD's |
| `/dev/sdc:/dev/sdc` | Monitorizar el HD `sdc`, ejecutamos `lsblk` para listar HD's |
| `/dev/sdd:/dev/sdd` | Monitorizar el HD `sdd`, ejecutamos `lsblk` para listar HD's |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

A continuación entramos dentro del contenedor de imagen:

```bash
docker exec -it Scrutiny bash
```

Forzamos la ejecución del script que actualiza información sobre discos duros:

```bash
scrutiny-collector-metrics run
```

Ejemplo de ejecución en mi sistema:

```bash
pi@overclock:~/docker/scrutiny$ docker exec -it Scrutiny bash
root@2688892d1188:/# scrutiny-collector-metrics run
2021/02/18 20:07:14 No configuration file found at /scrutiny/config/collector.yaml. Using Defaults.

 ___   ___  ____  __  __  ____  ____  _  _  _  _
/ __) / __)(  _ \(  )(  )(_  _)(_  _)( \( )( \/ )
\__ \( (__  )   / )(__)(   )(   _)(_  )  (  \  /
(___/ \___)(_)\_)(______) (__) (____)(_)\_) (__)
AnalogJ/scrutiny/metrics                                dev-0.3.5

INFO[0000] Verifying required tools                      type=metrics
INFO[0000] Executing command: smartctl --scan -j         type=metrics
{
  "json_format_version": [
    1,
    0
  ],
  "smartctl": {
    "version": [
      7,
      1
    ],

	[...]

      }
    ],
    "reset": false
  }
}
INFO[0006] Publishing smartctl results for 0x5000039a3bc01274  type=metrics
INFO[0006] Main: Completed                               type=metrics
root@2688892d1188:/# exit
exit
pi@overclock:~/docker/scrutiny$
```

Tras ello, podremos consultar el servicio, que en mi caso estaría disponible en la dirección web [http://192.168.1.90:8088](http://localhost:8088){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/scrutiny.jpg"><img src="/assets/images/posts/scrutiny.jpg"></a>
</figure>

**NOTA:** Si queremos personalizar la notificación, editamos la configuración y reiniciamos el docker:
{: .notice--info}

```bash
nano $HOME/docker/scrutiny/config/scrutiny.yaml && \
docker restart Scrutiny
```

Para poder probar que la notificación ha sido debidamente configurada, podemos lanzar la siguente consulta: 

```bash
curl -X POST http://localhost:8088/api/health/notify
```

<figure>
    <a href="/assets/images/posts/scrutinybot.jpg"><img src="/assets/images/posts/scrutinybot.jpg"></a>
</figure>

> Y listo!
