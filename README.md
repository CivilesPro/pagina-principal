# Civiles Pro — Guía de despliegue a producción

Esta guía resume la configuración necesaria para dejar el backend (FastAPI en Render) y el frontend (Vite + React en Vercel/Netlify) listos para producción.

## 1. Frontend

### Variables de entorno (Vercel / Netlify)
Configura las variables de entorno públicas en tu proveedor del frontend:

```
VITE_API_URL=https://plantilladecantidades.onrender.com
VITE_PAYPAL_CLIENT_ID=<CLIENT_ID_SANDBOX>
VITE_ENV=production
```

> Cuando pases a Live, solo cambia `VITE_PAYPAL_CLIENT_ID` por el ID real de PayPal.

### Build y deploy

1. Instala dependencias (`npm install`).
2. Ejecuta el build (`npm run build`).
3. Sube la carpeta `dist/` a Vercel/Netlify o conecta el repositorio (build command: `npm run build`, output dir: `dist`).
4. Si usas Netlify y manejas rutas internas, añade un archivo `_redirects` con `/* /index.html 200`.

## 2. Backend (Render)

### CORS permitido
Ya está configurado para aceptar las siguientes URLs:

- `https://civilespro.com`
- `https://www.civilespro.com`
- `https://<tu-dominio-frontend>.vercel.app`
- `https://<tu-dominio-frontend>.netlify.app`
- `http://localhost:5173` (desarrollo)

Puedes ampliar la lista agregando dominios en la variable `CORS_ORIGINS` de Render (valores separados por coma).

### Variables de entorno PayPal (Render)

```
APP_ENV=production
PAYPAL_CLIENT_ID=<SANDBOX_CLIENT_ID>
PAYPAL_SECRET=<SANDBOX_SECRET>
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

Para pasar a Live, actualiza:

```
PAYPAL_CLIENT_ID=<LIVE_CLIENT_ID>
PAYPAL_SECRET=<LIVE_SECRET>
PAYPAL_API_BASE=https://api-m.paypal.com
```

### Ejecución de Uvicorn

Render usa el comando `web: uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers`. No necesitas servir archivos desde Render (se recomienda entregar URLs firmadas de S3/Backblaze).

## 3. Cambiar de Sandbox a Live

1. Obtén las credenciales Live de PayPal (Client ID y Secret) y actualiza las variables en Render.
2. Cambia `VITE_PAYPAL_CLIENT_ID` en tu proveedor del frontend al Client ID Live.
3. Despliega nuevamente el frontend para propagar el cambio.
4. Verifica un pago real en producción.

## 4. Checklist de verificación

- `https://plantilladecantidades.onrender.com/docs` responde correctamente.
- `GET https://plantilladecantidades.onrender.com/health` devuelve `{ "status": "ok" }`.
- En el frontend en producción:
  - Los precios muestran el valor y el código de moneda seleccionado.
  - Se visualizan los avisos “Descarga inmediata” y “Pagos en USD por PayPal”.
  - El flujo PayPal Sandbox completa: crear orden → popup sandbox → pago OK → botón **Descargar** disponible.
- Tras cambiar a PayPal Live, repite la prueba con una transacción real.

Con estos pasos la aplicación queda lista para producción y conmutar entre entornos Sandbox/Live de forma segura.
