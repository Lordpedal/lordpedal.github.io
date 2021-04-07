---
title:  "Tor Browser: Servidor Debian"
date:   2019-07-28 10:00:00 -0300
header:
  image: /assets/images/posts/debiantt.gif
last_modified_at: 2020-12-12T16:30:00-05:00
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

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png){: .align-center}
{: .full}
A menudo por la red podemos encontrar referencias a una red llamada **red Tor**. Sin embargo, la mayoría de usuarios no sabe lo que significa esta red, para qué sirve ni lo que se esconde en ella.

[TOR](https://www.torproject.org/){:target="_blank"} es una abreviatura de The Onion Project, un proyecto que busca el poder crear una red de comunicaciones distribuida de baja latencia por encima de la capa de internet de manera que nunca se revelen los datos de los usuarios que la utilizan, manteniéndose así como una red privada y anónima.

A diferencia de lo que piensan muchos usuarios, la red Tor **no es una red P2P**. A nivel técnico, esta red dispone por un lado una serie de enrutadores de tráfico, que son aquellos servidores por los que el tráfico se reenvía hasta alcanzar el destino y por otro lado independiente están todos los usuarios de esta red.

Hasta hace algún tiempo conectarse a la red Tor podia llegar a ser algo complicado para usuarios sin demasiada experiencia ya que había que instalar varias aplicaciones que hicieran de proxy y permitieran el acceso a esta red. También había que estar pendientes de ellas para evitar que por cualquier error se desconectara de los servidores exponiendo por completo nuestra identidad.<!--break-->

Ahora es mucho más sencillo el poder conectarse a esta red. Con el fin de simplificar el acceso a un mayor número de usuarios, Tor Project ha lanzado un navegador web llamado Tor Browser que viene preparado para empezar a funcionar con tan sólo descargarlo sin necesidad de realizar ninguna configuración adicional.

### Debian 9 Stretch

Lo primero que vamos a realizar es agregar el repositorio Backports a nuestro sistema:

```bash
echo "deb http://deb.debian.org/debian stretch-backports main \
contrib" | sudo tee -a /etc/apt/sources.list.d/torbrowser.list
```
Una vez agregado el repositorio, actualizamos nuestros repositorios de sistema e instalamos el navegador Tor:

```bash
sudo apt-get update && \
sudo apt-get -y install torbrowser-launcher -t stretch-backports
```
A continuación ejecutamos el navegador, durante la primera ejecución se bajara e instalara la última versión.

### Debian 10 Buster

Lo primero que vamos a realizar es agregar el repositorio Backports a nuestro sistema:

```bash
echo "deb http://deb.debian.org/debian buster-backports main \
contrib" | sudo tee -a /etc/apt/sources.list.d/torbrowser.list
```
Una vez agregado el repositorio, actualizamos nuestros repositorios de sistema e instalamos el navegador Tor:

```bash
sudo apt-get update && \
sudo apt-get -y install torbrowser-launcher -t buster-backports
```
A continuación ejecutamos el navegador, durante la primera ejecución se bajara e instalara la última versión. 

> Sed buenos y no hagáis un mal uso de la red.
