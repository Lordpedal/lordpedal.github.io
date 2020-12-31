---
title:  "**Wine 5**: Debian GNU/Linux"
date:   2020-08-22 10:00:00 -0300
last_modified_at: 2020-12-16T10:15:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
header:
  teaser: /assets/images/Debian.png
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
[Wine](https://www.winehq.org/){:target="_blank"} te permite correr software de Windows en otros sistemas operativos.

Con Wine, puedes **instalar y ejecutar estas aplicaciones igual que lo haría en Windows**.

Para instalar sobre nuestra base Debian seguimos este mini-tutorial, lo primero que debemos de hacer es habilitar soporte arquitectura 32bits en nuestro sistema de 64bits:

```bash
sudo dpkg --add-architecture i386
```

Actualizamos repositorios e instalamos las dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install gnupg2 \
software-properties-common
```

Descargamos la llave GPG del repositorio WineHQ:

```bash
wget -qO - https://dl.winehq.org/wine-builds/winehq.key | \
sudo apt-key add -
```

Instalamos el repositorio WineHQ:

```bash
sudo apt-add-repository \
https://dl.winehq.org/wine-builds/debian/
```

Descargamos la llave GPG del repositorio Wine OBS:

```bash
wget -qO - https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/Debian_10/Release.key | \
sudo apt-key add -
```

Agregamos el repositorio Wine OBS:

```bash
echo "deb http://download.opensuse.org/repositories/Emulators:/Wine:/Debian/Debian_10 ./" | \
sudo tee /etc/apt/sources.list.d/wine-obs.list
```

Actualizamos nuevamente repositorios e instalamos Wine:

```bash
sudo apt-get update && \
sudo apt-get -y install \
--install-recommends winehq-stable
```
>  Y listo!
