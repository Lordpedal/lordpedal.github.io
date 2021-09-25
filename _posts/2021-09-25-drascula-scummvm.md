---
title:  "Dráscula: The Vampire Strikes Back GNU/Linux"
header:
  image: /assets/images/posts/debiantt.gif
date:   2021-09-25 22:00:00
last_modified_at: 2021-09-25T22:30:00
categories:
  - GNU/Linux
  - Personal
tags:
  - GNU/Linux
  - Debian
  - Personal
toc: false
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Scummvm]({{ site.url }}{{ site.baseurl }}/assets/images/posts/drascula.png){: .align-center}
{: .full}
[**Dráscula**](http://www.alcachofasoft.com/){: .btn .btn--reverse .btn--small}{:target="_blank"} se puede considerar como la opera prima de **Alcachofa Soft**, se trata de aventura gráfica española 2D clásica de estilo point & click y una interfaz sencilla. 

Fue desarrollada a las órdenes del toledano *Emilio de Paz* y contiene grandes dosis de cachondeo, unos fondos bastante elaborados y animaciones `“pixel a pixel”` más que decentes pese a que en su momento se tachase de fracaso comercial.

Claramente inspirado en la filosofía de los expertos desarrolladores de juegos `LucasArts`, empleo un esquema muy similar: **dibujos animados, algunos puzzles por resolver y humor a tutiplén.**

En Agosto de 2008, el creador y titular de los derechos de autor de Dráscula libero el juego bajo licencia Freeware para ser jugado con el programa **ScummVM**.

## Historia

El malvado y vampírico Conde Drascula tiene un plan para conquistar el mundo construyendo un ejército de monstruos creados con partes de cadáveres reanimados mediante un aparato de su invención llamado "indifibulador". 

De acuerdo, no es un buen plan. Pero él está decidido a llevarlo a cabo. Para ello sólo le queda conseguir un cerebro "nuevecito y sin estrenar" y el de la bella e inocente Billie Jean es el mejor candidato.

Así pues el Conde Dráscula secuestra a la joven y se la lleva a su castillo. Pero con lo que el temible vampiro no contaba es con que el valiente Johnny Hacker, un agente inmobiliario de viaje de negocios por Transilvania y que se ha enamorado de Billie Jean, hará todo lo posible para rescatarla.

## Instalación

El proceso es muy simple, comenzamos actualizando repositorios del sistema e instalando dependencias:

```bash
sudo apt-get update && \
sudo apt-get -y install drascula drascula-music drascula-spanish
```

> Y listo!

{% include video id="613794157" provider="vimeo" %}
