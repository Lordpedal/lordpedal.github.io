---
title:  "AdGuard: Docker"
date:   2021-02-27 23:30:00
header:
  image: /assets/images/posts/dockertt.gif
last_modified_at: 2021-02-27T23:45:00
categories:
  - GNU/Linux
  - Docker
tags:
  - GNU/Linux
  - Debian
  - Docker
---

![Docker]({{ site.url }}{{ site.baseurl }}/assets/images/Docker.png){: .align-center}
{: .full}
[AdGuard](https://adguard.com){: .btn .btn--warning .btn--small}{:target="_blank"} es un software a nivel de red para bloqueo de anuncios y rastreadores.

Vamos a realizar una pequeña comparativa entre los dos grandes servicios de seguridad DNS:

| Novedad                                                             | AdGuard | Pi-Hole |
|---------------------------------------------------------------------|---------|---------------------------------------------|
| Bloqueo publicidad                                                  |  ✅     | ✅ |
| Personalizar listas bloqueo                                         |  ✅     | ✅ |
| Soporte servidor DHCP                                               |  ✅     | ✅ |
| Servidores DNS Encriptados (DNS-over-HTTPS, DNS-over-TLS, DNSCrypt) |  ✅     | ✅ **P3DNS** |
| Multi-plataforma                                                    |  ✅     | ✅ **Docker** |
| Bloqueo phishing y malware                                          |  ✅     | ✅ **Listas** |
| Bloqueo contenido dominios adultos                                  |  ✅     | ✅ **Listas** |
| Forzar realizar busqueda servidores seguros                         |  ✅     | ❌ **No soporta perfiles individuales** |
| Configuración dispositivos                                          |  ✅     | ✅ |
| Acceso individualizado configuración                                |  ✅     | ❌ **No soporta perfiles individuales** |
| Frecuencia actualizaciones                                          |  ❌     | ✅ **Listas en constante actualización por la comunidad** |
| Desarrolladores globales                                            |  ❌     | ✅ **Software Libre no Privativo** |

La comparativa esta bastante equilibrada, solamente voy a recomendar usar AdGuard en dispositivos de bajos recursos como he probado en una `Raspberry 1B+` y en entornos donde sea imperativo el uso de perfiles individuales en vez de uno general. 

El motivo es que esta desarrollado en **Go** y requiere de menor uso de recursos del sistema.

**NOTA**: Para uso en el servidor recomiendo usar [**P3DNS**](https://lordpedal.github.io/gnu/linux/docker/debian-docker-ce/#docker-p3dns){: .btn .btn--inverse .btn--small}{:target="_blank"} como solución más completa.
{: .notice--info}

Vamos a realizar unos pasos previos para preparar el entorno. En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/docker/adguard/{config,datos} && \
cd $HOME/docker/adguard
```

Ahora vamos a crear el fichero de configuración `docker-compose.yml` lanzando el siguiente comando:

```bash
cat << EOF > $HOME/docker/adguard/docker-compose.yml
version: "2.1"
services:
  adguardhome:
    image: adguard/adguardhome
    container_name: AdGuard
    ports:
      - 53:53/tcp
      - 53:53/udp
      - 67:67/udp
      - 68:68/tcp
      - 68:68/udp
      - 853:853/tcp
      - 3000:3000/tcp
      - 80:80/tcp
    volumes:
      - '~/docker/adguard/datos:/opt/adguardhome/work'
      - '~/docker/adguard/config:/opt/adguardhome/conf'
    restart: always
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `53:53/tcp` | Puerto de gestión DNS `TCP` |
| `53:53/udp` | Puerto de gestión DNS `UDP` |
| `67:67/udp` | Puerto utilizado para gestión servicios **DHCP** `UDP` |
| `68:68/tcp` | Puerto utilizado para gestión servicios **DHCP** `TCP` |
| `68:68/udp` | Puerto utilizado para gestión servicios **DHCP** `UDP` |
| `853:853/tcp` | Puerto utilizado para gestión conexiones **DNS-over-TLS** |
| `3000:3000/tcp` | Puerto utilizado para configurar instalación |
| `80:80/tcp` | Puerto utilizado para gestión interfaz Web |
| `~/docker/adguard/datos:/opt/adguardhome/work` | Ruta donde se almacena los datos |
| `~/docker/adguard/config:/opt/adguardhome/conf` | Ruta donde se almacena la configuración |
| `restart: always` | Habilitamos que tras reiniciar la maquina anfitrion vuelva a cargar el servicio |
{: .notice--warning}

Una vez configurado, lo levantamos para ser creado y ejecutado:

```bash
docker-compose up -d
```

Ahora para activar nuestro servidor de DNS, asignamos nuestro localhost como servidor de resolución DNS y protegemos el fichero contra escritura:

```bash
sudo mv /etc/resolv.conf /etc/resolv.conf.adg && \
echo "nameserver 127.0.0.1" | sudo tee -a /etc/resolv.conf && \
sudo chattr +i /etc/resolv.conf
```

Tras ello, podremos configurar el servicio, que en mi caso estaría disponible en la dirección web [http://rpi1b.local:3000](http://localhost:3000){: .btn .btn--inverse .btn--small}{:target="_blank"}

Durante el primer acceso veremos un asistente de configuración dandonos la bienvenida:

<figure>
    <a href="/assets/images/posts/adguard1.jpg"><img src="/assets/images/posts/adguard1.jpg"></a>
</figure>

Nos solicita los puertos e interfaces donde puede gestionar la protección, por defecto lo dejamos como la imágen para proteger todas las interfaces:

<figure>
    <a href="/assets/images/posts/adguard2.jpg"><img src="/assets/images/posts/adguard2.jpg"></a>
</figure>

Debemos de crear un usuario y contraseña de administración:

<figure>
    <a href="/assets/images/posts/adguard3.jpg"><img src="/assets/images/posts/adguard3.jpg"></a>
</figure>

Nos da unas pautas de configuración en diferentes dispositivos, podemos obviar el proceso y continuar:

<figure>
    <a href="/assets/images/posts/adguard4.jpg"><img src="/assets/images/posts/adguard4.jpg"></a>
</figure>

Obtenemos un nuevo aviso de que el servicio ha sio debidamente configurado:

<figure>
    <a href="/assets/images/posts/adguard5.jpg"><img src="/assets/images/posts/adguard5.jpg"></a>
</figure>

A partir de este momento ya podremos entrar a la interfaz Web que se encuentra en el puerto **:80** [http://rpi1b.local](http://localhost:80){: .btn .btn--inverse .btn--small}{:target="_blank"}

<figure>
    <a href="/assets/images/posts/adguard6.jpg"><img src="/assets/images/posts/adguard6.jpg"></a>
</figure>

> Y listo!
