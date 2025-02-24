import {
  FACTOR_ANUAL_12_MESES,
  FACTOR_ANUAL_24_MESES,
  FACTOR_ANUAL_36_MESES,
  FACTOR_ANUAL_48_MESES,
} from "./constants";

export function calcCuota12Meses(amount) {
  const valorAFinanciar = Number(amount) / 2;
  const interes = valorAFinanciar * FACTOR_ANUAL_12_MESES;
  const cuota = (valorAFinanciar + interes) / 12;

  return cuota.toFixed(2);
}

export function calcCuota24Meses(amount) {
  const valorAFinanciar = Number(amount) / 2;
  const interes = valorAFinanciar * FACTOR_ANUAL_24_MESES;
  const cuota = (valorAFinanciar + interes) / 24;

  return cuota.toFixed(2);
}

export function calcCuota36Meses(amount) {
  const valorAFinanciar = Number(amount) / 2;
  const interes = valorAFinanciar * FACTOR_ANUAL_36_MESES;
  const cuota = (valorAFinanciar + interes) / 36;

  return cuota.toFixed(2);
}

export function calcCuota48Meses(amount) {
  const valorAFinanciar = Number(amount) / 2;
  const interes = valorAFinanciar * FACTOR_ANUAL_48_MESES;
  const cuota = (valorAFinanciar + interes) / 48;

  return cuota.toFixed(2);
}

export function calcCuotaXMeses(amount, time) {
  const valorAFinanciar = Number(amount);
  const interes =
    valorAFinanciar *
    (time <= 12
      ? FACTOR_ANUAL_12_MESES
      : time > 12 && time <= 24
      ? FACTOR_ANUAL_24_MESES
      : time > 24 && time <= 36
      ? FACTOR_ANUAL_36_MESES
      : time > 36 && time <= 48 && FACTOR_ANUAL_48_MESES);
  const cuota = (valorAFinanciar + interes) / time;

  return cuota.toFixed(2);
}
