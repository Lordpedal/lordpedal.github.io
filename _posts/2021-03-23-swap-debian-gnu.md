---
title:  "Fichero de intercambio SWAP: Debian GNU/Linux"
date:   2021-03-23 23:30:00
header:
  image: /assets/images/posts/debiantt.gif
last_modified_at: 2021-03-23T23:45:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
  - Servidor
toc: false
toc_sticky: false
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
A raíz de una conversación con un compañero sobre la necesidad o no de una partición `SWAP` en un sistema de producción actual le comente la posibilidad de usar **un fichero como sistema de intercambio en vez de una partición específica en el disco duro**.

Detallar que una posible pega a esta metodología es que a priori **perderiamos la opción de hibernar en disco**, pero desde un enfoque como Servidor realmente no pierdo funcionalidad ya que la idea es que este disponible en todo momento.

Sigo recomendando usar [ZRAM](https://lordpedal.github.io/gnu/linux/zram-sbc-gnu/){: .btn .btn--warning .btn--small}{:target="_blank"} y más hoy en día con la cantidad de RAM que podemos tener instalada en nuestros sistemas (**+4Gb**).

Dicho esto vamos a ir entrando en materia, por eso en esta entrada voy a compartir como realizar de forma sencilla la **transición de una partición Swap a un fichero Swap**.

Comenzamos identificando la partición `SWAP` del sistema y su `UUID`:

```bash
sudo swapon -s && \
sudo blkid | grep swap
```

En mi caso arroja la siguiente información:

```bash
pi@miniPC:~$ sudo swapon -s
Nombre del fichero        Tipo          Tamaño    Utilizado  Prioridad
/dev/sda3                 partition     4036604   0          -2
/dev/sda3: UUID="036aeef5-365c-46e9-a675-ca4b548895b6" TYPE="swap" PARTUUID="4f72b4c8-e07a-4067-b504-8dd6a279f65d"
```

Sabiendo donde se aloja, en mi caso partición `/dev/sda3`, el siguiente paso es desactivarla en el sistema:

```bash
sudo swapoff /dev/sda3
```

Ahora debemos de editar nuestro fichero `fstab` y comentar añadiendo una `#` al UUID de nuestra partición SWAP para que no la cargue al arrancar el sistema. Otra forma sencilla de cambiar el dato es con el comando `sed`, de ambas formas ocurre lo mismo:

```bash
sudo sed -i 's/^UUID=036aeef5-365c-46e9-a675-ca4b548895b6/#UUID=036aeef5-365c-46e9-a675-ca4b548895b6/g' /etc/fstab
```

Llegados a este punto no tendremos sistema de intercambio en el sistema, por lo que vamos a crear un fichero de intercambio de por **ejemplo 4GB**:

```bash
sudo dd if=/dev/zero of=/lordswap bs=1024 count=4194304
```

**NOTA:** *1GB* = **1048576**, *4GB* = **4194304**, ...
{: .notice--info}

Protegemos el fichero para que solo el root pueda leer y escribir en el fichero:

```bash
sudo chmod 600 /lordswap
```

Formateamos el fichero como intercambio:

```bash
sudo mkswap /lordswap
```

Activamos el fichero en la sesión actual:

```bash
sudo swapon /lordswap
```

Volvemos a consultar la swap como vimos anteriormente con la opción `swapon -s` para comprobar que esta operativa:


```bash
pi@miniPC:~$ sudo swapon -s
Nombre del fichero        Tipo          Tamaño    Utilizado  Prioridad
/lordswap                 partition     4036604   0          -2
```

Como hemos podido comprobar que esta correcto, falta incluir los cambios en el arranque del sistema modificando el fichero `fstab` añadiendole las novedades:

```bash
cat << EOF | sudo tee -a /etc/fstab
# Fichero SWAP
/lordswap none swap sw 0 0
EOF
```

Recuerda que el sistema no sera compatible con la hibernación y para evitar ralentizaciones en el arranque vamos a realizar un pequeño **fix** comentando ese apartado:

```bash
sudo sed -i 's/^RESUME=UUID/#RESUME=UUID/g' /etc/initramfs-tools/conf.d/resume && \
sudo update-initramfs -u
```

> Y listo!
