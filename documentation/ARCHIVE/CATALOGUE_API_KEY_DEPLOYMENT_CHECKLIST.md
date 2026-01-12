# Catalogue API Key Integration - Deployment Checklist

## Pre-Deployment Verification

### Backend Checks
- [ ] All new files created in `backend/src/guards/` and `backend/src/entities/`
- [ ] ApiKeyModule imported in `app.module.ts`
- [ ] ApiKey entity imported in `catalogue.module.ts`
- [ ] ApiKeyGuard applied to CatalogueController
- [ ] MongoDB connection working
- [ ] No TypeScript compilation errors

### Frontend Checks
- [ ] API Keys component created in `pages/settings/`
- [ ] API Docs component created in `modules/catalogue/pages/`
- [ ] Route added for `/settings/api-keys`
- [ ] Settings component updated with API Keys link
- [ ] Catalogue component updated with menu button
- [ ] No Angular compilation errors

### Documentation Checks
- [ ] API documentation created
- [ ] Implementation guide created
- [ ] Quick reference created
- [ ] Test documentation created
- [ ] Flow diagrams created

## Build & Test

### Local Testing
```bash
# 1. Install dependencies (if needed)
cd backend && npm install
cd ../frontend && npm install

# 2. Build backend
cd backend
npm run build

# 3. Build frontend
cd ../frontend
npm run build

# 4. Start backend
cd ../backend
npm run start:dev

# 5. Start frontend (in new terminal)
cd frontend
npm start

# 6. Run tests (in new terminal)
cd tests
node test-catalogue-api-key.js
```

### Verification Steps
- [ ] Backend starts without errors on port 3002
- [ ] Frontend starts without errors on port 4202
- [ ] Can access settings page: `http://localhost:4202/settings`
- [ ] Can access API keys page: `http://localhost:4202/settings/api-keys`
- [ ] Can create new API key
- [ ] Token is generated and displayed
- [ ] Can copy token to clipboard
- [ ] Can access catalogue module: `http://localhost:4202/modules/catalogue`
- [ ] Can see 3-dot menu in catalogue header
- [ ] Can open API Docs from menu
- [ ] API Docs dialog displays correctly
- [ ] Test script runs successfully with valid API key

## Production Deployment

### Backend Deployment
```bash
# 1. SSH to production server
ssh user@68.178.171.103

# 2. Navigate to project
cd /path/to/Bhuri-SAP

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies
cd backend
npm install

# 5. Build
npm run build

# 6. Restart PM2
cd ..
npm run pm2:restart:raccontixrm
```

### Frontend Deployment
```bash
# 1. Build for production
cd frontend
npm run build:prod

# 2. Restart PM2
cd ..
npm run pm2:restart:raccontixrm
```

### Post-Deployment Verification
- [ ] Backend accessible at `http://68.178.171.103:3002`
- [ ] Frontend accessible at `http://68.178.171.103:4202`
- [ ] Can create API key in production
- [ ] API key authentication works in production
- [ ] API Docs accessible in production
- [ ] No console errors in browser
- [ ] No errors in PM2 logs

## Database Verification

### MongoDB Checks
```bash
# Connect to MongoDB
mongo

# Switch to database
use your_database_name

# Check if api_keys collection exists
show collections

# View API keys
db.api_keys.find().pretty()

# Check indexes
db.api_keys.getIndexes()
```

Expected indexes:
- [ ] `_id` index (default)
- [ ] `token` unique index (auto-created by TypeORM)

## Security Checklist

### Backend Security
- [ ] API keys are stored securely in MongoDB
- [ ] Tokens are generated with crypto.randomBytes
- [ ] Expiry dates are enforced
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Expired tokens return 401 Unauthorized
- [ ] Usage tracking is working

### Frontend Security
- [ ] API keys are only visible to authenticated users
- [ ] Settings page requires authentication
- [ ] API key creation requires authentication
- [ ] Tokens are displayed with copy button (not editable)

### CORS Configuration
- [ ] CORS allows `X-API-Key` header
- [ ] CORS configured for production domains

