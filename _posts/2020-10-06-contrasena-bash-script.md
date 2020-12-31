---
title:  "Contraseña: Bash Script"
date:   2020-10-06 08:45:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
Esta entrada voy a compartir un sencillo [Bash Script](https://es.wikipedia.org/wiki/Bash){:target="_blank"}, que nos va a permitir realizar una determinada opción según la contraseña del usuario, sin tener que añadir otro usuario específico al sistema.

Un posible cliente de este tipo de script puede ser por ejemplo:

- Un PC **Portatil**
- Una **Raspberry u otra placa SBC**

Como ejemplo en el script preconfiguro tres usuarios y acciones diferentes:

| Usuario | Password | Acción |
| ------ | ------ | ------ |
| `Virginia` | `virg` | Arranca Entorno gráfico |
| `Iris` | `iris` | Arranca Kodi |
| `J.Marcos` | `jmla` | Arranca Terminal |
{: .notice--info}

Si introducimos erroneamente la contraseña **x3 veces**, el dispositivo se apagará a modo de filtro.

Para configurarlo sobre nuestra base Debian seguimos este **mini-tutorial**. 

Creamos la carpeta de trabajo donde alojaremos el script, entramos en ella y satisfacemos dependencias del script:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
sudo apt-get update && \
sudo apt-get -y install coreutils espeak
```

Las contraseñas las he codificado en lenguaje [base64](https://es.wikipedia.org/wiki/Base64){:target="_blank"}, el proceso de obtención es tan sencillo como ejecutar el siguiente comando:

```bash
echo contraseña | base64
```

Muestro proceso de obtención de las claves cifradas para el ejemplo:

```bash
pi@overclock:~/scripts$ echo virg | base64
dmlyZwo=
pi@overclock:~/scripts$ echo iris | base64
aXJpcwo=
pi@overclock:~/scripts$ echo jmla | base64
am1sYQo=
```

A continuación creamos el script:

```bash
nano contraseña.sh
```

Añadimos el contenido del fichero con las contraseñas generadas:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# Contraseñas Base64
VIRG="dmlyZwo="
JMLA="am1sYQo="
IRIS="aXJpcwo="
# Decode contraseñas Base64
CALVIRG=$(echo `echo $VIRG | base64 --decode`)
CALJMLA=$(echo `echo $JMLA | base64 --decode`)
CALIRIS=$(echo `echo $IRIS | base64 --decode`)
# Temporal Login
BOOTLOGIN="/tmp/bootlogin"
UNLOCKLOG="/tmp/unlocklogin"
touch $BOOTLOGIN
# Evita bypass script
trap '' INT TSTP
# Inicia check
if [ ! -f $UNLOCKLOG ]; then
        echo
        if [ -z "$DISPLAY" ] && [ $(tty) == /dev/tty1 ]; then
                echo
                sleep 1
                # Bucle ejecucion x3
                contador=1
                while [ $contador -lt 4 ]; do
                # Oculta entrada contraseña por asterisco
                unset SECRET_PASSWD
                PROMPT="Introduzca su password: "
                while IFS= read -p "$PROMPT" -r -s -n 1 char; do
                        if [[ $char == $'\0' ]]; then
                                break
                        fi
                PROMPT='*'
                SECRET_PASSWD+="$char"
                done
                echo
                # Compara contraseña
                if [ -z $SECRET_PASSWD ]; then
                        echo "Contraseña fallida, intento nº$contador"
                        espeak -ves "Contraseña fallida"
                        espeak -ves "Intento numero $contador"
                        let contador=contador+1
                else
                        if [ $CALVIRG = $SECRET_PASSWD ]; then
                                echo "Bienvenida Virginia"
                                espeak -ves+f2 "Bienvenida Virginia"
                                rm $BOOTLOGIN
                                touch $UNLOCKLOG
                                sleep 1
                                let contador=contador+3
                                startx
                        elif [ $CALJMLA = $SECRET_PASSWD ]; then
                                echo "Bienvenido J.Marcos"
                                espeak -ves "Bienvenido J.Marcos"
                                sleep 1
                                rm $BOOTLOGIN
                                touch $UNLOCKLOG
                                let contador=contador+3
                        elif [ $CALIRIS = $SECRET_PASSWD ]; then
                                echo "Bienvenida Iris"
                                espeak -ves "Bienvenida Iris"
                                sleep 1
                                rm $BOOTLOGIN
                                touch $UNLOCKLOG
                                let contador=contador+3
                                /usr/bin/xinit /usr/bin/dbus-launch --exit-with-session /usr/bin/kodi-standalone -- :0 -nolisten tcp vt7
                        else
                                echo "Contraseña fallida, intento nº$contador"
                                espeak -ves "Contraseña fallida"
                                espeak -ves "Intento numero $contador"
                                let contador=contador+1
                        fi
                fi
                done
       else
                echo
                rm $BOOTLOGIN
       fi
else
       echo
       rm $BOOTLOGIN
fi
if [ -f $BOOTLOGIN ]; then
sleep 1
echo "Hasta la vista coleguita!"
espeak -ves+m2 "Hasta la vista coleguita"
sleep 1
sudo poweroff
fi
```

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x contraseña.sh
```

Vamos creamos un enlace simbólico a la ruta de ejecutables:

```bash
sudo ln -s $HOME/scripts/contraseña.sh \
/usr/local/bin/contraseña
```

En lo personal, me gusta añadir el script a la carga del fichero **.bashrc** de nuestro usuario en el sistema, condicionandolo a la salida de terminal:

```bash
nano $HOME/.bashrc
```

Añadiendo el siguiente código al final del fichero:

```bash
if [ -z "$DISPLAY" ] && [ $(tty) == /dev/tty1 ]; then
contraseña
fi
```

Guardamos y salimos del editor.

Otra opción sería añadirlo como alternativa a **.bashrc** por ejemplo a **crontab, rc.local, ...**

El script admite múltiples mejoras, pero cumple de sobra la idea inicial de hacer algo sencillo y funcional. Siéntete libre de adaptarlo y mejorarlo.

> Y listo!
