# Despliegue — construred-site

El sitio es un build **estático** de Astro. `PUBLIC_GTM_ID`, `PUBLIC_CMS_API_URL` y `CMS_API_URL` son variables de **build-time**: Astro las hornea en el HTML/JS al construir. Lo que se sirve en la VPS son solo los archivos ya compilados.

## ⚠️ El sitio se construye en DOS lugares — mantén ambos sincronizados

Cualquier cambio a una variable pública (p. ej. el ID de Google Tag Manager) debe aplicarse en **los dos**:

| # | Entorno de build | Fuente de las variables | Cuándo corre |
|---|---|---|---|
| 1 | Máquina del dev (`uploader.sh`) | Variables en línea dentro de `uploader.sh` | Deploy manual |
| 2 | VPS, `/opt/construred-site` | `/opt/construred-site/.env` | Rebuild automático disparado por el CMS |

**El CMS reconstruye el sitio al guardar contenido.** `construred-cms` tiene hooks `afterChange` en todos sus globals/colecciones que, vía `REBUILD_WEBHOOK_URL` (configurada en producción), disparan un rebuild en la VPS usando `/opt/construred-site/.env`.

> **Trampa a evitar:** si actualizas solo `uploader.sh` y dejas viejo el `.env` de la VPS, el siguiente cambio de contenido en el CMS reconstruye el sitio con las variables viejas y **sobrescribe tu deploy manual**. Para GTM eso significa que el sitio se queda sin analytics sin que nadie lo note.

## Deploy manual

Desde la raíz del proyecto:

```bash
./uploader.sh
```

Hace `astro build` (modo producción → GTM se activa) con las variables públicas en línea y sube `dist/` a la VPS con `rsync --delete`.

## Actualizar el `.env` de la VPS

Tras cambiar una variable pública en `uploader.sh`, replica el cambio en la VPS:

```bash
ssh deployer@construred-vps
nano /opt/construred-site/.env      # ajusta la variable (p. ej. PUBLIC_GTM_ID)
```

Las variables actuales que debe contener `/opt/construred-site/.env`:

```
CMS_API_URL=https://admin.miconstrured.com
PUBLIC_CMS_API_URL=https://admin.miconstrured.com
PUBLIC_GOOGLE_MAPS_API_KEY=<api key>
PUBLIC_GTM_ID=GTM-W5VT3FZV
```

## Verificar GTM en producción

Abre `https://construred.mx`, DevTools → **Network**, filtra por `gtm.js` — debe cargar `gtm.js?id=GTM-W5VT3FZV`. Alternativa: extensión **Google Tag Assistant**.

## Analytics: tracking gestionado desde GTM

El sitio ya no manda eventos a GA4 directamente. Empuja al `dataLayer` para que el cliente los enganche con triggers en el contenedor GTM:

- `contact` — clic en el botón de WhatsApp (variable `method`)
- `generate_lead` — envío exitoso del formulario de contacto (variables `form_name`, `asunto`)
