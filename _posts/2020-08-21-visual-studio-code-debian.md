---
title:  "Visual Studio Code: Debian GNU/Linux"
date:   2020-08-21 22:00:00 -0300
last_modified_at: 2020-08-21T22:30:00-05:00
categories:
  - GNU/Linux
  - 3D
tags:
  - GNU/Linux
  - Debian
  - 3D
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
header:
  teaser: /assets/images/Debianth.png
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
[Visual Studio Code](https://code.visualstudio.com/){:target="_blank"} es un editor IDE multi-plataforma desarrollado por Microsoft, gratuito y que sigue la filosofía de desarrollo del código abierto pero no es software libre.

## VSCode

![VSCode]({{ site.url }}{{ site.baseurl }}/assets/images/posts/vscode.png)

Abrimos una terminal de sistema, actualizamos repositorios e instalamos las dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install software-properties-common \
apt-transport-https
```

Descargamos la llave GPG del repositorio:

```bash
sudo wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
```

Agregamos el repositorio de Microsoft:

```bash
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
```

Actualizamos nuevamente repositorios e instalamos VSCode:

```bash
sudo apt-get update && \
sudo apt-get -y install code
```

## PlatformIO IDE

La primera parte del proceso esta finalizada, ya solo nos queda saber que para poder compilar el firmware de Marlin es instalar el plugin <a href="https://platformio.org/" target="_blank" rel="noreferrer noopener">PlatformIO IDE</a>.

![PlatformIO]({{ site.url }}{{ site.baseurl }}/assets/images/posts/platformide.jpg)

- Abrimos **VSCode > Extension Manager**
- `Buscamos` el plugin oficial **PlatformIO IDE**
- `Instalamos` la extensión **PlatformIO IDE**

{% include video id="495816800" provider="vimeo" %}

> Y listo!
