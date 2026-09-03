# Mapeo de fuentes — 3 dashboards nuevos (Inventario, Performance por Agencia, Embudo de Conversión)

Leyenda:
- ✅ Automatizable ya — la fuente existe y ya la tenemos
- 🔍 Automatizable, falta verificar un detalle puntual antes de construir
- 🆕 Requiere una integración nueva (no existe conexión hoy)
- ✍️ No existe en ningún sistema — requiere entrada manual (formulario propio)

## 1. Resumen de Inventario

Fuente: tablas `Vehicle` (stock vigente) / `AllVehicle` (histórico), ya alimentadas cada hora
desde Pilot. Campos reales disponibles en el schema: `brand`, `model`, `year`, `prices`,
`days_in_stock`, `type`, `owner_branch_code`, `fuel_name`, `color`, `status_name`,
`availability_status_code`, `availability_status_name`.

| Campo del dashboard | Estado | Detalle |
|---|---|---|
| Inventario total | ✅ | `COUNT(*)` sobre `Vehicle` |
| Top 15 modelos + unidades + % del total | ✅ | `GROUP BY brand, model` |
| Días promedio / máx. días en inventario | 🔍 | Existe `days_in_stock` directo del schema — falta confirmar que Pilot lo calcula bien y no hay que recalcularlo nosotros |
| Valor total / valor promedio por unidad | ✅ | Campo `prices` |
| Año promedio / Inventario por año modelo | ✅ | Campo `year` |
| Tipo de carrocería (SUV/Camioneta/Sedán/Hatchback) | 🔍 | Existe el campo `type` — falta confirmar que sus valores reales correspondan a estas 4 categorías (o si hay que mapearlas) |
| Semáforo días en inventario | ✅ | Es solo una regla de color sobre `days_in_stock`, no dato nuevo |

**Conclusión: este dashboard está prácticamente listo para automatizar hoy**, con 2 verificaciones puntuales (no bloqueantes, se resuelven mirando data real de unas cuantas filas).

## 2. Performance por Agencia (Ventas vs Presupuesto)

| Campo del dashboard | Estado | Detalle |
|---|---|---|
| Ventas YTD por agencia/mes (unidades) | 🆕 | **Esta es la misma brecha ya conocida**: hoy la única fuente es el CSV manual `Base compras ventas 0903`. Pilot no expone ventas cerradas vía `stock/list.php`. Camino a investigar: si algún webhook de Pilot (Admin > Plantillas de Webhooks) se dispara al cerrar/facturar una venta con estos datos — ya existe precedente con el webhook de "APROBADA JEFATURA" (`pilotSaleWebhook`), pero ese es un paso previo a la venta cerrada, no la venta en sí |
| Presupuesto/meta por agencia/mes | ✍️ | No sale de ningún sistema — es una meta de negocio definida por Gerencia. Requiere un módulo nuevo tipo "Metas" (similar al de Teléfonos) donde se ingresen las metas mensuales por agencia una vez al año, editable |
| Meta anual global (5.000 unidades) | ✍️ | Mismo caso — un solo número, mismo módulo de Metas |
| Agencia (agrupación) | ✅ | Ya existe `owner_branch_code` en Vehicle/AllVehicle — mismo campo que usaríamos para agrupar ventas si logramos cerrar el punto anterior |

**Conclusión: este es el dashboard más bloqueado.** No se puede construir sin resolver primero (a) de dónde salen ventas cerradas reales y (b) dónde se capturan las metas.

## 3. Embudo de Conversión

| Campo del dashboard | Estado | Detalle |
|---|---|---|
| Visualizaciones / Alcance | 🆕 | Esto es tráfico pagado de Meta Ads (impresiones/alcance) — requiere Meta Ads Insights API. Puede que ya se esté extrayendo en el proyecto de Cotedem Marketing IA (Make.com) — hay que confirmar si ahí ya existe ese dato listo para reusar |
| Leads (contactos generados) | 🔍 | **Hallazgo nuevo**: los 3 formularios del sitio (`homeContactForm`, `budgetContactForm`, `reserveForm`, `waContactForm`) no guardan nada localmente — empujan el lead directo a Pilot vía `webhooks/welcome.php`, cada uno con su propio `pilot_suborigin_id` (o sea, Pilot YA sabe cuántos leads entraron y de qué formulario/origen). Falta verificar si Pilot expone un reporte/endpoint para contar contactos por `suborigin_id` y rango de fechas, o si conviene agregar un webhook saliente de Pilot ("contacto creado") para loguearlo también en nuestra DB, igual que hicimos con ventas |
| Citas (agendadas) / Citas asistidas | 🔍 | Pendiente confirmar si esto vive en Pilot (módulo de agenda) o en **Atom** (vimos un ítem "Citas" en su menú de Configuraciones) — hay que revisar cuál de los dos sistemas es la fuente real antes de construir nada |
| Negocios cerrados | 🆕 | Mismo hueco de ventas cerradas que el Dashboard 2 |

## Prioridad sugerida (de más a menos listo)

1. **Inventario** — casi listo, solo 2 verificaciones de datos reales.
2. **Leads del embudo** — ya vive en Pilot (via los formularios), solo falta confirmar cómo consultarlo.
3. **Ventas cerradas / Presupuesto (Performance por Agencia)** — el más bloqueado: necesita
   investigar el webhook de venta cerrada en Pilot Y construir un módulo de captura manual de metas.
4. **Visualizaciones/Alcance/Citas del embudo** — depende de sistemas externos (Meta Ads, y
   confirmar si Citas vive en Pilot o Atom).
