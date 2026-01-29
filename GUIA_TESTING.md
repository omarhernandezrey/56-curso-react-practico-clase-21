# 🧪 Guía de Testing - React e-Commerce

## Flujo de Usuario Completo para Probar

### 1. **Registro e Inicio de Sesión** ✅

**Pasos:**
1. Abre la aplicación
2. Haz clic en "Sign In" (esquina superior derecha o bottom nav)
3. En la página de Sign In, selecciona la opción de crear cuenta
4. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: tu_contraseña (mín. 4 caracteres)
5. Haz clic en \"Crear cuenta\"
6. Deberías ver un mensaje de éxito
7. Luego completa login con los mismos datos
8. Deberías regresar al home autenticado

**Validaciones a probar:**
- ✅ Email sin @ debe mostrar error
- ✅ Contraseña < 4 caracteres debe mostrar error
- ✅ Campos vacíos deben mostrar error
- ✅ Email incorrecto en login debe mostrar error

---

### 2. **Búsqueda de Productos** ✅

**Pasos:**
1. En el home, escribe en la barra de búsqueda
2. Deberías ver sugerencias aparecer mientras escribes
3. Haz clic en una sugerencia o presiona Enter
4. Los productos deben filtrarse por título
5. Haz clic en la X para limpiar la búsqueda

**Cosas a verificar:**
- ✅ Las sugerencias muestran imagen y precio
- ✅ Funciona en móvil, tablet y desktop
- ✅ La búsqueda es case-insensitive

---

### 3. **Filtrado por Categoría** ✅

**Pasos:**
1. En el home, haz clic en las categorías (All, Clothes, Electronics, etc.)
2. Los productos deben filtrarse por categoría
3. Prueba combinaciones: busca \"shirt\" en Clothes
4. Deberías ver resultados filtrados por ambos criterios

**Cosas a verificar:**
- ✅ Cada categoría solo muestra sus productos
- ✅ La combinación de búsqueda + categoría funciona
- ✅ El contador de productos es correcto

---

### 4. **Detalle de Producto** ✅

**Pasos:**
1. Haz clic en cualquier tarjeta de producto
2. Se abrirá un panel lateral con los detalles
3. Verás: precio, título, descripción, categoría, imagen
4. El botón debe decir \"Add to Cart\"
5. Haz clic en el botón para agregar al carrito

**Cosas a verificar:**
- ✅ La imagen se carga correctamente
- ✅ El precio se muestra correctamente
- ✅ El descripción es legible
- ✅ Después de agregar, el botón cambia a \"Added to Cart\"
- ✅ El panel se puede cerrar con la X

---

### 5. **Carrito de Compras** ✅

**Pasos:**
1. Agrega varios productos al carrito
2. Haz clic en el icono de bolsa de compras (arriba derecha)
3. Se abrirá el panel del carrito
4. Deberías ver todos los productos agregados
5. El total debe calcularse automáticamente
6. Puedes eliminar productos con la X
7. El contador en la bolsa se actualiza

**Cosas a verificar:**
- ✅ El total es correcto (suma de todos los precios)
- ✅ Puedes eliminar items
- ✅ El carrito se ve bien en móvil
- ✅ El contador se actualiza correctamente
- ✅ Después de agregar un producto, se abre el carrito

---

### 6. **Checkout** ✅

**Pasos:**
1. Con items en el carrito, haz clic en \"Checkout\"
2. Si no estás autenticado, te enviará a login
3. Si estás autenticado, se crea una orden
4. El carrito debe vaciarse
5. Se muestra confirmación

**Cosas a verificar:**
- ✅ No permite checkout sin estar autenticado
- ✅ Crea la orden correctamente
- ✅ El carrito se vacía después
- ✅ El contador en la bolsa vuelve a 0

---

### 7. **Historial de Órdenes (MyOrders)** ✅

**Pasos:**
1. Ve a \"My Orders\" (menú superior o bottom nav)
2. Deberías ver todas tus órdenes anteriores
3. Cada orden muestra: fecha, cantidad de productos, total
4. Haz clic en una orden para ver detalles

**Cosas a verificar:**
- ✅ Se muestran todas las órdenes creadas
- ✅ La información es correcta
- ✅ El formato se ve bien en móvil
- ✅ Los totales coinciden con lo que pagaste

---

### 8. **Detalle de Orden (MyOrder)** ✅

**Pasos:**
1. Desde MyOrders, haz clic en una orden
2. Verás detalles completos:
   - Número de orden
   - Fecha
   - Cantidad de productos
   - Total
   - Lista de productos con imágenes y precios
