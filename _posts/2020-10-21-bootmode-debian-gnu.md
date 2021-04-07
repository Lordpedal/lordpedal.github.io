---
title:  "Boot Modo TTY/Gráfico: Debian GNU/Linux"
date:   2020-10-21 15:30:00 -0300
header:
  image: /assets/images/posts/debiantt.gif
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
Esta entrada lo que pretendo es publicar a modo `TIP/Chuleta` como podríamos alternar entre un arranque en modo **TTY** (Texto) o **Gráfico** (Gestor de ventanas), para entornos [GNU/Linux](https://es.wikipedia.org/wiki/GNU/Linux){:target="_blank"} con soporte [Systemd](https://es.wikipedia.org/wiki/Systemd){:target="_blank"}.

Desde el punto de vista de un **Servidor** el arranque en modo terminal supone un ahorro de recursos, ya que casi todas las consultas que realizamos sobre el mismo, se suelen gestionar mediante [SSH](https://es.wikipedia.org/wiki/Secure_Shell){:target="_blank"}.

Ahora sin embargo si el equipo en cuestión es un **Portatil** quizás no tenga tanta relevancia, sino sea más bien una cuestión de gustos.

Ya sea de una forma o de otra, vamos a ver como es posible alternar con unas simples ordenes de terminal.

La primera orden que conviene comprobar es el tipo de arranque como esta seleccionado:

```bash
systemctl get-default
```

Y nos devolvera dos posibles opciones:

- **multi-user.target** (Boot en modo TTY)
- **graphical.target** (Boot en modo Gráfico)

### Origen: Modo Gráfico ⇒ Destino: Modo TTY

Para forzar el arranque en modo **TTY** ejecutamos en la terminal:

```bash
sudo systemctl set-default multi-user.target
```

Y para activación tendríamos que reiniciar:

```bash
sudo reboot
```

### Origen: Modo TTY ⇒ Destino: Modo Gráfico

Para forzar el arranque en modo **Gráfico** ejecutamos en la terminal:

```bash
sudo systemctl set-default graphical.target
```

Y para activación tendríamos que reiniciar:

```bash
sudo reboot
```

> Y listo!
