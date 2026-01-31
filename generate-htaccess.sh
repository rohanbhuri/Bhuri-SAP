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
RewriteEngine On

# Route API requests to backend proxy
RewriteRule ^api/(.*)$ api-proxy.php?path=\$1 [QSA,L]

# Route all other requests to SSR frontend proxy
RewriteRule ^(.*)$ frontend-proxy.php?path=\$1 [QSA,L]
EOF

# Create api-proxy.php
cat > ../api-proxy.php <<'APIEOF'
<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the API path
\$path = \$_GET['path'] ?? '';
\$queryString = \$_SERVER['QUERY_STRING'] ?? '';

// Remove path parameter from query string
if (strpos(\$queryString, 'path=') !== false) {
    \$queryParts = explode('&', \$queryString);
    \$filteredParts = array_filter(\$queryParts, function(\$part) {
        return strpos(\$part, 'path=') !== 0;
    });
    \$queryString = implode('&', \$filteredParts);
}

// Build target URL
\$url = "http://$PRODUCTION_IP:$BACKEND_PORT/api/" . \$path;
if (!empty(\$queryString)) {
    \$url .= '?' . \$queryString;
}

// Initialize cURL
\$ch = curl_init();
curl_setopt(\$ch, CURLOPT_URL, \$url);
curl_setopt(\$ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt(\$ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt(\$ch, CURLOPT_TIMEOUT, 30);
curl_setopt(\$ch, CURLOPT_CUSTOMREQUEST, \$_SERVER['REQUEST_METHOD']);

// Forward request headers
\$headers = [];
foreach (\$_SERVER as \$key => \$value) {
    if (strpos(\$key, 'HTTP_') === 0) {
        \$headerName = str_replace('_', '-', substr(\$key, 5));
        // Skip problematic headers
        if (!in_array(strtolower(\$headerName), ['host', 'connection', 'content-length'])) {
            \$headers[] = \$headerName . ': ' . \$value;
        }
    }
}

// Ensure Content-Type is set for POST requests
if (\$_SERVER['REQUEST_METHOD'] !== 'GET' && !isset(\$_SERVER['HTTP_CONTENT_TYPE'])) {
    \$headers[] = 'Content-Type: application/json';
}

curl_setopt(\$ch, CURLOPT_HTTPHEADER, \$headers);

// Handle request body for POST/PUT/PATCH requests
if (in_array(\$_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    \$input = file_get_contents('php://input');
    curl_setopt(\$ch, CURLOPT_POSTFIELDS, \$input);
}

// Execute request
\$response = curl_exec(\$ch);
\$httpCode = curl_getinfo(\$ch, CURLINFO_HTTP_CODE);
\$contentType = curl_getinfo(\$ch, CURLINFO_CONTENT_TYPE);

// Check for cURL errors
if (curl_error(\$ch)) {
    http_response_code(503);
    echo json_encode(['error' => 'Proxy error: ' . curl_error(\$ch)]);
    curl_close(\$ch);
    exit;
}

curl_close(\$ch);

// Set response headers
if (\$contentType) {
    header('Content-Type: ' . \$contentType);
}

// Return response
http_response_code(\$httpCode);
echo \$response;
?>
APIEOF

# Create frontend-proxy.php
cat > ../frontend-proxy.php <<'FRONTEOF'
<?php
// Get the requested path
\$path = \$_GET['path'] ?? '';

// Remove 'path=' from query string if it exists
\$queryString = \$_SERVER['QUERY_STRING'] ?? '';
if (strpos(\$queryString, 'path=') === 0) {
    \$queryParts = explode('&', \$queryString, 2);
    \$queryString = isset(\$queryParts[1]) ? \$queryParts[1] : '';
}

// Build the target URL
\$url = "http://$PRODUCTION_IP:$FRONTEND_PORT/" . \$path;
if (\$queryString) {
    \$url .= '?' . \$queryString;
}

// Initialize cURL
\$ch = curl_init();
curl_setopt(\$ch, CURLOPT_URL, \$url);
curl_setopt(\$ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt(\$ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt(\$ch, CURLOPT_TIMEOUT, 30);
curl_setopt(\$ch, CURLOPT_USERAGENT, \$_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0');

// Forward headers
\$headers = [];
foreach (\$_SERVER as \$key => \$value) {
    if (strpos(\$key, 'HTTP_') === 0) {
        \$header = str_replace('_', '-', substr(\$key, 5));
        if (!in_array(strtolower(\$header), ['host', 'connection'])) {
            \$headers[] = \$header . ': ' . \$value;
        }
    }
}
curl_setopt(\$ch, CURLOPT_HTTPHEADER, \$headers);

// Execute request
\$response = curl_exec(\$ch);
\$httpCode = curl_getinfo(\$ch, CURLINFO_HTTP_CODE);
\$contentType = curl_getinfo(\$ch, CURLINFO_CONTENT_TYPE);

// Handle errors
if (curl_error(\$ch)) {
    http_response_code(503);
    echo "SSR Server unavailable: " . curl_error(\$ch);
    curl_close(\$ch);
    exit;
}

curl_close(\$ch);

// Set response headers
if (\$contentType) {
    header('Content-Type: ' . \$contentType);
}

http_response_code(\$httpCode);
echo \$response;
?>
FRONTEOF

echo "✅ .htaccess and proxy files created successfully!"
echo ""
echo "📋 Files created:"
echo "- .htaccess (simple proxy configuration)"
echo "- api-proxy.php (backend proxy)"
echo "- frontend-proxy.php (SSR frontend proxy)"
echo ""
echo "📋 Next steps for Hostinger deployment:"
echo "1. Files created in parent directory (public_html)"
echo "2. Make sure your Node.js applications are running on the server"
echo "3. Ensure ports $FRONTEND_PORT and $BACKEND_PORT are accessible"
echo "4. Test the domain: https://$DOMAIN"
echo ""
echo "🔧 Server commands to run:"
echo "npm run pm2:start:$BRAND"