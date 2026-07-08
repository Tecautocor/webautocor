#!/bin/bash

APP="autocor"
CORREO="tecnologia@autocor.com.ec"
STATE_FILE="/tmp/pm2_last_restart_count"

# Obtener número de reinicios actual
RESTARTS=$(pm2 jlist | jq -r ".[] | select(.name==\"$APP\") | .pm2_env.restart_time")

# Si no existe el archivo, lo creamos y salimos (primer arranque)
if [ ! -f "$STATE_FILE" ]; then
  echo "$RESTARTS" > "$STATE_FILE"
  exit 0
fi

# Leer último valor guardado
LAST=$(cat "$STATE_FILE")

# Si cambió el contador → hubo reinicio
if [ "$RESTARTS" != "$LAST" ]; then

  USO_MB=$(ps aux | grep next-server | grep -v grep | awk '{sum+=$6} END {printf "%.0f", sum/1024}')

  (
echo "Subject: ♻️ ALERTA PM2 AUTOCOR - REINICIO DETECTADO EN $(hostname)"
echo "From: tecnologia@autocor.com.ec"
echo "To: $CORREO"
echo "Content-Type: text/plain; charset=UTF-8"
echo ""
echo "♻️ REINICIO AUTOMÁTICO DETECTADO EN PM2"
echo ""
echo "Aplicación: $APP"
echo "Servidor: $(hostname)"
echo "Fecha: $(date)"
echo "Cantidad de reinicios: $RESTARTS"
echo ""
echo "Uso de RAM al momento del chequeo: ${USO_MB} MB"
echo ""
echo "Posible causa:"
echo "- Exceso de memoria RAM"
echo "- Cierre inesperado del proceso"
echo ""
echo "Se recomienda revisar logs y estado del servidor."
  ) | msmtp -a outlook "$CORREO"

  # Guardar nuevo valor para no volver a alertar lo mismo
  echo "$RESTARTS" > "$STATE_FILE"

fi





