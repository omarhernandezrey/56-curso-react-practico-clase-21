# 🔒 SECURITY CHECKLIST - OWASP Top 10

**Responsable**: Equipo de Seguridad
**Auditoría**: Cada sprint
**Propósito**: Prevenir vulnerabilidades comunes

---

## ✅ A1: INJECTION ATTACKS

### SQL Injection
```javascript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query);

// ✅ SEGURO - Usar prepared statements
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]);

// ✅ SEGURO - Usar ORM (Prisma)
const user = await prisma.user.findUnique({ where: { email } });
```

### Command Injection
```javascript
// ❌ VULNERABLE
const result = exec(`convert ${filename} output.png`);

// ✅ SEGURO - Validar entrada
const safeFilename = filename.replace(/[^a-z0-9._-]/gi, '');
const result = exec(`convert ${safeFilename} output.png`);
```

### Checklist
- [ ] Usar prepared statements/parameterized queries
- [ ] Usar ORM en lugar de SQL crudo
- [ ] Validar todas las entradas del usuario
- [ ] No concatenar strings en queries

---

## ✅ A2: BROKEN AUTHENTICATION

```javascript
// ❌ VULNERABLE - Contraseña sin encriptar
users.create({ email, password: plainText });

// ✅ SEGURO - Usar bcryptjs
const hashedPassword = await bcrypt.hash(password, 10);
users.create({ email, password: hashedPassword });

// ❌ VULNERABLE - Token sin expiración
const token = jwt.sign({ userId }, SECRET);

// ✅ SEGURO - Token con expiración
const token = jwt.sign({ userId }, SECRET, { expiresIn: '24h' });

// ❌ VULNERABLE - Contraseña débil
if (password.length < 4) return error;

// ✅ SEGURO - Validar contraseña fuerte
const hasStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
if (!hasStrongPassword) return error;
```

### Checklist
- [ ] Contraseñas hasheadas con bcrypt (10+ rounds)
- [ ] Tokens con expiración
- [ ] Refresh tokens implementados
- [ ] 2FA opcional/disponible
- [ ] Rate limiting en login

---

## ✅ A3: SENSITIVE DATA EXPOSURE

```javascript
// ❌ VULNERABLE - Datos sensibles en logs
logger.info(`User login: ${email}, password: ${password}`);

// ✅ SEGURO - No loguear datos sensibles
logger.info(`User login attempted: ${email}`);

// ❌ VULNERABLE - Datos sensibles en respuesta
res.json({ user: { email, password } });

// ✅ SEGURO - No enviar datos sensibles
res.json({ user: { email, name } });

// ❌ VULNERABLE - Sin HTTPS
app.listen(3000); // HTTP

// ✅ SEGURO - Con HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  https.createServer(options, app).listen(443);
}
```

### Checklist
- [ ] HTTPS en producción
- [ ] Nunca loguear passwords/tokens
- [ ] No enviar datos sensibles innecesarios
- [ ] Encriptar datos en tránsito
- [ ] Encriptar datos en reposo (si es necesario)

---

## ✅ A4: XML EXTERNAL ENTITY (XXE)

```javascript
// ❌ VULNERABLE - Parsing XML sin validar
const xmldom = require('xmldom');
const doc = new xmldom.DOMParser().parseFromString(xmlString);

// ✅ SEGURO - Desabilitar entidades externas
const xmldom = require('xmldom');
const parser = new xmldom.DOMParser({
  errorHandler: () => {},
  doctype: null // Disable DTD
});
const doc = parser.parseFromString(xmlString);
```

### Checklist
- [ ] Deshabilitar XXE en XML parser
- [ ] Validar XML antes de procesar
- [ ] Usar JSON en lugar de XML si es posible

---

## ✅ A5: BROKEN ACCESS CONTROL

```javascript
// ❌ VULNERABLE - Sin verificación de autorización
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  res.json(order);
});

// ✅ SEGURO - Verificar que el usuario es dueño
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = db.getOrder(req.params.id);
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});

// ❌ VULNERABLE - Confiar en cliente-side checks
// (El cliente puede modificar permisos)

// ✅ SEGURO - Verificar en servidor
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}
```

### Checklist
- [ ] Verificar autorización en TODAS las rutas
- [ ] No confiar en validación cliente-side
- [ ] Verificar propiedad de recursos
- [ ] Implementar roles y permisos

---

## ✅ A6: SECURITY MISCONFIGURATION

