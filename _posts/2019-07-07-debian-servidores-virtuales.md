---
title:  "Servidores Virtuales: Debian GNU/Linux"
date:   2019-07-07 10:00:00 -0300
last_modified_at: 2020-12-12T17:00:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Servidor
  - Debian
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

Un **hipervisor** (en inglés `hypervisor`) o **monitor** de **máquina virtual** (`virtual machine monitor`) es una plataforma que permite aplicar diversas técnicas de control de [virtualización](https://es.wikipedia.org/wiki/Virtualizaci%C3%B3n){:target="_blank"} para utilizar, al mismo tiempo, diferentes [sistemas operativos](https://es.wikipedia.org/wiki/Sistema_operativo){:target="_blank"} (sin modificar o modificados, en el caso de [paravirtualización](https://es.wikipedia.org/wiki/Paravirtualizaci%C3%B3n){:target="_blank"}) en una misma computadora.

Lo primero que debemos de **comprobar es que nuestra CPU soporta la virtualización y si se encuentra activa**. El siguiente comando **chequea** el sistema tanto **Intel** como **AMD**:<!--break-->

```bash
egrep -c '(svm|vmx)' /proc/cpuinfo
```

En mi caso el comando devuelve un valor **mayor a 0** por lo tanto es compatible con el proceso:

```bash
pi@overclock:~$ egrep -c '(svm|vmx)' /proc/cpuinfo
8
pi@overclock:~$ free -h
              total        used        free      shared  buff/cache   available
Mem:            31G        5,3G         25G        196M        535M         25G
Swap:           15G          0B         15G
```

También **recomiendo disponer de más de 4Gb de RAM** para no generar excesiva carga en la memoria [SWAP](https://es.wikipedia.org/wiki/Espacio_de_intercambio){:target="_blank"}. Realizada esta breve introducción pasemos a la acción.

### KVM

[KVM](https://es.wikipedia.org/wiki/Kernel-based_Virtual_Machine){:target="_blank"} es una solución de virtualización completa para Linux en hardware x86 que contiene extensiones de virtualización (**Intel VT o AMD-V**). Consiste en un módulo de kernel cargable (`kvm.ko`), que proporciona la infraestructura de virtualización principal y un módulo específico del procesador (**kvm-intel.ko** *o* **kvm-amd.ko**).

### Dependencias

Vamos a proceder a instalar el software necesario:

```bash
sudo apt-get update && \
sudo apt-get -y install qemu-kvm libvirt-clients \
libvirt-daemon libvirt-daemon-system bridge-utils libguestfs-tools \
genisoimage virtinst libosinfo-bin virt-manager
```

### Permisos de usuario

Ahora debemos de agregar nuestro usuario a los **grupos virtuales** y los recargamos al sistema:

```bash
sudo adduser $USER libvirt && \
sudo adduser $USER libvirt-qemu && \
sudo adduser $USER kvm && \
newgrp libvirt && \
newgrp libvirt-qemu && \
newgrp kvm
```

Comprobamos que este correctamente incluido:

```bash
pi@overclock:~$ groups $USER
pi : pi adm tty dialout cdrom floppy sudo audio dip video plugdev netdev kvm libvirt libvirt-qemu
```

### Red Bridge KVM

Vamos a comprobar el acceso a la red desde KVM:

```bash
pi@overclock:~$ sudo virsh net-list --all
 Name                 State      Autostart     Persistent
----------------------------------------------------------
 default              inactive   no            yes
```

Como en nuestro servior ya disponemos de una `red bridge` ([br0](https://lordpedal.gitlab.io/debian-10-servidor-red/){:target="_blank"}), vamos a configurar debidamente KVM para que tenga acceso. Para ellos vamos a crear un fichero de puente:

```bash
nano /home/$USER/.bridged.xml
```

Y agregamos el contenido:

```bash
<network>
  <name>br0</name>
  <forward mode="bridge"/>
  <bridge name="br0"/>
</network>
```

Guardamos los cambios **(Ctrl+O)**, salimos del editor de texto **(Ctrl+X)**, activamos los cambios:

```bash
sudo virsh net-define --file /home/pi/.bridged.xml && \
sudo virsh net-autostart br0 && sudo virsh net-start br0
```

Y comprobamos la configuración de KVM:

```bash
pi@overclock:~$ sudo virsh net-list --all
 Name                 State      Autostart     Persistent
----------------------------------------------------------
 br0                  active     yes           yes
 default              inactive   no            yes
```

Llegados a este punto recomiendo reiniciar el servidor para activar los cambios:

```bash
sudo reboot
```

Tras el renicio ya tendremos el sistema totalmente preparado para trabajar con KVM. 

Desde el entorno gráfico podras crear maquinas virtuales sencillamente con el gestor instalado y tambien desde terminal.

```bash
pi@overclock:~$ sudo virsh list --all
 Id    Name                           State
----------------------------------------------------
 1     D10KVM                         running
 -     win10pro                       shut off
```

> Y listo!
