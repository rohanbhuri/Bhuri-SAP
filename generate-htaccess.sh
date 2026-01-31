#!/bin/bash

# Dynamic .htaccess Generator for Hostinger
# Reads configuration from config.js and creates .htaccess file

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

echo "🚀 Creating .htaccess for $APP_NAME"
echo "📱 Domain: $DOMAIN"
echo "🔗 Frontend Port: $FRONTEND_PORT"
echo "⚙️  Backend Port: $BACKEND_PORT"
echo "🌐 Production IP: $PRODUCTION_IP"

# Create .htaccess file in parent directory (public_html)
HTACCESS_FILE="../.htaccess"

cat > $HTACCESS_FILE <<EOF
# .htaccess for $APP_NAME - Generated automatically
# Domain: $DOMAIN

RewriteEngine On

# Enable CORS for API requests
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Handle preflight OPTIONS requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ - [R=200,L]

# API Routes - Proxy to backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://$PRODUCTION_IP:$BACKEND_PORT/api/\$1 [P,L]

# Static assets - serve directly if they exist
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.*)$ - [L]

# Frontend Routes - Proxy to frontend for all other requests
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ http://$PRODUCTION_IP:$FRONTEND_PORT/\$1 [P,L]

# Fallback for Angular routing - serve index.html for non-API routes
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://$PRODUCTION_IP:$FRONTEND_PORT/ [P,L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache Control for static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Error Pages
ErrorDocument 404 http://$PRODUCTION_IP:$FRONTEND_PORT/
ErrorDocument 500 http://$PRODUCTION_IP:$FRONTEND_PORT/
EOF

echo "✅ .htaccess file created successfully!"
echo ""
echo "📋 File contents:"
echo "=================="
cat $HTACCESS_FILE
echo "=================="
echo ""
echo "📋 Next steps for Hostinger deployment:"
echo "1. .htaccess file created in parent directory (public_html)"
echo "2. Make sure your Node.js applications are running on the server"
echo "3. Ensure ports $FRONTEND_PORT and $BACKEND_PORT are accessible"
echo "4. Test the domain: https://$DOMAIN"
echo ""
echo "🔧 Server commands to run:"
echo "npm run pm2:start:$BRAND"
EOF