```javascript
// ❌ VULNERABLE - Headers de seguridad faltantes
app.get('/api', (req, res) => {
  res.json({...});
});

// ✅ SEGURO - Headers de seguridad
const helmet = require('helmet');
app.use(helmet()); // Agrega múltiples headers de seguridad

// Incluye:
// - Content-Security-Policy
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - Strict-Transport-Security
```

### Checklist
- [ ] Headers de seguridad (X-Frame-Options, CSP, etc.)
- [ ] CORS configurado correctamente
- [ ] Errores sin detallar información sensible
- [ ] Archivos innecesarios no accesibles
- [ ] Dependencias actualizadas

---

## ✅ A7: CROSS-SITE SCRIPTING (XSS)

```javascript
// ❌ VULNERABLE - XSS Reflected
app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${req.query.q}</h1>`);
  // Si q = "<script>alert('xss')</script>"
});

// ✅ SEGURO - Escapar entrada
const escapeHtml = (text) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
};

app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${escapeHtml(req.query.q)}</h1>`);
});

// ✅ SEGURO - Usar template engine con auto-escape
app.get('/search', (req, res) => {
  res.render('search', { query: req.query.q }); // EJS auto-escapa
});

// React/Vue auto-escapan por defecto
function Search() {
  return <h1>Results for: {query}</h1>; // ✅ Auto-escapado
}
```

### Checklist
- [ ] Escapar contenido dinámico
- [ ] Usar template engine con auto-escape
- [ ] Content-Security-Policy configurado
- [ ] Validar entrada en servidor

---

## ✅ A8: INSECURE DESERIALIZATION

```javascript
// ❌ VULNERABLE
const data = JSON.parse(userInput); // ¿Qué contiene userInput?

// ✅ SEGURO - Validar estructura
const schema = {
  email: string,
  name: string
};
const data = JSON.parse(userInput);
validate(data, schema); // Usar Zod o similar
```

### Checklist
- [ ] Validar datos deserializados
- [ ] No deserializar datos no confiables
- [ ] Usar schema validation (Zod, etc.)

---

## ✅ A9: USING COMPONENTS WITH KNOWN VULNERABILITIES

```bash
# ❌ VULNERABLE - Usar dependencias desactualizadas
npm list  # Ver versiones
npm audit # Mostrar vulnerabilidades

# ✅ SEGURO - Mantener dependencias actualizadas
npm update
npm audit fix
npm install @latest versions
```

### Checklist
- [ ] `npm audit` sin vulnerabilidades críticas
- [ ] Actualizar dependencias regularmente
- [ ] Monitorear CVE para dependencias
- [ ] Usar lock file (package-lock.json)

---

## ✅ A10: INSUFFICIENT LOGGING & MONITORING

```javascript
// ❌ VULNERABLE - Sin logging
app.post('/login', (req, res) => {
  // Sin registrar intentos fallidos
});

// ✅ SEGURO - Logging completo
const logger = require('winston');

app.post('/login', (req, res) => {
  try {
    const user = authenticate(req.body);
    logger.info(`User ${req.body.email} logged in`);
    res.json({ token });
  } catch (error) {
    logger.warn(`Failed login attempt for ${req.body.email}`);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Monitorear:
// - Intentos de login fallidos
// - Accesos denegados
// - Cambios en datos sensibles
// - Errores del servidor
```

### Checklist
- [ ] Logging de eventos importantes
- [ ] Monitoreo de intentos fallidos
- [ ] Alertas para actividades sospechosas
- [ ] Logs con timestamp
- [ ] No loguear datos sensibles

---

## 🔐 GENERAL SECURITY CHECKLIST

- [ ] Todas las contraseñas hasheadas
- [ ] Todos los tokens con expiración
- [ ] HTTPS en producción
- [ ] CORS restringido
- [ ] Rate limiting en endpoints críticos
- [ ] Input validation en TODAS partes
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens en formularios
- [ ] Headers de seguridad
- [ ] Dependencias sin vulnerabilidades
- [ ] Secretos en .env (no en código)
- [ ] Logging sin datos sensibles
- [ ] Errores sin detallar info sensible
- [ ] 2FA en admin
- [ ] Auditoría de acceso
- [ ] Backup automáticos
- [ ] Disaster recovery plan

---

**AUDITORÍA ÚLTIMA**: 29 de Enero 2026
**PRÓXIMA REVISIÓN**: Cada sprint
