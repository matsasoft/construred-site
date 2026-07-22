# Migrar a Google Tag Manager en lugar de GA4 directo

A petición del cliente migramos el analytics del sitio de gtag.js/GA4 directo (measurement ID `G-NC0XCEQBRT`, antes en `PUBLIC_GA_MEASUREMENT_ID`) al contenedor de **Google Tag Manager `GTM-W5VT3FZV`**. Ya no queda ningún measurement ID de GA4 en el código: la etiqueta de GA4 vive **dentro** del contenedor GTM, administrada por el cliente. Reemplazamos por completo el bloque anterior (en lugar de dejar ambos) para evitar el doble conteo de pageviews que ocurre cuando gtag.js directo y una etiqueta GA4 dentro de GTM se disparan a la vez.

Como consecuencia también se eliminó el evento personalizado `anchor_click` que rastreaba la navegación por anclas: cualquier rastreo de eventos ahora se configura desde GTM. La anonimización de IP y otros ajustes de privacidad dejan de controlarse desde código y pasan a ser responsabilidad del contenedor GTM.

## El ID de GTM vive donde corre `astro build` — y hay DOS lugares

`PUBLIC_GTM_ID` es una variable de build-time: Astro la hornea en el HTML estático al construir. El sitio se construye en **dos** entornos, y ambos deben tenerla o GTM desaparece silenciosamente:

1. **Deploy manual** — `uploader.sh` desde la máquina del dev, que ya inyecta `PUBLIC_GTM_ID=GTM-W5VT3FZV` en línea y hace `rsync` a la VPS.
2. **Rebuild automático desde el CMS** — el CMS (`construred-cms`) tiene hooks `afterChange` en todos sus globals/colecciones que, vía `REBUILD_WEBHOOK_URL` (configurada en producción), disparan un rebuild del sitio **en la VPS**, donde el código vive en `/opt/construred-site` y lee su propio `/opt/construred-site/.env`.

Por lo tanto, cambiar el analytics (o cualquier variable pública) exige actualizar **ambos**: el build local (`uploader.sh`) **y** `/opt/construred-site/.env` en la VPS. Si solo se actualiza `uploader.sh`, el siguiente cambio de contenido en el CMS reconstruye el sitio con el `.env` viejo de la VPS y **sobrescribe** el deploy manual, dejando el sitio sin GTM. Ver [DEPLOY.md](../../DEPLOY.md).
