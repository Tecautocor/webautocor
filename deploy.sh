#!/bin/bash
set -e
echo '🚀 Iniciando deploy...'
cd /home/Autocor
echo '📥 Descargando cambios de GitHub...'
git pull origin main
echo '📦 Instalando dependencias...'
npm install --no-audit --no-fund
echo '📦 Compilando en carpeta aparte (.next-new) - el servidor actual sigue sirviendo tráfico normal mientras tanto...'
rm -rf .next-new
NEXT_BUILD_DIR=.next-new npm run build
echo '🔁 Build listo - haciendo swap de .next y reiniciando (downtime de pocos segundos, no minutos)...'
rm -rf .next-old
mv .next .next-old 2>/dev/null || true
mv .next-new .next
pm2 restart ecosystem.config.js
echo '⏳ Calentando caché...'
sleep 5
curl -s -X POST http://localhost:3000/api/token > /dev/null
echo '✅ Deploy completado exitosamente'
pm2 list
