---
title:  "Servidor FTP: Debian GNU/Linux"
date:   2021-03-25 23:30:00
last_modified_at: 2021-03-25T23:45:00
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
Aunque el protocolo `FTP` es una tecnología más antigua y por la que quizas hayan pasado sus días de gloria, todavía se utiliza en muchos sistemas y dispositivos de hardware. 

Por ejemplo algunas cámaras IP te permiten guardar fotos en un servidor FTP y por eso he pensado crearlo en el **Servidor**. 

Dicho esto vamos a ir entrando en materia, por eso en esta entrada vamos a compartir como realizar de forma sencilla un Servidor FTP.

Usaremos `vsftpd` ya que es una aplicación libre de Linux que es segura, estable y extremadamente rápida. 

Comenzamos actualizando repositorios del sistema e instalando la aplicación:

```bash
sudo apt-get update && \
sudo apt-get -y install vsftpd
```

Debemos detener el servicio en ejecución para poder configurarlo:

```bash
sudo systemctl stop vsftpd
```

El fichero de configuración se encuentra en la ruta `/etc/vsftpd.conf` y los parámetros que vamos a activar son los siguientes:
 * Desactivar la conexión anónima: `anonymous_enable=NO`
 * Activar el acceso local: `local_enable=YES`
 * Habilitar el acceso de escritura: `write_enable=YES`
 * Activar el uso a ruta enjaulada para mayor seguridad del sistema: `chroot_local_user=YES`
 * Definir banner acceso: `ftpd_banner=...`
 * Configurar ruta enjaulada del sistema: `user_sub_token=$USER`& `local_root=/home/$USER/FTP`

```bash
sudo sed -i 's/^#anonymous_enable=NO/anonymous_enable=NO/g' /etc/vsftpd.conf && \
sudo sed -i 's/^#local_enable=YES/local_enable=YES/g' /etc/vsftpd.conf && \
sudo sed -i 's/^#write_enable=YES/write_enable=YES/g' /etc/vsftpd.conf && \
sudo sed -i 's/^#local_umask=022/local_umask=022/g' /etc/vsftpd.conf && \
sudo sed -i 's/^#chroot_local_user=YES/chroot_local_user=YES/g' /etc/vsftpd.conf && \
sudo sed -i 's/^#ftpd_banner=Welcome to blah FTP service./ftpd_banner=Bienvenid@ a Overclock Server/g' /etc/vsftpd.conf && \
cat << EOF | sudo tee -a /etc/vsftpd.conf
# Mods by Lordpedal
user_sub_token=\$USER
local_root=/home/\$USER/FTP
EOF
```

A continuación creamos la ruta donde interactuaremos con el servicio y protegemos el acceso a los ficheros:

```bash
mkdir -p $HOME/FTP/Compartido && \
chmod a-w $HOME/FTP
```

Tras haber configurado debidamente el servicio, volvemos a ponerlo en ejecución:

```bash
sudo systemctl restart vsftpd
```

Debes recordar que para conectarte al Servidor de FTP usaras la **IP del Servidor, puerto de comunicación 21 y datos de login de tu sistema: usuario/contraseña**. 

Como posible ejemplo:

```bash
ftp://empalador:nocturno@192.168.1.90
```

**NOTA**: Si necesitas monitorizar las conexiones al Servidor FTP, puedes consultar el siguiente log: `sudo cat /var/log/vsftpd.log`
{: .notice--info}

Si además queremos tener un cliente para conectarnos a otros Servidores de FTP un cliente que recomiendo es FileZilla, que se encuentra libre en los repositorios de GNU/Linux Debian:

```bash
sudo apt-get update && \
sudo apt-get -y install filezillla
```

<figure>
    <a href="/assets/images/posts/filezilla.png"><img src="/assets/images/posts/filezilla.png"></a>
</figure>


> Y listo!
