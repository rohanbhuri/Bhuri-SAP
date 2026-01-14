#!/bin/bash

echo "Installing Nginx..."
sudo apt update
sudo apt install -y nginx

echo "Copying Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/racconti

echo "Creating symbolic link..."
sudo ln -sf /etc/nginx/sites-available/racconti /etc/nginx/sites-enabled/

echo "Removing default Nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

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
