# Configuración de Email para Spa Sentirse Bien

## Variables de Entorno Requeridas

Para que funcione el envío de emails, necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

```env
# Configuración de Gmail (recomendado para desarrollo)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación

# Variables existentes del proyecto
NEXT_PUBLIC_API_USER=https://spa-back-dvdm.onrender.com/api/user
NEXT_PUBLIC_API_SERVICE=https://spa-back-dvdm.onrender.com/api/service
NEXT_PUBLIC_API_TURNO=https://spa-back-dvdm.onrender.com/api/turno
```

## Configuración de Gmail

1. **Habilitar la verificación en dos pasos** en tu cuenta de Gmail
2. **Generar una contraseña de aplicación**:
   - Ve a Configuración de tu cuenta de Google
   - Seguridad > Verificación en dos pasos
   - Contraseñas de aplicación
   - Genera una nueva contraseña para "Correo"
3. **Usa esa contraseña** como `EMAIL_PASS` en lugar de tu contraseña normal

## Configuración de Otros Proveedores

Si prefieres usar otro proveedor de email, puedes modificar la configuración en `app/api/email/route.ts`:

```javascript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

Y agregar las variables correspondientes:
```env
EMAIL_HOST=smtp.tuproveedor.com
EMAIL_PORT=587
EMAIL_USER=tu-email@tuproveedor.com
EMAIL_PASS=tu-contraseña
```

## Servicios Recomendados

- **Gmail**: Fácil de configurar, ideal para desarrollo
- **Outlook/Hotmail**: Similar a Gmail
- **SendGrid**: Servicio profesional para producción
- **Mailgun**: Otro servicio profesional popular

## Notas Importantes

- Nunca subas tu archivo `.env.local` al repositorio
- Para producción, usa servicios de email profesionales como SendGrid o Mailgun
- Las contraseñas de aplicación son más seguras que las contraseñas normales
- Gmail tiene límites de envío (500 emails por día para cuentas gratuitas) 