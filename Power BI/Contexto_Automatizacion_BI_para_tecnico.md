# Contexto: Automatización de datos para BI de Stock/Ventas — AUTOCOR

Este documento resume el diagnóstico ya hecho sobre el BI de AUTOCOR, para que puedas
retomarlo con contexto completo. Pégalo como primer mensaje en tu Claude (Claude Code o
claude.ai) si quieres que te ayude a seguir desde aquí.

**Actualizado 2026-09-03**: desde el diagnóstico original (que apuntaba al .pbix de Power BI
Service), el proyecto pivotó a construir un **módulo BI propio dentro de la app Next.js**
(`/admin/bi`, ver sección nueva más abajo) en vez de seguir parchando el .pbix. El .pbix original
sigue existiendo pero ya no es donde se está poniendo el esfuerzo activo.

## Qué es el proyecto (diagnóstico original, Power BI Service)

Workspace de Power BI Service de AUTOCOR ("Mi área de trabajo", cuenta tecnologia@autocor.com.ec)
con 4 reportes: "Stock vigente e histórico vehículos", "Ventas vehículos", "Ventas y compras
históricas", "Ventas_Autocor". El cliente pidió reconstruir el BI (no solo parchar) porque "no
les hace sentido, no lo usan": no responde las preguntas que importan, es confuso, y no confían
en los números.

Alcance acordado originalmente: empezar solo por **"Stock vigente e histórico vehículos"**.

## Módulo BI propio en Next.js (`/admin/bi`) — estado real al 2026-09-03

Implementado en el commit `f2ba31d` (2026-08-19) y siguientes. Agrupa 5 dashboards bajo
`/admin/bi`, cada uno con su página en `pages/admin/*.js` y su API en `pages/api/admin/*/index.js`:

1. **Metas de Ventas** (`/admin/metas`) — módulo manual (tabla `MetaVentas`) donde Gerencia
   ingresa la meta mensual de unidades por agencia. No sale de ningún sistema, es entrada directa.
2. **Resumen de Inventario** (`/admin/inventario`) — en vivo desde `Vehicle`/`AllVehicle`
   (alimentadas cada hora desde Pilot). Incluye concentración por modelo, antigüedad
   (`days_in_stock`), valor y carrocería, con filtros interactivos.
3. **Performance por Agencia** (`/admin/performance`) — ventas vs. `MetaVentas` por agencia/mes.
4. **Embudo de Conversión** (`/admin/embudo`) — leads y negocios cerrados reales (ver sección
   siguiente); visualizaciones/alcance (Meta Ads) y citas siguen marcados como "pendiente de
   integración", sin inventar números.
5. **Análisis Comercial** (`/admin/analisis-comercial`) — comparativa interanual (real, desde
   `AllVehicle` desde 2023), ranking de vendedores (proxy vía `reserved_by_user_name`),
   rentabilidad y financiamiento desde `VentaWebhookLog` (estado vacío mientras no haya datos
   reales del webhook).

### Leads de Pilot — ya se están capturando (actualizado 2026-09-03)

No se lee hacia atrás desde Pilot (sigue sin exponer ese endpoint). En vez de eso se agregó un
registro propio: tabla `LeadLog` (modelo en el `schema.prisma` de la raíz del repo — hay un
segundo `prisma/schema.prisma` desactualizado que **no** es el que usa el cliente generado,
cuidado con editar el que no corresponde) que guarda copia local del lead en el mismo instante
en que el formulario del sitio lo envía a Pilot vía `webhooks/welcome.php`:

- `homeContactForm`, `budgetContactForm`, `reserveForm`, `waContactForm`, y (agregado
  2026-09-03) `buyContactForm` — los 5 llaman `logLead()` (`lib/leadLog.js`) justo después de
  mandar el lead a Pilot.
- Se muestra en `/admin/embudo` desglosado por canal ("Leads por formulario/canal"), con label
  `FORMULARIO_LABELS` en `pages/api/admin/embudo/index.js` (`buy` = "Vende tu auto").
- **Sin histórico previo**: el log arranca desde que se activó el modelo (19-ago-2026).
- Sigue sin cubrir un lead que entre a Pilot por un canal que no sea el sitio web (ej. alguien
  que llama al showroom y se registra directo en Pilot).
- "Negocios cerrados" en el embudo se calcula aparte, desde `AllVehicle` (`availability_status_code
  = '3'` con `factory_invoicing_dt`), no depende de los leads.

### Otras tablas nuevas relevantes (todas en el `schema.prisma` raíz)

- `VentaWebhookLog` — log crudo del webhook de Ventas de Pilot (entidad "Ventas"), guarda
  `rawPayload` completo + campos tipados. Sin PII del cliente.
- `VentaHistoricoImport` — carga histórica del CSV manual de Pilot ("Base compras ventas"),
  tabla separada a propósito de `VentaWebhookLog` hasta confirmar que el mapeo de campos es
  correcto.
- `MetaVentas` — meta de unidades por agencia/mes, entrada manual.

## Arquitectura actual de datos (verificada, no supuesta)

1. **Pilot Solution** (`api.pilotsolution.net`) es el CRM/gestor del dealer — fuente de verdad
   del stock e inventario.
2. App Next.js de AUTOCOR (`Web AUTOCOR/pages/api/loadVehicles/index.js` y
   `loadAllVehicles/index.js`): login a Pilot con credenciales hardcodeadas (pendiente migrar a
   env vars), pagina `stock/list.php`, hace `TRUNCATE` + recarga en MySQL (`db_autocor.Vehicle`
   = stock vigente ~310-528 filas, `db_autocor.AllVehicle` = histórico ~10,587 filas).
