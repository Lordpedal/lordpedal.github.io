---
title:  "WOL: Bash Script"
date:   2020-10-14 12:15:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
Esta entrada voy a compartir un sencillo [Bash Script](https://es.wikipedia.org/wiki/Bash){:target="_blank"}, que nos va a permitir un encendido y notificación remota de nuestro [Servidor](https://lordpedal.github.io/gnu/linux/debian-10-servidor/){:target="_blank"} gracias a una RPi u otra placa SBC por ejemplo.

Para poder configurar el script tan solo has de editar las siguientes variables:

- `telegram`: Es el ID que te identifica en la red Telegram, si estableces una conversación con el bot [@lordpedalbot](https://t.me/Lordpedalbot){:target="_blank"} te dira cual es.
- `token`: Opcional, solamente si dispones de un bot propio y quieres usarlo cambia ese valor, en caso contrario no es necesario modificar la variable.
- `lordmac`: Dirección MAC tarjeta Red.
- `IPServidor`: Dirección IP del Servidor.

**NOTA**: El token de referencia del post no tiene validez, haz de usar tu propio bot u otro token conocido.
{: .notice--info}

## Wake On LAN

Este mini-tutorial se encuentra divido en dos secciones:

- `Configuración del Servidor`: Habilitar soporte de encendido remoto.
- `Configuración del cliente`: Script y automatización de encendido, en mi caso sera ejecutado desde una Raspberry Pi entre otros.

### Configuración del [Servidor](https://lordpedal.github.io/gnu/linux/debian-10-servidor/){:target="_blank"}

Creamos la carpeta de trabajo donde alojaremos el script, entramos en ella y satisfacemos dependencias del script:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
sudo apt-get update && \
sudo apt-get -y install ethtool
```

A continuación creamos el script:

```bash
nano mimac.sh
```

Añadimos el contenido del fichero:

```bash
#!/bin/bash
#
# https://lordpedal.gitlab.io
# Another fine release by Lordpedal
#
macs='/sys/class/net'
for nic in $( ls $macs )
do
ips=$(ip addr show $nic | grep -Po 'inet \K[\d.]+')
echo -e "\e[0;32mInterfaz $nic\e[0m \e[1;31m$ips\e[0m"
if grep -q up $macs/$nic/operstate; then
       echo -n '       '
       cat $macs/$nic/address
       sudo ethtool $nic | grep Wake-on
fi
done
```

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x mimac.sh
```

Vamos creamos un enlace simbólico a la ruta de ejecutables:

```bash
sudo ln -s $HOME/scripts/mimac.sh \
/usr/local/bin/mimac
```

A partir de este momento con ejecutar la orden mimac nos informara de la MAC, IP´s y soporte a Wake On Lan de las interfaces de red que tengamos en el sistema activas.

Adjunto ejemplo del comando en mi Servidor:

```bash
pi@overclock:~/scripts$ mimac
Interfaz br0 192.168.1.90
        00:01:02:03:04:05
Interfaz enp0s31f6
Interfaz enp5s0f0
        00:11:22:33:44:55
        Supports Wake-on: pumbg
        Wake-on: d
Interfaz enp5s0f1
Interfaz lo 127.0.0.1
Interfaz tun0 10.8.0.1
```

Interpretando los resultados observamos que la interfaz enp5s0f0:

- `Soporta Wake-on-Lan`: **pumbg**
- **No se encuentra habilitada**, Wake-on-Lan: d

Vamos a habilitar WOL en nuestra interfaz:

```bash
sudo ethtool -s enp5s0f0 wol g
```

Vuelvo a lanzar el script mimac para ver cambios en el Servidor:

```bash
pi@overclock:~/scripts$ mimac 
Interfaz br0 192.168.1.90
        00:01:02:03:04:05
Interfaz enp0s31f6
Interfaz enp5s0f0
        00:11:22:33:44:55
        Supports Wake-on: pumbg
        Wake-on: g
Interfaz enp5s0f1
Interfaz lo 127.0.0.1
Interfaz tun0 10.8.0.1
```

Interpretando los resultados observamos que la interfaz `enp5s0f0`:

- Soporta `Wake-on-Lan: pumbg`
- Se encuentra habilitada, `Wake-on-Lan: g`

Pero este cambio lo perderiamos si reiniciamos el Servidor, vamos a configurar rc.local para que lo cargue al inicio del sistema:

```bash
sudo nano /etc/rc.local
```

Y añadimos la siguiente orden `/sbin/ethtool -s enp5s0f0 wol g` antes de la orden **exit 0**, quedando de la siguiente forma. Importante :

```bash
# WOL
/sbin/ethtool -s enp5s0f0 wol g
# SALIR
exit 0
```

Guardamos el fichero, salimos del editor y hasta aquí tendriamos configurado el apartado del Servidor.

### Configuración del cliente

Desde la Raspberry Pi o desde otro sistema que usemos como cliente, creamos la carpeta de trabajo donde alojaremos el script, entramos en ella y satisfacemos dependencias del script:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
sudo apt-get update && \
sudo apt-get -y install wakeonlan
```

A continuación creamos el script:

```bash
nano wol.sh
```

Añadimos el contenido del fichero:

```bash
#!/bin/bash
#
# https://lordpedal.gitlab.io
# Another fine release by Lordpedal
#
# ID Telegram (Consulta @Lordpedalbot)
telegram=79593223
# BOT
token=289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA
url=https://api.telegram.org/bot$token
# MAC
lordmac=00:11:22:33:44:55
# Mensajes
serveron='Overclock Server esta ONLINE'
serveroff='Overclock Server esta OFFLINE - WakeOnLan enviado'
tiempoff='Tiempo de espera 5 minutos'
redoff='Overclock Server esta OFFLINE - Comprueba conexión Red'
# Variables trabajo
IPServidor=192.168.1.90
PING=`ping -s 1 -c 2 $IPServidor > /dev/null; echo $?`
PONG=`ping -s 1 -c 4 $IPServidor > /dev/null; echo $?`
# Comprueba variable temporal
if [ -f /tmp/lordpedalwol ]; then
        echo "No ejecutado protocolo WOL"
else
# Inicia secuencia
if [ $PING -eq 0 ];then
        echo -e "\e[0;32m$serveron\e[0m"
        elif [ $PING -eq 1 ];then
                # Firewall habilitamos UDP para envio paquete WOL
                sudo iptables -A OUTPUT -p udp -d 255.255.255.255 -j ACCEPT
                # Notifica viar Telegram
                /usr/bin/curl -s \
                        -o /dev/null \
                        -F chat_id="$telegram" \
                        -F text="$serveroff $(date +%H:%M)" \
                        $url/sendMessage
                # Enviar paquete WOL
                sudo wakeonlan $lordmac | echo -e "\e[1;31m$serveroff $(date +%H:%M)\e[0m"
                # Notificar via Telegram
                /usr/bin/curl -s \
                        -o /dev/null \
                        -F chat_id="$telegram" \
                        -F text="$tiempoff" \
                        $url/sendMessage
                # 5min espera Servidor
                sleep 5m | echo -e "\e[1;33m$tiempoff\e[0m"
                if [ $PONG -eq 0 ];then
                        echo -e "\e[0;32m$serveron - $(date +%H:%M)\e[0m"
                        # Notificar via Telegram
                        /usr/bin/curl -s \
                                -o /dev/null \
                                -F chat_id="$telegram" \
                                -F text="$serveron - $(date +%H:%M)" \
                                $url/sendMessage
                else
                        echo -e "\e[1;33m$redoff\e[0m"
                        # Notificar via Telegram
                        /usr/bin/curl -s \
                                -o /dev/null \
                                -F chat_id="$telegram" \
                                -F text="$redoff" \
                                $url/sendMessage
        fi
fi
echo "Ejecutado protocolo WOL"
fi
echo "Another fine release by Lordpedal"
```

Vamos a revisar los cambios que debemos de introducir en las variables obligatorias:

| Variable | Comentario |
| ------ | ------ |
| `telegram=79593223` | Sustiuimos el **ID de nuestro telegram**, puedes consultarlo en [@lordpedalbot](https://t.me/Lordpedalbot){:target="_blank"} |
| `lordmac=00:11:22:33:44:55` | Dirección MAC que obtuvimos en el Servidor de la interfaz de red, en el ejemplo del script **enp5s0f0** |
| `IPServidor=192.168.1.90` | Dirección IP del servidor, en el ejemplo del script uso la del puente **br0** |
{: .notice--danger}

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x wol.sh
```

Tras modificar, vamos creamos un enlace simbólico a la ruta de ejecutables:

```bash
sudo ln -s $HOME/scripts/wol.sh \
/usr/local/bin/wolservidor
```

A partir de este momento con ejecutar la orden wolservidor podremos encender el servidor en remoto.

Vamos a contemplar la ejecución en tres situaciones diferentes:

- **Servidor Online**: El script se ejecuta pero solo somos notificados en terminal, no realiza acción.

```bash
pi@rpi4b:~/scripts$ wolservidor
Overclock Server esta ONLINE
Ejecutado protocolo WOL
Another fine release by Lordpedal
```

- **Servidor Apagado con Red**: El script se ejecuta y enciende el Servidor, a su vez notifica de la acción vía Telegram.

```bash
pi@rpi4b:~/scripts$ wolservidor
Overclock Server esta OFFLINE - WakeOnLan enviado 18:30
Overclock Server esta ONLINE - 18:35
Ejecutado protocolo WOL
Another fine release by Lordpedal
```

- **Servidor Apagado sin Red**: El script se ejecuta, trata de encender el Servidor pero este no se enciende, mostrara la siguiente salida en la terminal y ademas seremos notificados via Telegram.

```bash
pi@rpi4b:~/scripts$ wolservidor
Overclock Server esta OFFLINE - WakeOnLan enviado 18:40
Overclock Server esta OFFLINE - Comprueba conexión Red
Ejecutado protocolo WOL
Another fine release by Lordpedal
```

Pero para automatizar el proceso vamos a crear una tarea programa en cron para su ejecución en segundo plano :

```bash
crontab -e
```

Añadiendo el siguiente código al final del fichero para que sea ejecutado cada **30 minutos**:

```bash
*/30 * * * * ~/scripts/wol.sh >/dev/null 2>&1
```

Guardamos, salimos del editor y ya tendriamos nuestro despertador de red configurado.

El script admite múltiples mejoras, pero cumple de sobra la idea inicial de hacer algo sencillo y funcional. Siéntete libre de adaptarlo y mejorarlo.

> Y listo!
