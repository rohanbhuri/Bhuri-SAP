#!/bin/bash

echo "Detecting OS and installing Nginx..."
if command -v apt &> /dev/null; then
    sudo apt update && sudo apt install -y nginx
elif command -v yum &> /dev/null; then
    sudo yum install -y nginx
elif command -v dnf &> /dev/null; then
    sudo dnf install -y nginx
else
    echo "✗ Unsupported package manager. Install Nginx manually."
    exit 1
fi

echo "Copying Nginx configuration..."
sudo mkdir -p /etc/nginx/conf.d
sudo cp nginx.conf /etc/nginx/conf.d/racconti.conf

echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo "✓ Nginx setup complete!"
    echo ""
    echo "Configuration:"
    echo "  - racconti.in → http://localhost:5002"
    echo "  - xrm.racconti.in → http://localhost:4202 (Frontend)"
    echo "  - xrm.racconti.in/api → http://localhost:3002 (Backend API)"
    echo ""
    echo "Make sure your DNS records point to 68.178.171.103:"
    echo "  A record: racconti.in → 68.178.171.103"
    echo "  A record: xrm.racconti.in → 68.178.171.103"
else
    echo "✗ Nginx configuration test failed!"
    exit 1
fi