3. Hay un botón para volver a \"My Orders\"

**Cosas a verificar:**
- ✅ Todos los datos se muestran correctamente
- ✅ Las imágenes se cargan
- ✅ El total coincide
- ✅ Se ve bien en móvil
- ✅ La navegación funciona

---

### 9. **Perfil (MyAccount)** ✅

**Pasos:**
1. Ve a \"My Account\"
2. Verás tu información actual
3. Haz clic en \"Edit Profile\"
4. Modifica los campos
5. Haz clic en \"Save Changes\"
6. Deberías ver un mensaje de éxito
7. Verifica que los datos se guardaron

**Cosas a verificar:**
- ✅ Se muestran los datos actuales
- ✅ Puedes editarlos
- ✅ Las validaciones funcionan
- ✅ El feedback visual aparece
- ✅ Los datos se guardan (verifica F12 > Application > localStorage)
- ✅ Hay botón \"Sign Out\"

---

### 10. **Sign Out** ✅

**Pasos:**
1. En MyAccount, haz clic en \"Sign Out\"
2. Deberías volver al home
3. El carrito debe limpiarse
4. Ya no debes ver opciones de autenticado

**Cosas a verificar:**
- ✅ Limpia la sesión
- ✅ Vacía el carrito
- ✅ Redirige al home
- ✅ El acceso a MyOrders/MyAccount requiere login nuevamente

---

### 11. **Página 404** ✅

**Pasos:**
1. En la URL, ve a una ruta que no existe: `/xyz` o `/no-existe`
2. Deberías ver la página 404

**Cosas a verificar:**
- ✅ Mensaje claro \"Page Not Found\"
- ✅ Botón para volver al home
- ✅ Diseño profesional

---

### 12. **Persistencia (localStorage)** ✅

**Pasos:**
1. Agrega productos al carrito
2. Ve a My Orders (crea una orden con checkout)
3. Abre DevTools (F12)
4. Ve a Application > localStorage > (tu URL)
5. Verifica que veas:
   - `account` - tus datos
   - `sign-out` - estado de sesión
   - `cart-products` - el carrito
   - `orders` - tus órdenes

**Cosas a verificar:**
- ✅ Los datos se guardan en localStorage
- ✅ Si refrescas la página, los datos persisten
- ✅ El carrito se mantiene
- ✅ Las órdenes se mantienen
- ✅ El perfil se mantiene

---

### 13. **Responsive Design** ✅

**Pasos para cada componente:**
1. Abre DevTools (F12)
2. Haz clic en el icono de dispositivo móvil
3. Prueba con diferentes tamaños:
   - Móvil 320px
   - Móvil 414px
   - Tablet 768px
   - Tablet 1024px
   - Desktop 1920px

**Cosas a verificar en cada tamaño:**
- ✅ El navbar se adapta
- ✅ Los cards se reorganizan en grid
- ✅ Los sidebars se ven correctamente
- ✅ Los botones son clickeables
- ✅ El texto es legible
- ✅ Sin scroll horizontal innecesario
- ✅ Las imágenes se cargan correctamente

---

## 🐛 Posibles Errores a Buscar

| Error | Solución |
|-------|----------|
| Carrito no se vacía después de checkout | Revisa devTools > localStorage |
| Precio total incorrecto | Abre devTools > Console para ver errores |
| Imágenes no cargan | Verifica conexión a internet (API externa) |
| Búsqueda no funciona | Verifica que estén cargados los productos |
| Órdenes no se guardan | Revisa que localStorage esté habilitado |

---

## ✅ Checklist Final

- [ ] Registro funciona
- [ ] Login funciona
- [ ] Búsqueda funciona
- [ ] Filtro por categoría funciona
- [ ] Detalle de producto funciona
- [ ] Agregar al carrito funciona
- [ ] Carrito muestra total correcto
- [ ] Checkout funciona
- [ ] Historial de órdenes funciona
- [ ] Detalle de orden funciona
- [ ] Editar perfil funciona
- [ ] Sign out funciona
- [ ] Página 404 funciona
- [ ] localStorage persiste datos
- [ ] Responsive mobile (320px)
- [ ] Responsive tablet (768px)
- [ ] Responsive desktop (1920px)
- [ ] Sin errores en consola
- [ ] Build producción sin errores
- [ ] Todas las imágenes cargan

---

## 📊 Resultado Esperado

**Si pasas todos estos tests, el proyecto está ✅ LISTO PARA PRODUCCIÓN**

---

Última actualización: Enero 2026
