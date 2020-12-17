---
title:  "TIP: Segurizar Navegador Firefox"
date:   2019-07-30 10:00:00 -0300
last_modified_at: 2020-12-12T16:45:00-05:00
categories:
  - Personal
tags:
  - Personal
toc: true
toc_sticky: true
toc_label: "Secciones"
toc_icon: "cog"
---

![Debian]({{ site.url }}{{ site.baseurl }}/assets/images/Debian.png)
En esta entrada voy a compartir mi configuración sobre el navegador web [Firefox](https://www.mozilla.org/){:target="_blank"}, no voy a entrar a tratar de explicar ventajas y desventajas de usar un navegador web u otro, eso os lo dejo a vuestra elección.

Entrando en materia, *¿es posible seguir mejorando la seguridad del navegador tras usar nuestro filtrado DNS?* Realmente si, aunque debemos de ser conscientes que **cuando tendemos a infinito en materia de seguridad tendemos a cero en experiencia usuario final y la restricción de calidad en el resultado esperado**.

Una configuración equlibrada para `Mozilla Firefox` en materia de seguridad y usabilidad es la que muestro a continuación.

Mis primeros pasos tras la ejecución del navegador es entrar en el apartado de `Preferencias` y dirigirme a la pestaña `Privacidad & Seguridad` para deshabilitar el `Historial` (**No recordar el historial**), nos solicitara reiniciar navegador.

A continuación deshabilito [WebRTC](https://es.wikipedia.org/wiki/WebRTC/){:target="_blank"}, **WebRTC** esta presente en Mozilla Firefox de su versión número 22 y se encuentra **habilitado por defecto**. Para desactivarlo en la ruta de la barra de navegación entramos en el siguiente enlace `about:config` para entrar en la sección avanzada configuración.
Nos saldra un cartel con un mensaje que nos dira algo como `¡Zona hostil para manazas!` y un click en `¡Acepto el riesgo!`, dentro debemos de usar el buscador y desactivar (**true -> false**) estas dos sentencias `media.peerconnection.enabled` y `media.navigator.enabled`.

Finalizado ya podremos cerrar la pestaña de configuración avanzada y pasaremos a instalar unos complementos de navegador que detallo para seguir securizando.

### [Privacy Badger](https://www.eff.org/privacybadger/){:target="_blank"}

Privacy Badger es una extensión de navegador gratuita creada por la [EFF](https://www.eff.org/){:target="_blank"}.

Su propósito es promover una aproximación equilibrada a la privacidad en internet entre consumidores y proveedores de contenido bloqueando anuncios y cookies rastreadoras que no respetan las configuraciones de No Seguimiento del usuario. Una parte de su código está basado en Adblock Plus pero Privacy Badger solo bloquea aquellos anuncios qué tienen rastreadores integrados.

**Privacy Badger se enfoca principalmente en el rastreo a través de terceros**, es decir, cuando un sitio web y sus anunciantes rastrean tus actividad de navegación sin que lo sepas, sin que tengas ningún control sobre ello, y sin que des tu consentimiento. Esto va mucho más allá de simples cookies de rastreo, de las que usualmente sabemos porque la ley les exige anunciarse cada vez que visitamos una web. Es una práctica cada vez más extendida y que puede considerarse maliciosa.

La herramienta te dice cuantos dominios ha detectado y si parecen o no ser rastreadores. Como usuario también tienes control en la forma en la que Privacy Badger trata esos dominios, puedes bloquearlos por completo, bloquear solo sus cookies o permitirlo si así lo deseas. 

[DESCARGAR](https://www.eff.org/files/privacy-badger-latest.xpi){:target="_blank"}

### [HTTPS Everywhere](https://www.eff.org/https-everywhere/){:target="_blank"}

HTTPS Everywhere es una extensión de navegador gratuita creada por la [EFF](https://www.eff.org/){:target="_blank"} en colaboración con [Tor Project](https://www.torproject.org/){:target="_blank"}.

Lo que **HTTPS Everywhere hace es reescribir todas esas peticiones originalmente hechas en HTTP en peticiones HTTPS**. La instalación del complemento es tan secilla como la de cualquier otro. Y aquí reitero esto: el plugin funcionará únicamente en sitios web que soporten HTTPS.

[DESCARGAR](https://www.eff.org/files/https-everywhere-latest.xpi){:target="_blank"}

> Disfrutad de vuestra nueva experiencia de navegación.
