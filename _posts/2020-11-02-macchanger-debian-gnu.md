---
title:  "Macchanger: Debian GNU/Linux"
date:   2020-11-02 16:59:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
  - Servidor
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
[Macchanger](https://packages.debian.org/stable/macchanger){:target="_blank"} es una utilidad muy simple pero que mejora el anonimato enormemente, ya que  podemos alterar la [dirección MAC](https://es.wikipedia.org/wiki/Direcci%C3%B3n_MAC){:target="_blank"} de nuestra tarjeta de red.

Esta dirección es una cadena de [seis octetos](https://es.wikipedia.org/wiki/Byte){:target="_blank"}, en la cual podremos determinar por ejemplo el fabricante a través de los tres primeros.

Es por así decirlo, un número de serie de fabricación que identifica inequívocamente a esa pieza de hardware.

**¿Que quiere decir esto?** Que tu tarjeta de red tiene una MAC que la identifica, que es única y que cada vez que envías/consultas información por una red, esa dirección **MAC** viaja dentro del paquete de datos [TCP/IP](https://es.wikipedia.org/wiki/Familia_de_protocolos_de_internet){:target="_blank"}.

Por ejemplo los routers mantienen una [tabla ARP](https://es.wikipedia.org/wiki/Familia_de_protocolos_de_internet){:target="_blank"} que conserva los datos de las **MAC** de los dispositivos conectados a ellos, lo cual esto permitiría una manera de seguimiento de un dispositivo.

Para configurar sobre nuestra base GNU/Linux Debian, he querido añadir este **mini-tutorial**, que sería extensible a otras arquitecturas.

Empezamos consultado las interfaces disponibles en el sistema desde la terminal:

```bash
ip -br addr show
```

En mi caso obtengo los siguientes datos, el ID de mi red Ethernet es **br0**, porque tengo una conexión [puente entre dos tarjetas de red](https://es.wikipedia.org/wiki/Puente_de_red){:target="_blank"}:

```bash
pi@overclock:~ $ ip -br addr show
lo         UNKNOWN 127.0.0.1/8
enp3s0     DOWN
enp5s0f0   UP
enp5s0f1   UP
br0        UP      192.168.1.90/24
```

Vamos a actualizar repositorios e instalamos dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install macchanger
```

Durante la instalación nos preguntara si queremos que macchanger cambie la **MAC de forma automática, seleccionamos NO** para evitar fallos de gestión de interfaces:

![Macchanger]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Macchanger.jpg)

A continuación vamos a crear un servicio [Systemd](https://es.wikipedia.org/wiki/Systemd){:target="_blank"} para que se ejecute al iniciar el sistema con la interfaz de red que elijamos y asigne una **MAC aleatoria**:

```bash
sudo bash -c 'cat << EOF > /etc/systemd/system/hackmac@.service
[Unit]
Description=MACChanger para interfaz %I
Wants=network.target
Before=network.target
BindsTo=sys-subsystem-net-devices-%i.device
After=sys-subsystem-net-devices-%i.device

[Service]
Type=oneshot
ExecStart=/usr/bin/macchanger -r %I
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF'
```

Como anteriormente hemos visto tengo una red tipo bridge **br0**, vamos a **activar**, arrancar y comprobar el servicio creado sobre dicha red:

sudo systemctl enable hackmac@br0.service && \
sudo systemctl start hackmac@br0.service && \
sudo systemctl status hackmac@br0.service

En mi caso la respuesta es la siguiente, donde se puede observar el cambio:

```bash
overclock systemd[1]: Starting Macchanger for br0...
overclock macchanger[869]: Current MAC: ac:72:89:5c:3b:d2 (Intel)
overclock macchanger[869]: Permanent MAC: 00:00:00:00:00:00 (Xerox)
overclock macchanger[869]: New MAC: c2:d7:f1:b3:d7:7b (Unknown)
overclock systemd[1]: Started Macchanger for br0.
```

Una idea simple a modo de **TIP** que recomiendo es randomizar la MAC cada 12h aprovechando el servicio y cron:

```bash
crontab -e
```

Añadimos al final del fichero la siguiente variable:

```bash
0 */12 * * * sudo systemctl restart hackmac@br0.service
```

Guardamos el fichero, salimos del editor y ya tendríamos automatizada la tarea. 

Otro posible escenario es el de querer `desactivar, borrar el servicio y desinstalar la aplicación` para volver a parámetros de origen:

```bash
sudo systemctl stop hackmac@br0.service && \
sudo systemctl disable hackmac@br0.service && \
sudo macchanger -p br0 && \
sudo rm /etc/systemd/system/hackmac@.service && \
sudo apt-get -y purge macchanger
```

> Y listo!
