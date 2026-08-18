import db from "./db";

function normalizar(s) {
  if (!s) return "";
  return s
    .toString()
    .trim()
    .toUpperCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

const SINONIMOS = {
  AUTOMATICA: "TA",
  AUTOMATICO: "TA",
  "T/A": "TA",
  MANUAL: "TM",
  "T/M": "TM",
  HYBRID: "HIBRIDO",
};

const TOKENS_IGNORADOS = new Set(["AC", "DE", "CON", "SIN"]);

const TOKENS_ESPECIFICACION = new Set([
  "4X2", "4X4", "AWD", "FWD",
  "TA", "TM", "CVT",
  "DIESEL", "GASOLINA", "HIBRIDO", "ELECTRICO", "GLP",
]);

function tokenizar(nombreNormalizado) {
  return nombreNormalizado
    .split(/[\s/]+/)
    .filter(Boolean)
    .map((t) => SINONIMOS[t] || t)
    .filter((t) => !TOKENS_IGNORADOS.has(t));
}

function pesoToken(token) {
  if (/^\d+([.,]\d+)?$/.test(token)) return 3; // cilindraje, ej. "2.8"
  if (/^\d+P$/.test(token)) return 3; // puertas, ej. "5P"
  if (TOKENS_ESPECIFICACION.has(token)) return 3;
  return 1; // palabra generica (nombre base, trim/linea)
}

function pesoTotal(tokens) {
  return tokens.reduce((acc, t) => acc + pesoToken(t), 0);
}

function puntaje(tokensPilot, tokensCandidato) {
  const setCandidato = new Set(tokensCandidato);
  let score = 0;
  for (const t of tokensPilot) {
    if (setCandidato.has(t)) score += pesoToken(t);
  }
  return score;
}

// El candidato ganador debe cubrir al menos este % del peso de lo que Pilot
// realmente nos dijo (no solo "ser el mejor de la lista") - ver caso real
// Chevrolet Onix Premier Turbo (venta #51978): el catalogo de Ecuaprimas
// solo tiene "ONIX LT TURBO AC 1.0 5P 4X2 TM", que con puntaje absoluto
// "ganaria" por ser el unico candidato, pero el trim (LT vs PREMIER) y las
// puertas (5P vs 4P) no coinciden en realidad - cobertura da 67%, rechazado.
const UMBRAL_COBERTURA = 0.85;
// Pilot debe darnos al menos una especificacion real (cilindraje, tracción,
// transmision, combustible o puertas) antes de intentar matchear - el solo
// nombre base del modelo no es suficiente evidencia.
const PESO_MINIMO_PILOT = 4;

export async function buscarMarca(marcaPilot) {
  const norm = normalizar(marcaPilot);
  if (!norm) return null;
  const rows = await db.$queryRaw`
    SELECT codigo FROM EcuaprimasCatalogo WHERE tipo = 'MARCA' AND nombre_normalizado = ${norm}
  `;
  if (rows.length !== 1) return null; // no encontrada, o ambigua (2+ codigos con mismo nombre)
  return rows[0].codigo;
}

export async function buscarModelo(marcaCodigo, modeloPilot, versionPilot) {
  const textoCompleto = normalizar(`${modeloPilot || ""} ${versionPilot || ""}`);
  if (!textoCompleto) return null;

  const tokensPilot = tokenizar(textoCompleto);
  const pesoPilot = pesoTotal(tokensPilot);
  if (pesoPilot < PESO_MINIMO_PILOT) return null;

  const candidatos = await db.$queryRaw`
    SELECT codigo, nombre, nombre_normalizado FROM EcuaprimasCatalogo
    WHERE tipo = 'MODELO' AND parent_codigo = ${marcaCodigo}
  `;

  let mejor = null;
  let mejorScore = -1;
  let empatado = false;

  for (const c of candidatos) {
    const tokensCandidato = tokenizar(c.nombre_normalizado);
    const score = puntaje(tokensPilot, tokensCandidato);
    if (score > mejorScore) {
      mejorScore = score;
      mejor = c;
      empatado = false;
    } else if (score === mejorScore && score > 0) {
      empatado = true;
    }
  }

  if (!mejor || empatado) return null;

  const cobertura = mejorScore / pesoPilot;
  if (cobertura < UMBRAL_COBERTURA) return null;

  return { codigo: mejor.codigo, nombre: mejor.nombre, score: mejorScore, cobertura };
}

export async function buscarColor(colorPilot) {
  const norm = normalizar(colorPilot);
  if (!norm) return null;

  const exacto = await db.$queryRaw`
    SELECT codigo FROM EcuaprimasCatalogo WHERE tipo = 'COLOR' AND nombre_normalizado = ${norm}
  `;
  if (exacto.length === 1) return exacto[0].codigo;

  // color compuesto (ej. "GRIS OSCURO") - buscar si un color base del catalogo
  // aparece como palabra suelta dentro del texto de Pilot
  const palabras = norm.split(" ");
  const candidatos = await db.$queryRaw`
    SELECT codigo, nombre_normalizado FROM EcuaprimasCatalogo WHERE tipo = 'COLOR'
  `;
  const matches = candidatos.filter((c) => palabras.includes(c.nombre_normalizado));
  if (matches.length === 1) return matches[0].codigo;
  return null;
}

export async function matchVehiculo({ marca, modelo, version, color }) {
  const marcaCodigo = await buscarMarca(marca);
  if (!marcaCodigo) {
    return { ok: false, motivo: "marca_no_encontrada", detalle: marca };
  }

  const modeloMatch = await buscarModelo(marcaCodigo, modelo, version);
  if (!modeloMatch) {
    return { ok: false, motivo: "modelo_no_encontrado", detalle: `${modelo} ${version}`.trim() };
  }

  const colorCodigo = await buscarColor(color);

  return {
    ok: true,
    marca_codigo: marcaCodigo,
    modelo_codigo: modeloMatch.codigo,
    modelo_nombre_catalogo: modeloMatch.nombre,
    modelo_cobertura: modeloMatch.cobertura,
    color_codigo: colorCodigo, // puede ser null - Pilot no siempre manda color
  };
}
