#!/bin/bash

PROCESS_NAME="Autocor"
LOG_FILE="/var/log/autocor-monitor.log"
EMAIL="dalmendaris@cotedem.com"
ALERT_HIGH_RAM_MB=1800   # alerta si pasa de ~1.8GB
DATE=$(date +"%Y-%m-%d %H:%M:%S")

# Asegurar que el log existe
touch $LOG_FILE

# Verificar estado del proceso
STATUS=$(pm2 info $PROCESS_NAME | grep status | awk '{print $4}')

if [[ "$STATUS" != "online" ]]; then
    MESSAGE="$DATE - ❌ Proceso $PROCESS_NAME CAÍDO."
    echo "$MESSAGE" >> $LOG_FILE
    echo "$MESSAGE" | mail -s "ALERTA: $PROCESS_NAME CAÍDO" $EMAIL
    exit 0
fi

# Verificar uso de RAM
RAM=$(pm2 info $PROCESS_NAME | grep memory | awk '{print int($4/1024/1024)}')

if [[ "$RAM" -gt "$ALERT_HIGH_RAM_MB" ]]; then
    MESSAGE="$DATE - ⚠️ RAM alta en $PROCESS_NAME: ${RAM}MB. Posible caída inminente."
    echo "$MESSAGE" >> $LOG_FILE
    echo "$MESSAGE" | mail -s "ALERTA: RAM ALTA ($PROCESS_NAME)" $EMAIL
    exit 0
fi
