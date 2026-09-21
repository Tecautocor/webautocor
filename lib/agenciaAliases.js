// Agencias que Pilot renombró/reubicó pero cuyo histórico (webhooks, imports,
// metas ya guardadas) sigue con el nombre viejo. AllVehicle.owner_branch_code
// (el stock actual) ya solo trae el nombre nuevo, así que hay que mapear el
// viejo aquí para no perder ese histórico al agrupar/comparar por agencia.
const ALIAS_AGENCIA = {
  "Autocor El Recreo": "Autocor Quicentro Sur",
};

export function normalizarAgencia(nombre) {
  if (!nombre) return nombre;
  const trimmed = nombre.trim();
  return ALIAS_AGENCIA[trimmed] || trimmed;
}
