# 🚀 Despliegue a Producción - Guía Rápida

Tu aplicación está lista para desplegarse a producción. Sigue estos pasos:

## 📋 Resumen
- **Frontend**: Vercel (gratis, ultra rápido)
- **Backend**: Render (gratis, confiable)

---

## 🔧 Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `interesting-phrases` (o el que prefieras)
3. **Importante**: Déjalo como **público** (o privado si tienes cuenta Pro)
4. **NO** marques "Initialize with README" (ya tienes uno)
5. Click en "Create repository"

6. Copia los comandos que GitHub te muestra y ejecútalos aquí:
```bash
git remote add origin https://github.com/TU_USUARIO/interesting-phrases.git
git branch -M main
git push -u origin main
```

---

## 🌐 Paso 2: Desplegar Backend en Render

### Opción A: Desde la Web (Más Fácil)

1. Ve a [render.com](https://render.com) y regístrate con GitHub
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio `interesting-phrases`
4. Configuración:
   - **Name**: `interesting-phrases-api`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. **Variables de Entorno** (muy importante):
   ```
   NOTION_SECRET=<tu_notion_secret_aqui>
   DATABASE_ID=<tu_database_id_aqui>
   ```
   
   **Nota**: Usa los valores de tu archivo `.env` local


6. Click "Create Web Service"
7. **Espera 2-3 minutos** y copia la URL (ej: `https://interesting-phrases-api.onrender.com`)

---

## ⚡ Paso 3: Desplegar Frontend en Vercel

### Instalar Vercel CLI
```bash
npm i -g vercel
```

### Desplegar
```bash
vercel
```

Responde:
- Set up and deploy? → **Y**
- Link to existing project? → **N**
- Project name? → (Enter para usar el nombre por defecto)
- In which directory is your code located? → **.** (punto)
- Want to override settings? → **Y**
  - Build Command? → `npm run build`
  - Output Directory? → `dist`
  - Development Command? → `npm run dev:client`

### Configurar la URL del Backend
```bash
vercel env add VITE_API_URL
```
- Valor: `https://TU-APP.onrender.com/api/phrases` (la URL de Render + `/api/phrases`)
- Environment: **Production**

### Re-desplegar con la variable
```bash
vercel --prod
```

---

## ✅ Paso 4: Verificar

1. Vercel te dará una URL (ej: `https://interesting-phrases.vercel.app`)
2. Ábrela en tu navegador
3. Ábrela en tu móvil
4. ¡Listo! 🎉

---

## 📱 Acceder desde tu Móvil

1. Abre la URL de Vercel en el navegador de tu móvil
2. Para acceso rápido: "Añadir a pantalla de inicio"

---

## 🔄 Actualizar la App en el Futuro

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

- **Render**: Se actualiza automáticamente
- **Vercel**: Se actualiza automáticamente

O si solo quieres actualizar el frontend:
```bash
vercel --prod
```

---

## ⚠️ Notas Importantes

### Render Free Tier
- El backend se "duerme" después de 15 minutos sin uso
- La primera petición puede tardar 30-60 segundos en despertar
- Esto es normal y no afecta la funcionalidad

### Alternativas si no quieres el "sleep"
- **Railway**: Similar a Render pero sin sleep (también gratis)
- **Render Starter**: $7/mes, sin sleep

---

## 🆘 Solución de Problemas

### El frontend no se conecta al backend
1. Verifica que la variable `VITE_API_URL` esté configurada en Vercel
2. Asegúrate de que incluya `/api/phrases` al final
3. Re-despliega: `vercel --prod`

### El backend no funciona
1. Revisa los logs en Render (dashboard → tu servicio → Logs)
2. Verifica que las variables de entorno estén configuradas

### Cambios no se reflejan
1. Asegúrate de hacer `git push`
2. Espera 1-2 minutos para que se despliegue
3. Refresca la página (Ctrl+Shift+R o Cmd+Shift+R)

---

## 📞 Comandos Útiles

```bash
# Ver estado de Git
git status

# Ver deployments de Vercel
vercel ls

# Ver logs de Vercel
vercel logs

# Eliminar deployment
vercel rm [deployment-url]
```

---

¡Tu app está lista para producción! 🚀
