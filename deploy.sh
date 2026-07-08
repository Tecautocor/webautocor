#!/bin/bash
set -e
echo '🚀 Iniciando deploy...'
cd /home/Autocor
echo '📥 Descargando cambios de GitHub...'
git pull origin main
echo '📦 Instalando dependencias...'
npm install --no-audit --no-fund
echo '📦 Compilando...'
npm run build
echo '🔄 Reiniciando servidor...'
pm2 restart autocor
echo '⏳ Calentando caché...'
sleep 5
curl -s -X POST http://localhost:3000/api/token > /dev/null
echo '✅ Deploy completado exitosamente'
pm2 list
