#!/bin/bash

echo "🚀 Setting up Catalogue Management Module..."

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p backend/uploads/products/images
mkdir -p backend/uploads/products/videos
mkdir -p backend/uploads/products/models

# Create environment file if it doesn't exist
if [ ! -f "frontend/src/environments/environment.ts" ]; then
    echo "📝 Creating environment file..."
    cat > frontend/src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
EOF
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Seed database: cd backend && node src/scripts/seed-racconti.js"
echo "3. Start backend: cd backend && npm run start:dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Login credentials:"
echo "Email: admin@racconti.com"
echo "Password: admin123"
