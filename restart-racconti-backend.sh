#!/bin/bash

echo "🔄 Restarting RaccontiXRM Backend..."

# Build backend
cd backend
npm run build
cd ..

# Restart PM2 process
pm2 restart raccontixrm-backend

echo "✅ RaccontiXRM Backend restarted!"
echo "🔗 API: http://68.178.171.103:3002/api"
echo "🏥 Health: http://68.178.171.103:3002/api/health"