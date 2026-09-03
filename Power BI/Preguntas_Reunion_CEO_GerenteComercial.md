# Reconstrucción del BI Autocor — Preguntas para la reunión con CEO y Gerente Comercial

**Objetivo de la reunión:** entender qué información necesita cada uno para tomar decisiones, antes de diseñar los nuevos tableros. El BI actual no se usa porque no responde lo que importa, es confuso, y no generan confianza los números — esta reunión es para no repetir ese error.

---

## Preguntas para el CEO

1. ¿Qué información consultas más seguido sobre el negocio, aunque hoy la consigas por WhatsApp, Excel o preguntándole a alguien?
2. ¿Qué pregunta te gustaría responder en 10 segundos que hoy te toma pedirla y esperar?
3. De cuánto vendes, cuánto ganas, y cuánto tienes en stock — ¿cuál de los tres te importa más ver primero?
4. ¿Con qué frecuencia querrías revisar esto — diario, semanal, en el cierre de mes?
5. ¿Existen metas o presupuesto (por mes, por sucursal, por marca) contra los que debería compararse todo? Si existen, ¿dónde viven hoy?
6. ¿Necesitas ver el detalle por sucursal, o prefieres un número consolidado y dejar el detalle al gerente comercial?

## Preguntas para el Gerente Comercial

1. ¿Qué información consultas día a día para decidir algo (no para "mirar", para decidir)?
2. ¿Qué te preguntan seguido (el CEO, un vendedor, un gerente de sucursal) que no puedes responder rápido hoy?
3. ¿Cuál es el reporte que más abres hoy, aunque sea directo en Pilot o en un Excel?
4. ¿Cómo mides hoy el desempeño de un vendedor? ¿Por unidades, por $, por margen, por cumplimiento de cuota?
5. ¿A los cuántos días en stock un auto empieza a preocuparte?
6. ¿Cómo controlas hoy que un vendedor no dé más descuento del autorizado?
7. ¿Las comisiones de vendedores se calculan en algún sistema? ¿Debería reflejarse en el BI?
8. Sobre las retomas (usados recibidos como parte de pago): ¿quién decide el precio de recepción, y te interesa comparar precio estimado vs. precio real de reventa?
9. ¿Las sucursales son comparables entre sí, o hay que normalizar por tamaño de mercado antes de rankear?

## Preguntas cruzadas (para resolver entre los dos)

- ¿Quién más va a tener acceso al BI además de ustedes dos? (vendedores, gerentes de sucursal) — define si necesitamos restringir por sucursal.
- ¿Cuántos años de histórico necesitan ver, o con 12-18 meses hacia atrás alcanza?
- De los tres motivos por los que no usan el BI actual (no responde lo que importa / es confuso / no confían en los números) — ¿cuál pesa más para cada uno?

---

## Lo que sí podemos responder hoy con la data disponible

- Ventas por vendedor, sucursal, marca, modelo — unidades, $ y utilidad.
- Descuento otorgado vs. precio de lista (control de fuga de margen).
- Financiamiento: % financiado, tasa, banco.
- Retomas: volumen, valor recibido, rentabilidad estimada vs. real.
- Stock: cuánto hay, cuánto vale, cuánto tiempo lleva cada auto sin venderse, por sucursal/marca.
- Cruce stock↔venta: cuánto tardó en venderse un auto desde que entró a stock.

## Lo que NO podemos responder hoy (requeriría una fuente de data nueva)

- **Embudo completo de ventas** (leads/interesados que no se convirtieron en venta) — no hay data de leads perdidos, solo del resultado final.
- **Comisión real de vendedores** — existe una columna en la data pero no es confiable (texto libre, muchos vacíos).
- **Metas o presupuesto vs. real** — no encontramos ninguna fuente de metas; hay que preguntar dónde viven hoy.
- **Satisfacción del cliente / NPS** — no existe en ninguna fuente actual.
- **Costo de marketing por venta** — no hay ninguna fuente de gasto publicitario conectada.

Si en la reunión piden algo de esta segunda lista, la respuesta correcta es "se puede, pero primero necesitamos definir de dónde sale esa data" — no es un simple ajuste del tablero.
