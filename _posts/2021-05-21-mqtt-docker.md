---
title:  "MQTT: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2021-05-21 22:30:00
last_modified_at: 2021-05-21T22:45:00
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
[MQTT](https://mosquitto.org/){: .btn .btn--warning .btn--small}{:target="_blank"} (**M**essage **Q**ueue **T**elemetry **T**ransport) es un protocolo diseñado por IBM destinado a mejorar la conectividad **M2M** (*Machine to machine*)..

Los mensajes a enviar o a los que suscribirse se clasifican según su asunto (**topic**) gracias a un **Broker** (un *servidor mqtt específico*).

Los elementos que se conecten al servicio tienen la libertad de emitir mensajes con el topic en cuestión. El resto de terminales se pueden suscribir al topic para recibir los mensajes correspondientes.

Si quieres conocer en profundidad el protocolo, te invito a consultar esta entrada de un blog muy recomendado [Luis Llamas: MQTT](https://www.luisllamas.es/que-es-mqtt-su-importancia-como-protocolo-iot/){: .btn .btn--info .btn--small}{:target="_blank"}

En caso de seguir interesado, vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/mqtt/{config,data,log} && \
cd $HOME/docker/mqtt
```

A continuación creamos el fichero de configuración, en nuestro caso hemos optado a usarlo de forma libre en la red interna sin credenciales de usuario:

```bash
cat << EOF > $HOME/docker/mqtt/config/mosquitto.conf
allow_anonymous true
listener 1883
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
EOF
```

Configuradas las variables podemos crear el servicio lanzando el siguiente comando:

```bash
docker run -d \
--name=MQTT \
-v $HOME/docker/mqtt/config:/mosquitto/config \
-v $HOME/docker/mqtt/data:/mosquitto/data \
-v $HOME/docker/mqtt/log:/mosquitto/log \
-p 1883:1883 \
--restart=always \
eclipse-mosquitto
```

Vamos a repasar los principales parámetros que hemos lanzado:

| Parámetro | Función |
| ------ | ------ |
| `-v $HOME/docker/mqtt/config:/mosquitto/config` | Ruta donde almacena la **configuración** |
| `-v $HOME/docker/mqtt/data:/mosquitto/data` | Ruta donde almacena la **base datos** |
| `-v $HOME/docker/mqtt/log:/mosquitto/log` | Ruta donde almacena las **consultas** |
| `-p 1883:1883` | Puerto de escucha broker `:1883` |
| `restart=always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Tras ello, ya tendremos nuestro servidor MQTT disponible, en mi caso la ruta [192.168.1.90:1883](localhost:1883){: .btn .btn--inverse .btn--small}{:target="_blank"}

> Y listo!
