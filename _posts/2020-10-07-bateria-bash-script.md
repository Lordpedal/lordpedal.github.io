---
title:  "Batería: Bash Script"
date:   2020-10-07 12:25:00 -0300
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
Esta entrada voy a compartir un sencillo [Bash Script](https://es.wikipedia.org/wiki/Bash){:target="_blank"}, que nos va a notificar sobre la carga disponible en la batería de nuestro dispositivo para alargar la vida de la misma.

Un posible cliente de este tipo de script puede ser por ejemplo:

- Un PC **Portatil**
- Una **Raspberry u otra placa SBC** alimentada con batería

Para configurarlo sobre nuestra base Debian seguimos este **mini-tutorial**. 

Creamos la carpeta de trabajo donde alojaremos el script, entramos en ella y satisfacemos dependencias del script:

```bash
mkdir -p $HOME/scripts && cd $HOME/scripts && \
sudo apt-get update && \
sudo apt-get -y install libnotify-bin
```
A continuación creamos el script:

```bash
nano bateria.sh
```

Añadimos el contenido del fichero con las contraseñas generadas:

```bash
#!/bin/bash
#
# https://lordpedal.github.io
# Another fine release by Lordpedal
#
# Variables trabajo
export DISPLAY=:0
ALARMA="/tmp/batwarn"
BATLVL=$(cat /sys/class/power_supply/BAT0/capacity)
ADPSTS=$(cat /sys/class/power_supply/ADP1/online)
# Condicional carga
if [ $ADPSTS == 1 ] && [ $BATLVL -ge 85 ]; then
        notify-send --urgency=normal \
         --expire-time=8000 --app-name=Bateria \
         --icon=battery 'Carga de batería '$BATLVL'%' 'Desconecta el cargador por favor'
        touch $ALARMA
elif [ $ADPSTS == 0 ] && [ $BATLVL -le 20 ]; then
        notify-send --urgency=low \
         --expire-time=8000 --app-name=Bateria \
         --icon=battery 'Carga de batería '$BATLVL'%' 'Conecta el cargador por favor'
        touch $ALARMA
else
    if [ -f $ALARMA ]; then
        rm $ALARMA
    fi
fi
# Condicionales apagado
if [ $ADPSTS == 0 ] && [ $BATLVL == 10 ]; then
        notify-send --urgency=normal \
         --expire-time=8000 --app-name=Bateria \
         --icon=battery 'Alarma LSL '$BATLVL'%' 'Guarda los trabajos...'
        touch $ALARMA
elif [ $ADPSTS == 0 ] && [ $BATLVL -lt 5 ]; then
        notify-send --urgency=critical \
         --expire-time=8000 --app-name=Bateria \
         --icon=battery 'Alarma LSLL '$BATLVL'%' 'Ciao CMON!'
        touch $ALARMA
        sleep 5
        # Apagado sistema
        sudo poweroff
else
    if [ -f $ALARMA ]; then
        rm $ALARMA
    fi
fi
exit 0
```

Guardamos el fichero, salimos del editor y le damos permisos de ejecución:

```bash
chmod +x bateria.sh
```

Vamos a crear una tarea programa en **cron** para su ejecución en segundo plano:

```bash
crontab -e
```

Añadiendo el siguiente código al final del fichero para que sea **ejecutado cada 20 segundos**:

```bash
*/1 * * * * ~/scripts/bateria.sh >/dev/null 2>&1
*/1 * * * * sleep 20 && ~/scripts/bateria.sh >/dev/null 2>&1
*/1 * * * * sleep 40 && ~/scripts/bateria.sh >/dev/null 2>&1
```

Guardamos y salimos del editor.

El script admite múltiples mejoras, pero cumple de sobra la idea inicial de hacer algo sencillo y funcional. Siéntete libre de adaptarlo y mejorarlo.

> Y listo!