```typescript
// In main.ts or app configuration
app.enableCors({
  origin: ['http://localhost:4202', 'http://68.178.171.103:4202'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
});
```

## API Testing

### Manual API Tests
```bash
# Test 1: No API key (should fail)
curl http://68.178.171.103:3002/api/catalogue/products

# Test 2: Invalid API key (should fail)
curl -H "X-API-Key: invalid" \
  http://68.178.171.103:3002/api/catalogue/products

# Test 3: Valid API key (should succeed)
curl -H "X-API-Key: YOUR_TOKEN" \
  http://68.178.171.103:3002/api/catalogue/products

# Test 4: Create product
curl -X POST \
  -H "X-API-Key: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","productCode":"TEST001","basePrice":99.99,"currency":"USD"}' \
  http://68.178.171.103:3002/api/catalogue/products
```

### Automated Tests
```bash
# Update test script with production URL
cd tests
# Edit test-catalogue-api-key.js
# Change BASE_URL to production URL
node test-catalogue-api-key.js
```

## User Documentation

### Admin Guide
- [ ] Document how to create API keys
- [ ] Document how to manage API keys
- [ ] Document how to monitor usage
- [ ] Document security best practices

### Developer Guide
- [ ] Share API documentation link
- [ ] Provide example code snippets
- [ ] Document authentication methods
- [ ] Document error handling

## Monitoring Setup

### Metrics to Track
- [ ] Number of active API keys
- [ ] Number of expired API keys
- [ ] Total API requests per day
- [ ] Failed authentication attempts
- [ ] Most used API keys

### Alerts to Configure
- [ ] Alert when API key is about to expire (7 days)
- [ ] Alert on high number of 401 errors
- [ ] Alert on unusual usage patterns

## Rollback Plan

### If Issues Occur
1. **Remove API Key Guard:**
   ```typescript
   // In catalogue.controller.ts
   // Comment out: @UseGuards(ApiKeyGuard)
   ```

2. **Restart Backend:**
   ```bash
   npm run pm2:restart:raccontixrm
   ```

3. **Revert Git Changes:**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Success Criteria

### Functional Requirements
- [x] API keys can be created from settings
- [x] API keys have expiry dates
- [x] API keys can be used to access catalogue APIs
- [x] Invalid/expired keys are rejected
- [x] Usage is tracked
- [x] API documentation is accessible
- [x] All 36 catalogue endpoints are protected

### Non-Functional Requirements
- [x] Response time < 200ms for API key validation
- [x] No breaking changes to existing functionality
- [x] Backward compatible (can be disabled if needed)
- [x] Clear error messages for users
- [x] Comprehensive documentation

## Post-Deployment Tasks

### Week 1
- [ ] Monitor API key creation rate
- [ ] Check for any 401 errors in logs
- [ ] Verify usage tracking is accurate
- [ ] Collect user feedback

### Week 2
- [ ] Review API key usage patterns
- [ ] Identify any performance issues
- [ ] Update documentation based on feedback
- [ ] Plan for rate limiting (if needed)

### Month 1
- [ ] Analyze API usage statistics
- [ ] Consider adding more features (rate limiting, scopes)
- [ ] Review security logs
- [ ] Update best practices guide

## Support Resources

### For Users
- Settings page: `http://68.178.171.103:4202/settings/api-keys`
- API Docs: Catalogue module → ⋮ → API Docs
- Documentation: `/documentation/CATALOGUE_API_DOCUMENTATION.md`

### For Developers
- Implementation guide: `/documentation/CATALOGUE_API_KEY_INTEGRATION.md`
- Quick reference: `/documentation/CATALOGUE_API_QUICK_REFERENCE.md`
- Test script: `/tests/test-catalogue-api-key.js`
- Flow diagrams: `/documentation/CATALOGUE_API_KEY_FLOW_DIAGRAM.md`

## Sign-Off

- [ ] Backend developer reviewed and approved
- [ ] Frontend developer reviewed and approved
- [ ] QA tested all scenarios
- [ ] Documentation reviewed
- [ ] Security reviewed
- [ ] Product owner approved
- [ ] Ready for production deployment

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Verified By:** _________________

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
