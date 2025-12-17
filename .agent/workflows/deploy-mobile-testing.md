---
description: Deploy to production (Vercel + Render)
---

# 🚀 Guía de Despliegue a Producción

Esta aplicación se despliega en dos partes:
- **Frontend (Vite/React)** → Vercel
- **Backend (Express)** → Render

---

## Paso 1: Desplegar el Backend en Render

### 1.1 Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub (recomendado)

### 1.2 Crear un nuevo Web Service
1. Click en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Selecciona este repositorio

### 1.3 Configuración del servicio
- **Name**: `interesting-phrases-api` (o el nombre que prefieras)
- **Region**: Oregon (US West) o el más cercano a ti
- **Branch**: `main`
- **Root Directory**: (dejar vacío)
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: Free

### 1.4 Variables de Entorno
En la sección "Environment Variables", añade:
```
NOTION_SECRET=<tu_notion_secret>
DATABASE_ID=<tu_database_id>
```

**Nota**: Obtén estos valores de tu archivo `.env` local


### 1.5 Desplegar
1. Click en "Create Web Service"
2. Espera a que termine el despliegue (2-3 minutos)
3. **Copia la URL** que te da Render (ej: `https://interesting-phrases-api.onrender.com`)

---

## Paso 2: Desplegar el Frontend en Vercel

### 2.1 Instalar Vercel CLI (si no lo tienes)
```bash
npm i -g vercel
```

### 2.2 Desplegar
// turbo-all
Desde la raíz del proyecto:
```bash
vercel
```

### 2.3 Responder las preguntas
- Set up and deploy? → **Y**
- Which scope? → (tu cuenta)
- Link to existing project? → **N**
- Project name? → (presiona Enter para usar el nombre por defecto)
- In which directory is your code located? → **.**
- Want to override settings? → **Y**
  - Build Command? → `npm run build`
  - Output Directory? → `dist`
  - Development Command? → `npm run dev:client`

### 2.4 Configurar Variable de Entorno
Después del primer despliegue:
```bash
vercel env add VITE_API_URL
```
- Valor: La URL de tu backend en Render + `/api/phrases`
  - Ejemplo: `https://interesting-phrases-api.onrender.com/api/phrases`
- Environment: **Production**

### 2.5 Re-desplegar con la variable
```bash
vercel --prod
```

---

## Paso 3: Verificar

1. Abre la URL de Vercel en tu navegador
2. Abre la misma URL en tu móvil
3. ¡Listo! Tu app está en producción 🎉

---

## Comandos Útiles

### Ver logs del backend (Render)
Ve al dashboard de Render → tu servicio → pestaña "Logs"

### Re-desplegar frontend
```bash
vercel --prod
```

### Ver deployments
```bash
vercel ls
```

---

## Notas Importantes

⚠️ **Render Free Tier**: El backend se "duerme" después de 15 minutos de inactividad. La primera petición después de dormir puede tardar 30-60 segundos.

💡 **Alternativa**: Si quieres evitar el "sleep", puedes usar Railway (también gratis pero sin sleep) o actualizar a Render Starter ($7/mes).

🔒 **Seguridad**: Las variables de entorno están protegidas y no se suben a GitHub.

📱 **PWA**: Si quieres que tu app sea instalable en móvil, puedes añadir un manifest.json más adelante.
