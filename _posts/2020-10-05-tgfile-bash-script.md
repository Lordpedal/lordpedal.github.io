---
title:  "TGfile: Bash Script"
date:   2020-10-05 11:45:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
header:
  teaser: /assets/images/Debianth.png
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
Esta entrada voy a compartir un sencillo [Bash Script](https://es.wikipedia.org/wiki/Bash){:target="_blank"}, que nos va a permitir enviar ficheros a demanda, desde nuestra `Estación de trabajo/PC/Servidor` a [Telegram](https://web.telegram.org/){:target="_blank"}.

Para poder configurar el script tan solo has de editar estas dos variables del script:

- `telegram`: Es el ID que te identifica en la red Telegram, si estableces una conversación con el bot [@lordpedalbot](https://t.me/Lordpedalbot){:target="_blank"} te dira cual es.
- `token`: Solamente si dispones de un bot propio y quieres usarlo cambia ese valor, en caso contrario no es necesario modificar la variable.

Para configurarlo sobre nuestra base Debian seguimos este **mini-tutorial**. 

Creamos la carpeta de trabajo donde alojaremos el script, entramos en ella y satisfacemos dependencias del script:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
sudo apt-get update && \
sudo apt-get -y install curl
```

A continuación creamos el script:

```bash
nano tgfile.sh
```

Añadimos el contenido del fichero y al menos modifica la variable `telegram=`:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# ID Telegram (Consulta @Lordpedalbot)
telegram=79593223
# BOT
token=289352425:AAHBCcKicDtSFaY2_Gq1brnXJ5CaGba6tMA
url=https://api.telegram.org/bot$token
# Archivo a enviar
archivo=$1
# Mensaje Online
mensaje='Another fine release by Lordpedal'
# Inicia bucle chequeo de Red
while true
do
# Comprueba disponibilidad de Red
  if ping -c 1 -W 5 google.com 1>/dev/null 2>&1
  then
    if [ -f "$archivo" ]; then
    # Red disponible
    echo -e "\e[0;32mConexion establecida...Enviando archivo\e[0m"
    /usr/bin/curl -s \
     -o /dev/null \
     -F chat_id="$telegram" \
     -F document=@"$archivo" \
     -F caption="$mensaje" \
     $url/sendDocument
    echo -e "\e[0;37mArchivo \e[0m\e[1;33m$archivo\e[0m \e[0;37menviado correctamente\e[0m"
    # Termina bucle disponibilidad de Red
    break
    else
    echo -e "\e[1;31mFichero a enviar no definido\e[0m"
    break
    fi
  else
    # Red no disponible
    echo -e "\e[1;33mConexion no establecida...\e[0m"
  fi
  # Espera 1s y reinicia bucle
  sleep 1
done
```

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x tgfile.sh
```

Vamos creamos un enlace simbólico a la ruta de ejecutables:

```bash
sudo ln -s $HOME/scripts/tgfile.sh \
/usr/local/bin/tgfile
```

A partir de este momento con ejecutar la orden `tgfile + fichero` nos llegara a nuestro Telegram, muy util si trabajamos en remoto por ejemplo desde conexiones SSH.

Si lo ejecutamos con variable de fichero nos devolvera:

```bash
pi@overclock:~/scripts$ tgfile tshh.log
Conexion establecida...Enviando archivo
Archivo tshh.log enviado correctamente
```

Si lo ejecutamos sin variable de fichero nos devolvera:

```bash
pi@overclock:~/scripts$ tgfile
Fichero a enviar no definido
```

El script admite múltiples mejoras, pero cumple de sobra la idea inicial de hacer algo sencillo y funcional. Siéntete libre de adaptarlo y mejorarlo.


> Y listo!
