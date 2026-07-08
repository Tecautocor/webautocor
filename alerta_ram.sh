#!/bin/bash

LIMITE_MB=1800
PROCESO="next-server"
CORREO="tecnologia@autocor.com.ec"
FLAG="/tmp/ram_alert_sent"

USO_MB=$(ps aux | grep "$PROCESO" | grep -v grep | awk '{sum+=$6} END {printf "%.0f", sum/1024}')

if [ "$USO_MB" -ge "$LIMITE_MB" ]; then
  if [ ! -f "$FLAG" ]; then
    (
echo "Subject: ⚠️ ALERTA RAM AUTOCOR - SERVIDOR $(hostname)"
echo "From: tecnologia@autocor.com.ec"
echo "To: $CORREO"
echo "Content-Type: text/plain; charset=UTF-8"
echo ""
echo "⚠️ ALERTA DE MEMORIA RAM EN SERVIDOR AUTOCOR"
echo ""
echo "Uso actual de RAM: ${USO_MB} MB"
echo "Límite configurado: 2048 MB"
echo ""
echo "Servidor: $(hostname)"
echo "Proceso: next-server"
echo "Fecha: $(date)"
echo ""
echo "Se recomienda verificar la aplicación inmediatamente."
) | msmtp -a outlook "$CORREO"

    touch "$FLAG"
  fi
else
  rm -f "$FLAG"
fi



