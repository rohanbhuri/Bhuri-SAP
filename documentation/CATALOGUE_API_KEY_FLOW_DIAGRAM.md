# Catalogue API Key Authentication Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     External Website/App                         │
│  (example.com, app.example.com, mobile app, etc.)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Request with API Key
                         │ Header: X-API-Key: abc123...
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NestJS Backend (Port 3002)                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Catalogue Controller                       │    │
│  │         @UseGuards(ApiKeyGuard)                        │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│                       ▼                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Key Guard                              │    │
│  │  1. Extract token from header/query                    │    │
│  │  2. Validate token exists                              │    │
│  │  3. Check if active                                    │    │
│  │  4. Check if expired                                   │    │
│  │  5. Update usage stats                                 │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│                       ▼                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           MongoDB - api_keys Collection                 │    │
│  │  {                                                      │    │
│  │    token: "abc123...",                                 │    │
│  │    expiresAt: Date,                                    │    │
│  │    isActive: true,                                     │    │
│  │    usageCount: 42,                                     │    │
│  │    allowedDomains: ["example.com"]                     │    │
│  │  }                                                      │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│                       ▼                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Catalogue Service (Products, etc.)              │    │
│  │  - Find products                                        │    │
│  │  - Create product                                       │    │
│  │  - Update product                                       │    │
│  │  - Delete product                                       │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
              JSON Response to Client
```

## User Flow - Creating API Key

```
┌──────────────────────────────────────────────────────────────┐
│  Step 1: Navigate to Settings                                 │
│  http://localhost:4202/settings                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 2: Click "API Keys" under Privacy & Security           │
│  Route: /settings/api-keys                                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 3: Click "Create API Key" Button                       │
│  Opens dialog with form                                      │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 4: Fill Form                                           │
│  - Name: "Website Integration"                               │
│  - Expiry Date: 2025-12-31                                  │
│  - Allowed Domains: "example.com, app.example.com"          │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 5: Backend Creates Token                               │
│  POST /api/api-keys                                          │
│  - Generates crypto-random 64-char token                     │
│  - Saves to MongoDB                                          │
│  - Returns API key object                                    │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 6: Display Token                                       │
│  Shows token with copy button                                │
│  User copies: "a1b2c3d4e5f6..."                             │
└──────────────────────────────────────────────────────────────┘
```

## Request Flow - Using API Key

```
┌──────────────────────────────────────────────────────────────┐
│  External App Makes Request                                   │
│  GET http://localhost:3002/api/catalogue/products            │
│  Header: X-API-Key: a1b2c3d4e5f6...                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  API Key Guard Intercepts                                    │
│  1. Extract token from header                                │
│  2. Query MongoDB for matching token                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Token Invalid  │    │  Token Valid    │
│  or Expired     │    │  and Active     │
└────────┬────────┘    └────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Return 401     │    │  Update Stats   │
│  Unauthorized   │    │  usageCount++   │
│                 │    │  lastUsedAt=now │
└─────────────────┘    └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Allow Request  │
                       │  Continue to    │
                       │  Controller     │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Execute Logic  │
                       │  Return Data    │
                       └─────────────────┘
```

## API Documentation Access Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Step 1: Navigate to Catalogue Module                        │
│  http://localhost:4202/modules/catalogue                     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 2: Click 3-Dot Menu (⋮) in Header                     │
│  Menu appears with options                                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 3: Click "API Docs" Menu Item                         │
│  Opens full-screen dialog (90vw x 90vh)                     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 4: Browse Documentation                                │
│  - Tabs: Products, Categories, Collections, Designers       │
│  - Expandable panels for each endpoint                       │
│  - Method badges (GET, POST, PUT, DELETE)                   │
│  - Request/response examples                                 │
│  - Copy cURL examples                                        │
└──────────────────────────────────────────────────────────────┘
```

## Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                    API Key Entity                            │
├─────────────────────────────────────────────────────────────┤
│  _id: ObjectId                                              │
│  name: string                    "Website Integration"      │
│  token: string (unique)          "a1b2c3d4e5f6..."         │
│  userId: string                  "507f1f77bcf86cd799439011" │
│  organizationId: string          "507f1f77bcf86cd799439012" │
│  expiresAt: Date                 2025-12-31T23:59:59Z      │
│  isActive: boolean               true                       │
│  allowedDomains: string[]        ["example.com"]           │
│  usageCount: number              42                         │
│  createdAt: Date                 2024-01-15T10:30:00Z      │
│  lastUsedAt: Date                2024-01-20T14:22:33Z      │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Token Validation                                   │
│  - Check if token exists in request                         │
│  - Verify token format                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Database Lookup                                    │
│  - Query MongoDB for matching token                          │
│  - Check if token exists                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Status Check                                       │
│  - Verify isActive = true                                    │
│  - Reject if deactivated                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Expiry Check                                       │
│  - Compare expiresAt with current date                       │
│  - Reject if expired                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 5: Domain Check (Optional)                           │
│  - If allowedDomains configured                              │
│  - Verify request origin matches                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 6: Usage Tracking                                     │
│  - Increment usageCount                                      │
│  - Update lastUsedAt timestamp                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
                  ✅ ALLOW
```

## Integration Example

```
┌─────────────────────────────────────────────────────────────┐
│              External Website (example.com)                  │
│                                                              │
│  <script>                                                    │
│    const API_KEY = 'a1b2c3d4e5f6...';                      │
│    const API_URL = 'http://68.178.171.103:3002/api';       │
│                                                              │
│    async function loadProducts() {                          │
│      const response = await fetch(                          │
│        `${API_URL}/catalogue/products`,                     │
│        { headers: { 'X-API-Key': API_KEY } }               │
│      );                                                      │
│      const products = await response.json();                │
│      displayProducts(products);                             │
│    }                                                         │
│  </script>                                                   │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring Dashboard (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                    API Key Dashboard                         │
├─────────────────────────────────────────────────────────────┤
│  Active Keys: 5                                             │
│  Expired Keys: 2                                            │
│  Total Requests Today: 1,234                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Key: Website Integration                           │   │
│  │  Status: ● Active                                   │   │
│  │  Requests: 456 (last 24h)                          │   │
│  │  Last Used: 2 minutes ago                          │   │
│  │  Expires: 45 days                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Key: Mobile App                                    │   │
│  │  Status: ● Active                                   │   │
│  │  Requests: 789 (last 24h)                          │   │
│  │  Last Used: 5 seconds ago                          │   │
│  │  Expires: 90 days                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
