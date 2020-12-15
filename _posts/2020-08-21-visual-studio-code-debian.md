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
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

<a href="https://code.visualstudio.com/" target="_blank" rel="noreferrer noopener">Visual Studio Code</a> es un editor IDE multi-plataforma desarrollado por Microsoft, gratuito y que sigue la filosofía de desarrollo del código abierto pero no es software libre.

## VSCode

Abrimos una terminal de sistema y actualizamos repositorios

```bash
sudo apt-get update
```

Instalamos las dependencias

```bash
sudo apt-get -y install software-properties-common apt-transport-https
```

Descargamos la llave GPG del repositorio

```bash
sudo wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
```

Instalamos el repositorio

```bash
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
```

Actualizamos nuevamente repositorios

```bash
sudo apt-get update
```

Instalamos VSCode

```bash
sudo apt-get -y install code
```

## PlatformIO IDE

La primera parte del proceso esta finalizada, ya solo nos queda saber que para poder compilar el firmware de Marlin es instalar el plugin <a href="https://platformio.org/" target="_blank" rel="noreferrer noopener">PlatformIO IDE</a>.

<li style="text-align: justify;">
Abrimos <strong>VSCode > Extension Manager</strong>
</li>

<li style="text-align: justify;">
<strong><code>Buscamos</code></strong> el plugin oficial <strong>PlatformIO IDE</strong>
</li>

<li style="text-align: justify;">
<strong><code>Instalamos</code></strong> la extensión <strong>PlatformIO IDE</strong>
</li>

> Y listo
