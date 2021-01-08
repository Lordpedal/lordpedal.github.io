---
title:  "Telegram Bot RSS: Python Script"
date:   2021-01-08 18:30:00
last_modified_at: 2021-01-08T18:45:00
categories:
  - GNU/Linux
tags:
  - GNU/Linux
  - Debian
  - Servidor
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
{: .full}
Esta entrada voy a compartir un sencillo Script de Python creado por [Ljubiša Moćić](https://github.com/ljmocic){:target="_blank"} que he readaptado para darle un nuevo formato.

Dicho script nos va a publicar las noticias de un feed RSS de forma automática en nuestro Telegram.

Para configurarlo sobre nuestra base Debian seguimos este **mini-tutorial**.

### Crear Bot Telegram

- Creamos conversación con `@BotFather`

**NOTA:** Usar solo Bot Oficial de Telegram
{: .notice--info}

![Telegram]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Telebot1.jpg)

- Creamos nuevo bot con el comando `/newbot`, le asignamos un nombre y obtendremos un Token

![Telegram]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Telebot2.jpg)

- Anotamos Token obtenido para posterior uso

1579933052:AAH-SwCYA_u7Jx5OZiTBM8VPZN1kkkveCvk
{: .notice--info}


### Script Python Telegram

En primer lugar creamos las carpetas donde alojar el proyecto:

```bash
mkdir -p $HOME/scripts && \
cd $HOME/scripts
```

Actualizamos repositorios y satisfacemos dependencias de sistema:

```bash
sudo apt-get update && \
sudo apt-get -y install python3-pip && \
sudo pip3 install requests feedparser
```

Ahora vamos a crear el fichero script lanzando el siguiente comando:

```bash
cat << EOF > $HOME/scripts/botrss.py
#!/usr/bin/env python3
#! python3
# -*- coding: utf-8 -*-
#
# https://lordpedal.github.io
# Modificado por Lordpedal
#
# Idea original: https://github.com/ljmocic
# Gist original: https://gist.github.com/ljmocic/ec013451ff8bbb51f308d79975d7fdb4

# Librerias Python
from datetime import timedelta, datetime
from dateutil import parser
from pprint import pprint
from time import sleep
import time
import requests
import feedparser

# Variables Script
TOKEN_BOT = '1579933052:AAH-SwCYA_u7Jx5OZiTBM8VPZN1kkkveCvk' # Bot @Overspeed_Bot
CONTACTO_ID = '79593223' # ID Telegram: Consultar @Lordpedalbot
RSS_URL = 'https://lordpedal.github.io/lordpedal/feed.xml' # Lordpedal RSS

# Formato Mensaje
# - Habilitada escritura Markdown (parse_mode=Markdown)
#       - Alternativa HTML a Markdown (parse_mode=HTML)
#
# - Deshabilitada vista previa enlaces (disable_web_page_preview=true)
#       - Alternativa para habilitar vista previa (disable_web_page_preview=false)
#
def send_message(message):
    requests.get(f'https://api.telegram.org/bot{TOKEN_BOT}/sendMessage?chat_id={CONTACTO_ID}&parse_mode=Markdown&disable_web_page_preview=true&text={message}')

# Estructura Mensaje
def main():
    rss_feed = feedparser.parse(RSS_URL)

    for entry in rss_feed.entries:

        parsed_date = parser.parse(entry.published)
        parsed_date = (parsed_date - timedelta(hours=1)).replace(tzinfo=None)
        now_date = datetime.utcnow()

        published_30_minutes_ago = now_date - parsed_date <= timedelta(minutes=30)
        if published_30_minutes_ago:
            send_message('*Noticias Random*\n' + (time.strftime("_%d/%m/20%y_")) + '\n\n' + '*' + entry.title + '*' + '\n\n' + 'Enlace noticia: ' + entry.links[0].href)
            print(entry.links[0].href)

# Iniciar Script
if __name__ == "__main__":
    while(True):
        main()
        sleep(30 * 60)
#------------------------------------------------------------
# Another fine release by Lordpedal
#------------------------------------------------------------
EOF
```

Vamos a repasar los principales parámetros a modificar para adaptarlos a nuestro sistema y configuración especifica:

| Parámetro | Función |
| ------ | ------ |
| `TOKEN_BOT = '1579933052:AAH-SwCYA_u7Jx5OZiTBM8VPZN1kkkveCvk'` | Sustituir por Token de `bot` generador Telegram |
| `CONTACTO_ID = '79593223'` | Susituir ID , Consultar @Lordpedalbot para obtener |
| `RSS_URL = 'https://lordpedal.github.io/lordpedal/feed.xml'` | Sustituir lista Feed de Noticias |
{: .notice--warning}

Una vez configurado, programamos el sistema para que el script sea ejecutado al arrancar el sistema, tras darle permisos de ejecución:

```bash
chmod +x ~/scripts/botrss.py && crontab -e
```

Y añadimos al final el fichero:

```bash
@reboot /usr/bin/python3 ~/scripts/botrss.py >/dev/null 2>&1
```

Guardamos, salimos del editor y reiniciamos el sistema para disfrutar la nueva configuración:

```bash
sudo reboot
```

![Telegram]({{ site.url }}{{ site.baseurl }}/assets/images/posts/Telebot3.jpg)


> Y listo!
