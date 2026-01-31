#!/bin/bash

# Dynamic Nginx Setup Script
# Reads configuration from config.js and sets up nginx accordingly

# Check if brand parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <brand>"
    echo "Available brands: beaxrm, true-process, raccontixrm"
    exit 1
fi

BRAND=$1

# Extract configuration from config.js using Node.js
CONFIG=$(node -e "
const { getConfig } = require('./config.js');
const config = getConfig('$BRAND');
console.log(JSON.stringify({
    domain: config.app.domain,
    frontendPort: config.app.port,
    backendPort: config.production.PORT,
    appName: config.app.name,
    productionIP: config.app.productionIP || 'localhost'
}));
")

# Parse JSON configuration
DOMAIN=$(echo $CONFIG | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).domain)")
FRONTEND_PORT=$(echo $CONFIG | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).frontendPort)")
BACKEND_PORT=$(echo $CONFIG | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).backendPort)")
APP_NAME=$(echo $CONFIG | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).appName)")
PRODUCTION_IP=$(echo $CONFIG | node -e "console.log(JSON.parse(require('fs').readFileSync(0, 'utf8')).productionIP)")

echo "🚀 Setting up Nginx for $APP_NAME"
echo "📱 Domain: $DOMAIN"
echo "🔗 Frontend Port: $FRONTEND_PORT"
echo "⚙️  Backend Port: $BACKEND_PORT"
echo "🌐 Production IP: $PRODUCTION_IP"

# Create nginx configuration
NGINX_CONFIG="/etc/nginx/sites-available/$BRAND"

sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend (Angular)
    location / {
        proxy_pass http://$PRODUCTION_IP:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://$PRODUCTION_IP:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://$PRODUCTION_IP:$FRONTEND_PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/$BRAND

# Test nginx configuration
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
    
    echo ""
    echo "🎉 Nginx setup completed for $APP_NAME!"
    echo "🌐 Your application will be available at: http://$DOMAIN"
    echo ""
    echo "📋 Next steps:"
    echo "1. Make sure your application is running: npm run pm2:start:$BRAND"
    echo "2. Configure SSL certificate if needed"
    echo "3. Update DNS records to point to this server"
    
else
    echo "❌ Nginx configuration test failed"
    echo "Please check the configuration and try again"
    exit 1
fi