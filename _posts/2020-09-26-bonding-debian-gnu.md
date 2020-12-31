---
title:  "Bonding: Debian GNU/Linux"
date:   2020-09-26 08:15:00 -0300
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
header:
  teaser: /assets/images/Debianth.png
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
Recientemente me he encontrado en la necesidad de crear una red de tipo [bonding](https://wiki.debian.org/Bonding){:target="_blank"}, para un proyecto en el que estoy trabajando sobre una Raspberry que monitoriza mi **impresora 3D**.

De forma sencilla podriamos describir la red tipo bonding: como la suma de dos o mas interfaces de red para actuar como una interfaz, en la cual podemos aumentar el ancho de banda o la redundancia de la red.

Por lo general, se usa para vincular dispositivos Ethernet, pero lo que necesitaba era poder interactuar entre interfaces **Wifi e Ethernet**.

El objetivo es cambiar a la interfaz Wifi de forma transparente, sin pérdida de paquetes de red cuando se desconecta el conector RJ45, si después volvieramos a conectar el cable de red, sucederia la operación inversa, ya que la interfaz Ethernet sería el modo predeterminado.

Para configurar sobre nuestra base GNU/Linux Debian ([Raspberry Pi OS](https://www.raspberrypi.org/downloads/raspberry-pi-os/){:target="_blank"}), he querido añadir este mini-tutorial, que sería extensible a otras arquitecturas.

Empezamos consultado las interfaces disponibles en el sistema desde la terminal:

```bash
ip -br addr show
```

En mi caso obtengo los siguientes datos, el ID de mi red Ethernet es eth0 y la red Wifi wlan0 para próximas referencias:

```bash
pi@rpi4b:~ $ ip -br addr show
lo         UNKNOWN 127.0.0.1/8
eth0       UP      192.168.1.69/24
wlan0      DOWN
```

## Configurar Kernel + Instalar dependencias

Habilitamos la carga del modulo bonding, para ello lo añadimos a la carga de modulos de arranque del sistema:

```bash
sudo nano /etc/modprobe.d/bonding.conf
```

Y le añadimos el siguiente contenido:

```bash
alias bond0 bonding
options bonding mode=0 miimon=0
```

Vamos a repasar las opciones configurables:

- **mode=0**: Establece una política de [Round-Robin](https://es.wikipedia.org/wiki/Planificaci%C3%B3n_Round-robin){:target="_blank"}, que es un algoritmo que asigna una carga equitativa y ordenada a cada proceso, para proporcionar tolerancia a fallos y balanceo de carga entre los miembros del arreglo de dispositivos. Todas las transmisiones de datos son enviadas y recibidas de forma secuencial en cada interfaz esclava del arreglo empezando con la primera que esté disponible.
- **mode=1**: Establece una política de respaldo activo que proporciona tolerancia a fallos. Todo el tráfico se transmite a través de una tarjeta y solo se utilizará la otra en caso de que falle la primera.
- **modo=2**: Establece una política XOR para proporcionar tolerancia a fallos y balanceo de carga. Este algoritmo compara las solicitudes entrantes de las direcciones MAC hasta que coinciden para la dirección MAC de una de las tarjetas esclavas. Una vez que se establece el enlace, las transmisiones de datos de datos son enviadas en forma secuencial empezando con la primera interfaz disponible.
- **modo=3**: Establece una política de Round-Robin, para proporcionar tolerancia a fallos y balanceo de carga. Todas las transmisiones de datos son enviadas de forma secuencial en cada interfaz esclava del arreglo empezando con la primera que esté disponible.
- **miimon=0**: Se utiliza para especificar cada cuantos milisegundos se debe supervisar el enlace **MII** (**M**edia **I**ndependent **I**nterface), se utiliza cuando se necesita alta disponibilidad para verificar si la interfaz está activa y verificar si hay un cable de red conectado.

Guardamos, salimos del editor, instalamos dependencias y cargamos el modulo:

```bash
sudo apt-get update && \
sudo apt-get -y install ifenslave wpasupplicant && \
sudo modprobe bonding
```

## Configurar Red

Vamos a configurar el acceso a la red Wifi, para ello editamos su configuración:

```bash
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

Y le añadimos el siguiente contenido, sustituyendo el valor ssid & psk por los datos de tu conexión Wifi respetando comillas:

```bash
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=ES

network={
ssid="Nombre_de_Wifi"
psk="Clave_de_Wifi"
}
```

Guardamos y salimos del editor, el siguiente paso es configurar la red para que haga la labor de forma autonoma,  para ello editamos el fichero interfaces:

```bash
sudo nano /etc/network/interfaces
```

Y lo dejamos configurado de la siguiente forma, para tener una **ip estática** (*activa por defecto*) o **dinámica** (*desactivada por defecto*):

```bash
# Interfaz Loopback
auto lo
	iface lo inet loopback

# Interfaz Ethernet
auto eth0
	iface eth0 inet manual
	bond-master bond0
	bond-primary eth0 wlan0

# Interfaz Wifi
auto wlan0
	iface wlan0 inet manual
	bond-master bond0
	bond-primary eth0 wlan0
	wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

# Interfaz Bond Estática (activa)
auto bond0
	iface bond0 inet static
	address 192.168.1.69
	netmask 255.255.255.0
	network 192.168.1.0
	gateway 192.168.1.1
	bond-slaves none
	bond-mode active-backup
	bond-miimon 100
	bond-downdelay 200
	bond-updelay 200

# Interfaz Bond Dinámica (desactivada)
#auto bond0
#	iface bond0 inet dhcp
#	bond-slaves none
#	bond-mode active-backup
#	bond-miimon 100
#	bond-downdelay 200
#	bond-updelay 200
```

Guardamos, salimos del editor y **desactivamos el gestor de conexiones que usa la Raspberry** por defecto (`dhcpcd`), para evitar conflictos en arranque:

```bash
sudo systemctl disable dhcpcd
```

Reiniciamos el sistema:

```bash
sudo reboot
```

Tras el reinicio podemos comprobar que el sistema esta debidamente configurado ejecutando individualmente o en conjunto estas instrucciones:

```bash
lsmod |grep bonding && \
cat /proc/net/bonding/bond0 && \
dmesg | grep -i bond0 && \
ip -br addr show
```

En mi caso la respuesta es:

```bash
pi@rpi4b:~ $ lsmod |grep bonding && \
> cat /proc/net/bonding/bond0 && \
> dmesg | grep -i bond0 && \
> ip -br addr show

bonding 142526 0

Ethernet Channel Bonding Driver: v3.7.1 (April 27, 2011)

Bonding Mode: load balancing (round-robin)
MII Status: up
MII Polling Interval (ms): 100
Up Delay (ms): 200
Down Delay (ms): 200
Peer Notification Delay (ms): 0

Slave Interface: eth0
MII Status: down
Speed: Unknown
Duplex: Unknown
Link Failure Count: 1
Permanent HW addr: xx:xx:xx:xx:xx:xx
Slave queue ID: 0

Slave Interface: wlan0
MII Status: up
Speed: Unknown
Duplex: Unknown
Link Failure Count: 1
Permanent HW addr: xx:xx:xx:xx:xx:xx
Slave queue ID: 0

[ 7.204345] bonding: bond0 is being created...
[ 7.250594] bond0: (slave eth0): Enslaving as an active interface with an up link
[ 7.250718] bond0: link becomes ready
[ 7.273399] bond0: option primary: mode dependency failed, not supported in mode balance-rr(0)
[ 7.672438] bond0: (slave wlan0): Enslaving as an active interface with an up link
[ 7.687305] bond0: option primary: mode dependency failed, not supported in mode balance-rr(0)
[ 9.411235] bond0: (slave eth0): link status down for interface, disabling it in 200 ms
[ 9.411254] bond0: (slave wlan0): link status down for interface, disabling it in 200 ms
[ 9.411271] bond0: (slave eth0): invalid new link 1 on slave
[ 9.411286] bond0: (slave wlan0): invalid new link 1 on slave
[ 9.429998] bond0: option mode: unable to set because the bond device has slaves
[ 9.601336] bond0: (slave eth0): link status definitely down, disabling slave
[ 9.601422] bond0: (slave wlan0): link status definitely down, disabling slave
[ 14.361093] bond0: (slave wlan0): link status up, enabling it in 0 ms
[ 14.381090] bond0: (slave wlan0): link status up, enabling it in 0 ms
[ 14.411096] bond0: (slave wlan0): link status up, enabling it in 0 ms
[ 14.411161] bond0: (slave wlan0): link status definitely up, 0 Mbps full duplex
[ 14.411176] bond0: active interface up!
[ 14.411200] bond0: link becomes ready

lo            UNKNOWN 127.0.0.1/8
eth0          DOWN
wlan0         UP
bond0         UP 192.168.1.69/24
```

> Y listo!
