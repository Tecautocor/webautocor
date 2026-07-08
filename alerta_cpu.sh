#!/bin/bash

LIMITE_CPU=85   # alerta si pasa 85%
PROCESO="next-server"
CORREO="tecnologia@autocor.com.ec"
FLAG="/tmp/cpu_alert_sent"

CPU=$(ps -C "$PROCESO" -o %cpu= | awk '{sum+=$1} END {printf "%.0f", sum}')

if [ "$CPU" -ge "$LIMITE_CPU" ]; then
  if [ ! -f "$FLAG" ]; then
    echo "🔥 ALERTA CPU AUTOCOR

Consumo de CPU ALTO.

CPU actual: ${CPU}%
Servidor: $(hostname)
Hora: $(date)

Es posible lentitud en la web.
" | msmtp -a outlook "$CORREO"

    touch "$FLAG"
  fi
else
  rm -f "$FLAG"
fi
