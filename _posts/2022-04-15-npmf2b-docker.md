---
title:  "NPM Fail2Ban Addon: Docker"
header:
  image: /assets/images/posts/dockertt.gif
date:   2022-04-15 16:30:00
last_modified_at: 2022-04-15T18:00:00
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
[NPM](https://lordpedal.github.io/gnu/linux/docker/npm-docker/){: .btn .btn--warning .btn--small}{:target="_blank"} vimos que es un proxy inverso y sobre dicha base vamos a trabajar esta entrada.

Lo que vamos a realizar es la integración de [**Fail2ban**](https://lordpedal.github.io/gnu/linux/debian-11-servidor/#fail2ban){:target="_blank"} mediante un docker sobre NPM, para poder bloquear usos abusivos de nuestros microservicios.

## Instalación

### ID Telegram + Token BOT

[Requisito obligatorio tener datos notificación **Telegram**](https://lordpedal.github.io/gnu/linux/debian-11-servidor/#lordpedal-bot){: .btn .btn--info}{:target="_blank"}

### NPM

[Requisito obligatorio tener instalado **Docker: NPM**](https://lordpedal.github.io/gnu/linux/docker/npm-docker/){: .btn .btn--warning}{:target="_blank"}

### Fail2ban Addon

Vamos a tomar la base de configuración del docker de NPM para configurar el addon. En primer nos dirigimos a la ruta donde alojamos el proyecto:

```bash
cd $HOME/docker/npm
```

Hacemos un backup del fichero de configuración:

```bash
cp docker-compose.yml docker-compose.old
```

Creamos las carpetas adicionales del proyecto:

```bash
mkdir -p $HOME/docker/npm/fail2ban/{action.d,db,filter.d,jail.d}
```

#### Acción Fail2ban

Creamos el fichero acción de configuración:

```bash
nano $HOME/docker/npm/fail2ban/action.d/telegram.conf
```

Y le añadimos el siguiente contenido:

```bash
# Fail2Ban configuration file
#
# Author: Lordpedal
#

[Definition]

# Option:  actionstart
# Notes.:  command executed once at the start of Fail2Ban.
# Values:  CMD
#
actionstart = /data/action.d/fail2ban-telegram.sh start 

# Option:  actionstop
# Notes.:  command executed once at the end of Fail2Ban
# Values:  CMD
#
actionstop = /data/action.d/fail2ban-telegram.sh stop

# Option:  actioncheck
# Notes.:  command executed once before each actionban command
# Values:  CMD
#
actioncheck = 

# Option:  actionban
# Notes.:  command executed when banning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:    See jail.conf(5) man page
# Values:  CMD
#
actionban = /data/action.d/fail2ban-telegram.sh ban <ip>

# Option:  actionunban
# Notes.:  command executed when unbanning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:    See jail.conf(5) man page
# Values:  CMD
#
actionunban = /data/action.d/fail2ban-telegram.sh unban <ip>

[Init]

name = npm-docker
init = 21121981
```

Creamos el script de notificación:

```bash
nano  $HOME/docker/npm/fail2ban/action.d/fail2ban-telegram.sh
```

Y le añadimos el siguiente contenido:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
while true
do
    if ping -c 1 -W 3 google.com 1>/dev/null 2>&1
    then
        echo ""
        break
    else
        echo ""
    fi
    sleep 1
done
# Opciones ejecucion
info=`hostname -f`
function show_uso {
  echo "NPM2ban Telegram by Lordpedal"
  echo ""
  echo "Usar: $0 opcion <ip>"
  echo ""
  echo "Opcion: start      (Inicia notificaciones)"
  echo "        stop       (Detiene notificaciones)"
  echo "        ban <ip>   (Banea IP especificada) Ej: ban 192.168.1.2"
  echo "        unban <ip> (Desbanea IP especificada) Ej: unban 192.168.1.2"
  echo ""
  exit
}

# Notificacion
function send_msg {
  # ID Telegram
  telegram=79593223
  # Enlace BOT (Cambiar Token 289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA)
  url="https://api.telegram.org/bot289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA/sendMessage"
  # Envia mensaje
  curl -s -X POST $url -d chat_id=$telegram -d text="$1"
  exit
}

# Chequea argumentos de script
if [ $# -lt 1 ]
then
  show_uso
fi

# Ejecuta una accion depende del argumento
if [ $# -lt 1 ]
then
  show_uso
fi

# Ejecuta una accion depende del argumento
if [ "$1" = 'start' ]
then
  msg="Seguridad+NPM2ban+ha+sido+iniciada+en+el+host+$info"
  send_msg $msg
elif [ "$1" = 'stop' ]
then
  msg="Seguridad+NPM2ban+ha+sido+detenida+en+el+host+$info"
  send_msg $msg
elif [ "$1" = 'ban' ]
then
  msg=$([ "$2" != '' ] && echo "Seguridad+NPM2ban+ha+baneado+a+$2+en+el+host+$info" || echo "Seguridad+NPM2ban+ha+baneado+una+ip+en+el+host+$info" )
  send_msg $msg
elif [ "$1" = 'unban' ]
then
  msg=$([ "$2" != '' ] && echo "Seguridad+NPM2ban+ha+desbaneado+a+$2+en+el+host+$info" || echo "Seguridad+NPM2ban+ha+desbaneado+una+ip+en+el+host+$info" )
  send_msg $msg
else
  show_uso
fi
```

Recuerda que debes de cambiar los parametros del ID Telegram + Token BOT
{: .notice--info}

Y le otorgamos permisos de ejecución:

```bash
chmod +x $HOME/docker/npm/fail2ban/action.d/fail2ban-telegram.sh
```

#### Filtro Fail2ban

Definimos el filtro de consulta en los logs para que se ejecute la protección:

```bash
nano $HOME/docker/npm/fail2ban/filter.d/npm-docker.conf
```

Y le añadimos el siguiente contenido:

```bash
[INCLUDES]

[Definition]

failregex = ^<HOST>.+" (4\d\d|3\d\d) (\d\d\d|\d) .+$
            ^.+ 4\d\d \d\d\d - .+ \[Client <HOST>\] \[Length .+\] ".+" .+$

ignoreregex =
```

#### Reglas Fail2ban

Para que Fail2ban nos proteja tenemos que definir unas variables de sistema, en dichas variables por ejemplo le decimos que no bloquee consultas de nuestra red local, el nº máximo de intentos, el tiempo de baneo, ...

Para ello creamos la siguiente regla:

```bash
nano $HOME/docker/npm/fail2ban/jail.d/npm-docker.local
```

Y le añadimos el siguiente contenido:

```bash
[npm-docker]
enabled = true
ignoreip = 127.0.0.1/8 192.168.1.0/24
action = telegram
chain = INPUT
port = http,https
logpath = /log/npm/default-host_access.log
          /log/npm/proxy-host-*_access.log
          /log/npm/proxy-host-*_error.log
maxretry = 3
bantime  = 3600
findtime = 86400
```

Recuerda que en caso de usar una red en otro rango diferente a 192.168.1.0/24 cambiarla. Como por ejemplo 192.168.0.0/24
{: .notice--info}

#### Upgrade docker-compose

Definimos un upgrade del mismo con las nuevas variables:

```bash
cat << EOF >> $HOME/docker/npm/docker-compose.yml

  fail2ban:
    image: crazymax/fail2ban:latest
    container_name: NPM2BAN
    network_mode: "host"
    cap_add:
      - NET_ADMIN
      - NET_RAW
    volumes:
      - './fail2ban:/data'
      - '/var/log/auth.log:/var/log/auth.log:ro'
      - './datos/logs/:/log/npm/:ro'
    environment:
      TZ: 'Europe/Madrid'
      F2B_LOG_TARGET: 'STDOUT'
      F2B_LOG_LEVEL: 'INFO'
      F2B_DB_PURGE_AGE: '1d'
    restart: always
EOF
```

Vamos a repasar los principales parámetros que hemos añadido sobre la anterior base, para poder adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `network_mode: host` | Habilitamos el uso de acceo a la red no virtualizada |
| `NET_ADMIN` | Habilitamos permisos de administrador |
| `NET_RAW` | Habilitamos persmisos de administrador de red |
| `TZ: Europe/Madrid` | Zona horaria `Europa/Madrid` |
| `F2B_LOG_TARGET: STDOUT` | Destino de consulta log |
| `F2B_LOG_LEVEL: INFO` | Nivel de información log |
| `F2B_DB_PURGE_AGE: 1d` | Limpieza baneos base datos |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, levantamos nuevamente el servicio para ser reconfigurado y ejecutado:

```bash
docker-compose up -d
```

<figure>
    <a href="/assets/images/posts/npmf2b.jpg"><img src="/assets/images/posts/npmf2b.jpg"></a>
</figure>

> Y listo!
