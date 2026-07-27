#!/bin/bash
set -e
echo '🚀 Iniciando deploy...'
cd /home/Autocor
echo '📥 Descargando cambios de GitHub...'
git pull origin main
echo '📦 Instalando dependencias...'
npm install --no-audit --no-fund
echo '⏸️  Deteniendo servidor (next build limpia .next, no puede convivir con el proceso viejo leyendo esos archivos)...'
pm2 stop ecosystem.config.js
echo '📦 Compilando...'
if npm run build; then
  echo '▶️  Iniciando servidor con el build nuevo...'
  pm2 start ecosystem.config.js
else
  echo '❌ El build falló — .next quedó a medio regenerar (next build lo limpia al iniciar). Intentando levantar el proceso igual para no dejarlo "stopped", pero probablemente sirva errores hasta corregir el código y desplegar de nuevo.'
  pm2 start ecosystem.config.js
  pm2 list
  exit 1
fi
echo '⏳ Calentando caché...'
sleep 5
curl -s -X POST http://localhost:3000/api/token > /dev/null
echo '✅ Deploy completado exitosamente'
pm2 list
