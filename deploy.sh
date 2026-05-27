#!/bin/bash
set -e
echo '🚀 Iniciando deploy...'
cd /home/Autocor
echo '📥 Descargando cambios de GitHub...'
git pull origin main
echo '🧹 Limpiando build anterior...'
find /home/Autocor/.next -type f -delete 2>/dev/null; find /home/Autocor/.next -type d -empty -delete 2>/dev/null; true
echo '📦 Compilando...'
npm run build
echo '🔄 Recargando servidor sin downtime...'
pm2 reload autocor
echo '⏳ Calentando caché...'
sleep 5
curl -s -X POST http://localhost:3000/api/token > /dev/null
echo '✅ Deploy completado exitosamente'
pm2 list
