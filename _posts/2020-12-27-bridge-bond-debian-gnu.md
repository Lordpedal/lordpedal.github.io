---
title:  "Bridge Bond: Debian GNU/Linux"
header:
  image: /assets/images/posts/debiantt.gif
date:   2020-12-27 08:15:00 -0300
last_modified_at: 2023-09-04T08:30:00-05:00
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
net-tools ifupdown vlan
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
	bond-master bond0
	bond-mode balance-rr

# Interfaz LAN (HP PCIe)
allow-hotplug enp5s0f1
iface enp5s0f1 inet manual
	pre-up   ifconfig $IFACE up
	pre-down ifconfig $IFACE down
	bond-master bond0
	bond-mode balance-rr

# Interfaz Red Bond (bond0)
auto bond0
iface bond0 inet manual
	bond-slaves enp5s0f0 enp5s0f1
	bond-mode balance-rr
	bond-miimon 100
	bond-downdelay 200
	bond-updelay 200

# Interfaz Red Bridge (br0 IP Estatica)
auto br0
iface br0 inet static
	address 192.168.1.90
	netmask 255.255.255.0
	network 192.168.1.0
	broadcast 192.168.1.255
	gateway 192.168.1.1
	bridge_ports bond0 enp0s31f6
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
ip -br addr show
```

> Y listo!
