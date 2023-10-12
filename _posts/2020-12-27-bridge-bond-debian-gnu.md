---
title:  "Bridge Bond: Debian GNU/Linux"
header:
  image: /assets/images/posts/debiantt.gif
date:   2020-12-27 08:15:00 -0300
last_modified_at: 2023-10-11T08:30:00-05:00
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
Esta entrada la tenía pendiente de publicar, tras los upgrades que realicé en mi [**Servidor**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/){:target="_blank"}.

En un inicio el Servidor disponia de una única entrada de red cableada, pero con vistas a ser actualizado, deje las pautas de configurar una red tipo [**Bridge**](https://lordpedal.github.io/gnu/linux/debian-10-servidor/#configurando-red){:target="_blank"} para la gestión del mismo.

La actualización de hardware llegó con esta [tarjeta de red](https://www.amazon.com/HEWLETT-PACKARD-NC360T-Gigabit-Interface/dp/B001DUHBCQ){:target="_blank"} la cual me permitia conexión dual y soporte protocolo [802.3ad](https://es.wikipedia.org/wiki/Agregaci%C3%B3n_de_enlaces){:target="_blank"}, a resumidas cuentas este método combina varias conexiones ethernet individuales en una, aumentando significativamente el ancho de banda.

Días atrás también hable de las redes tipo [**Bond**](https://lordpedal.github.io/gnu/linux/bonding-debian-gnu/){:target="_blank"}, como solución a conexión redundante en una Raspberry entre la red cableada e inhalámbrica.

Y ahora le toca el turno a la red tipo `Bridge` sobre una de tipo `Bond` en este mini-tutorial, que sería extensible a otras arquitecturas.

Empezamos consultado las interfaces disponibles en el sistema desde la terminal:

```bash
ip -br addr show
```

En mi caso obtengo los siguientes datos para próximas referencias:

```bash
pi@overclock:~$ ip -br addr show
lo               UNKNOWN
enp0s31f6        UP
enp5s0f0         DOWN
enp5s0f1         DOWN
```

## Configurar Kernel + Instalar dependencias

Habilitamos la carga del modulo bonding, para ello lo añadimos a la carga de modulos de arranque del sistema:

```bash
sudo nano /etc/modules
```

Y le añadimos el siguiente contenido:

```bash
#
# RED
#
bonding
8021q
#
```

Guardamos, salimos del editor e instalamos dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install ifenslave bridge-utils \
net-tools ifupdown vlan ethtool
```

## Configurar Red

Vamos a configurar la red, para ello editamos el fichero **interfaces**:

```bash
sudo nano /etc/network/interfaces
```

Y lo dejamos configurado con la siguiente estructura (**las interfaces de red pueden diferir**), para tener una **ip estática** (*activa por defecto*) o **dinámica** (*desactivada por defecto*):

```bash
# Interfaz Loopback
auto lo
iface lo inet loopback

# Interfaz LAN (Placa Base)
allow-hotplug enp0s31f6
iface enp0s31f6 inet manual
	pre-up   ifconfig $IFACE up
	pre-down ifconfig $IFACE down

# Interfaz LAN (HP PCIe)
allow-hotplug enp5s0f0
iface enp5s0f0 inet manual
	pre-up   ifconfig $IFACE up
	pre-down ifconfig $IFACE down

# Interfaz LAN (HP PCIe)
allow-hotplug enp5s0f1
iface enp5s0f1 inet manual
	pre-up   ifconfig $IFACE up
	pre-down ifconfig $IFACE down

# Interfaz Red Bond (bond0)
auto bond0
iface bond0 inet manual
	bond-mode 802.3ad
	bond-slaves enp5s0f0 enp5s0f1 enp0s31f6
	bond-miimon 100
	bond-downdelay 200
	bond-updelay 400
	bond-lacp-rate 1

# Interfaz Red Bridge (br0 IP Estatica)
auto br0
iface br0 inet static
	address 192.168.1.90
	netmask 255.255.255.0
	network 192.168.1.0
	broadcast 192.168.1.255
	gateway 192.168.1.1
	bridge_ports bond0
	bridge_stp off
	bridge_fd 0
	bridge_maxwait 0

# Interfaz Red Bridge (br0 IP Dinamica)
#auto br0
#iface br0 inet dhcp
#	bridge_ports bond0
#	bridge_stp off
#	bridge_fd 0
#	bridge_maxwait 0

# Interfaz Red Bridge (IPv6)
iface br0 inet6 auto
	accept_ra 1
```

Guardamos, salimos del editor y reiniciamos el sistema:

```bash
sudo reboot
```

Tras el reinicio podemos comprobar que el sistema esta debidamente configurado ejecutando individualmente o en conjunto estas instrucciones:

```bash
lsmod |grep bonding && \
cat /proc/net/bonding/bond0 && \
dmesg | grep -i bond0 && \
ip -br addr show && \
sudo ethtool br0
```

Con el primer comando comprobamos que el modulo del kernel ha sido debidamente cargado en el sistema:

```bash
pi@overclock:~$ lsmod |grep bonding
bonding               221184  0
tls                   135168  5 bonding
```

Con el segundo comprobamos que el `bond` esta debidamente operando:

```bash
pi@overclock:~$ cat /proc/net/bonding/bond0
Ethernet Channel Bonding Driver: v6.1.0-13-amd64

Bonding Mode: IEEE 802.3ad Dynamic link aggregation
Transmit Hash Policy: layer2 (0)
MII Status: up
MII Polling Interval (ms): 100
Up Delay (ms): 400
Down Delay (ms): 200
Peer Notification Delay (ms): 0

802.3ad info
LACP active: on
LACP rate: fast
Min links: 0
Aggregator selection policy (ad_select): stable

Slave Interface: enp5s0f0
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Slave queue ID: 0
Aggregator ID: 1
Actor Churn State: none
Partner Churn State: none
Actor Churned Count: 0
Partner Churned Count: 0

Slave Interface: enp5s0f1
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Slave queue ID: 0
Aggregator ID: 1
Actor Churn State: none
Partner Churn State: none
Actor Churned Count: 0
Partner Churned Count: 0

Slave Interface: enp0s31f6
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Slave queue ID: 0
Aggregator ID: 1
Actor Churn State: none
Partner Churn State: none
Actor Churned Count: 0
Partner Churned Count: 0
```

Con el tercer comando comprobamos la secuencia de arranque de la red:

```bash
pi@overclock:~$ dmesg | grep -i bond0
[    7.151152] bond0: (slave enp5s0f0): Enslaving as a backup interface with a down link
[    7.567151] bond0: (slave enp5s0f1): Enslaving as a backup interface with a down link
[    7.851052] bond0: (slave enp0s31f6): Enslaving as a backup interface with a down link
[    7.883642] 8021q: adding VLAN 0 to HW filter on device bond0
[    7.942308] br0: port 1(bond0) entered blocking state
[    7.942312] br0: port 1(bond0) entered disabled state
[    7.942539] device bond0 entered promiscuous mode
[    9.034500] bond0: (slave enp5s0f0): link status up, enabling it in 400 ms
[    9.034505] bond0: (slave enp5s0f0): invalid new link 3 on slave
[    9.454489] bond0: (slave enp5s0f1): link status up, enabling it in 400 ms
[    9.454558] bond0: (slave enp5s0f0): link status definitely up, 1000 Mbps full duplex
[    9.454563] bond0: Warning: No 802.3ad response from the link partner for any adapters in the bond
[    9.454569] bond0: (slave enp5s0f1): invalid new link 3 on slave
[    9.455632] bond0: active interface up!
[    9.455645] IPv6: ADDRCONF(NETDEV_CHANGE): bond0: link becomes ready
[    9.455739] br0: port 1(bond0) entered blocking state
[    9.455743] br0: port 1(bond0) entered forwarding state
[    9.870529] bond0: (slave enp5s0f1): link status definitely up, 1000 Mbps full duplex
[   10.710481] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.718689] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.726477] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.734483] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.742486] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.750468] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.758468] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.766472] bond0: (slave enp0s31f6): link status up, enabling it in 400 ms
[   10.766479] bond0: (slave enp0s31f6): invalid new link 3 on slave
[   11.196810] bond0: (slave enp0s31f6): link status definitely up, 1000 Mbps full duplex
```

Con el cuarto comando comprobamos que los dispositivos de red esten levantados y su IP:

```bash
pi@overclock:~$ ip -br addr show
lo               UNKNOWN        127.0.0.1/8
enp0s31f6        UP             
enp5s0f0         UP             
enp5s0f1         UP             
bond0            UP             
br0              UP             192.168.1.90/24
```

Y con el quinto comando comprobamos la velocidad de la red en el bridge tras realizar el bond.
Debemos de saber que si el Switch soporta el protocolo 802.3ad veremos un claro aumento de la velocidad:

```bash
pi@overclock:~$ sudo ethtool br0
Settings for br0:
	Supported ports: [  ]
	Supported link modes:   Not reported
	Supported pause frame use: No
	Supports auto-negotiation: No
	Supported FEC modes: Not reported
	Advertised link modes:  Not reported
	Advertised pause frame use: No
	Advertised auto-negotiation: No
	Advertised FEC modes: Not reported
	Speed: 3000Mb/s
	Duplex: Unknown! (255)
	Auto-negotiation: off
	Port: Other
	PHYAD: 0
	Transceiver: internal
	Link detected: yes
```

> Y listo!