3. Cron en el VPS (`198.71.58.161`), cada hora desde feb-2025, llama esos dos endpoints. **Esta
   parte SÍ está 100% automatizada** — se arregló un bug de timeout (504) el 2026-07-23 subiendo
   `proxy_read_timeout` de nginx a 600s.
4. El Power BI (.pbix) conecta directo a ese MySQL vía Power Query M
   (`MySQL.Database("198.71.58.161:3306", "db_autocor", ...)`).
5. **El salto MySQL → Power BI Service está roto y es manual**: MySQL solo escucha en
   `127.0.0.1` del VPS (firewall bloquea el puerto públicamente), así que el refresh automático
   en la nube no puede conectarse. Alguien tiene que abrir un túnel SSH y refrescar a mano desde
   Power BI Desktop.

## La brecha real que no se puede automatizar (hoy)

Los reportes de **ventas/compras cerradas** ("Ventas vehículos", "Ventas y compras históricas")
NO vienen de Pilot ni de MySQL — vienen de un **CSV subido a mano** a SharePoint
(`https://autocorec.sharepoint.com/.../Base%20compras%20ventas%200903.csv`), con 133 columnas:
PII del cliente, condiciones financieras (precio, anticipo, tasa, banco, cuotas, descuento),
vehículo de retoma, utilidad calculada, logística de entrega, comisión del vendedor.

**Razón confirmada**: Pilot no expone (hoy) un endpoint de API para operaciones de venta
cerradas — `stock/list.php` solo cubre inventario. Por eso alguien exporta el Excel/CSV desde
Pilot manualmente y lo re-sube siempre con el mismo nombre de archivo.

## Idea nueva a explorar (2026-08-19): webhooks de Pilot

Ya existe precedente de que **Pilot sí soporta webhooks salientes** — se usan hoy en
`Web AUTOCOR/pages/api/pilotSaleWebhook/index.js`, configurados en Pilot bajo
**Admin > Plantillas > Plantillas de Webhooks**, disparados cuando una venta cambia a estado
"APROBADA JEFATURA". Ese webhook ya entrega un payload con `venta`, `vehiculo`, `cliente`,
`vendedor` (usado hoy para disparar cotizaciones de seguro con Ecuaprimas — ver el endpoint
para ver la forma exacta del payload).

**Hipótesis a validar**: si ese webhook (o alguna otra plantilla de webhook en Pilot ligada a
otro estado/evento de venta) ya trae los datos financieros de la operación (precio, anticipo,
financiamiento, descuento, retoma, etc.), podríamos capturar esos datos automáticamente en una
tabla propia (ej. `db_autocor.VentaOperacion` o similar) en vez de depender del CSV manual —
cerrando la única brecha real de automatización de todo el sistema.

**Qué falta verificar**:
1. Revisar en Pilot (Admin > Plantillas > Plantillas de Webhooks) qué otras plantillas de
   webhook existen y qué payload trae cada una — especialmente si hay una para "venta
   cerrada"/"factura generada" (no solo "aprobada jefatura", que es un paso previo).
2. Comparar los campos de ese payload contra las 133 columnas del CSV `Base compras ventas 0903`
   (documentadas arriba) para ver cobertura real.
3. Si el payload cubre lo necesario: crear/adaptar un endpoint tipo `pages/api/pilotVentaWebhook`
   que reciba el webhook y escriba en MySQL, igual que ya se hace con `pilotSaleWebhook`.
4. Si no cubre todo: documentar qué campos seguirían faltando (posible pregunta directa a Pilot/
   Agustina de soporte).

## Decisión pendiente (aparte de lo anterior): refresh de Power BI Service

Dos rutas para que el Power BI en la nube se refresque solo, sin depender de un túnel SSH manual:
- (a) Abrir el puerto 3306 del VPS solo a rangos de IP de Microsoft/Azure — menos seguro.
- (b) Instalar un **On-premises Data Gateway** de Power BI (solo corre en Windows) en una máquina
  Windows del cliente con IP fija — ruta recomendada por Microsoft. El cliente confirmó que tiene
  una máquina así disponible. **Esto se dejó pausado explícitamente "para más adelante"** — no se
  ha instalado nada.

## Herramienta útil para inspeccionar el .pbix

El DataModel de un .pbix moderno está comprimido (formato VertiPaq/XPress9), no legible directo.
Se usó `pbixray` (Python) dentro de Docker (evita problemas de wheels en macOS nativo):
```bash
docker run --rm -v $(pwd):/data python:3.12-slim bash -c "pip install pbixray && python analyze.py"
```
Con `PBIXRay(path)` se accede a `.tables`, `.schema`, `.relationships`, `.dax_measures`,
`.dax_columns`, `.power_query`, `.statistics`, `.rls`, `.ols`.

## Archivos relevantes en este repo

- `pages/api/loadVehicles/index.js`, `pages/api/loadAllVehicles/index.js` — carga de stock desde Pilot.
- `pages/api/pilotSaleWebhook/index.js` — webhook existente de Pilot (estado "APROBADA JEFATURA"),
  usar como referencia de formato/autenticación (Bearer token en `PILOT_WEBHOOK_TOKEN`).
- `Web AUTOCOR/Power BI/Preguntas_Reunion_CEO_GerenteComercial.md` — guía de descubrimiento para
  definir qué debe responder el BI reconstruido, ya usada/pendiente de reunión con CEO y Gerente
  Comercial.

## Qué se necesita de ti

Ayúdanos a: (1) revisar en el panel de Pilot qué webhooks existen y qué payload traen, (2)
evaluar si cubren los datos de venta que hoy vienen del CSV manual, y (3) si es viable, diseñar
el endpoint + tabla para automatizar esa ingesta, siguiendo el mismo patrón que
`pilotSaleWebhook`.
