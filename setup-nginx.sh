#!/bin/bash

echo "Detecting OS and installing Nginx..."
if command -v apt &> /dev/null; then
    sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
elif command -v yum &> /dev/null; then
    sudo yum install -y nginx certbot python3-certbot-nginx
elif command -v dnf &> /dev/null; then
    sudo dnf install -y nginx certbot python3-certbot-nginx
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
    echo "  - http://racconti.in → http://localhost:5002"
    echo "  - http://xrm.racconti.in → http://localhost:4202 (Frontend)"
    echo "  - http://xrm.racconti.in/api → http://localhost:3002 (Backend API)"
    echo ""
    echo "DNS records required (point to 68.178.171.103):"
    echo "  A record: racconti.in → 68.178.171.103"
    echo "  A record: xrm.racconti.in → 68.178.171.103"
    echo ""
    read -p "Do you want to setup SSL certificates? (y/n): " setup_ssl
    if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ]; then
        echo ""
        echo "Setting up SSL for racconti.in..."
        sudo certbot --nginx -d racconti.in -d www.racconti.in
        echo ""
        echo "Setting up SSL for xrm.racconti.in..."
        sudo certbot --nginx -d xrm.racconti.in
        echo ""
        echo "✓ SSL setup complete!"
        echo "  - https://racconti.in"
        echo "  - https://xrm.racconti.in"
    else
        echo "Skipping SSL setup. Run 'sudo certbot --nginx' manually later."
    fi
else
    echo "✗ Nginx configuration test failed!"
    exit 1
fi
