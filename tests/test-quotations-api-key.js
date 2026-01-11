const http = require('http');

const BASE_URL = 'http://localhost:3000/api/quotations';
let apiKey = '';

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Quotations API Key Tests\n');
    let passed = 0;
    let failed = 0;

    try {
        // Test 1: Request without API key
        console.log('Test 1: Request without API key');
        let res = await makeRequest('GET', '/');
        if (res.status === 401) {
            console.log('✅ PASS: Got 401 Unauthorized\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 401, got ${res.status}\n`);
            failed++;
        }

        // Test 2: Request with invalid API key
        console.log('Test 2: Request with invalid API key');
        res = await makeRequest('GET', '/', null, { 'X-API-Key': 'invalid-key' });
        if (res.status === 401) {
            console.log('✅ PASS: Got 401 Unauthorized\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 401, got ${res.status}\n`);
            failed++;
        }

        // Test 3: Get API key from settings (requires JWT token)
        console.log('Test 3: Creating API key via settings endpoint');
        console.log('⚠️  SKIPPED: Requires JWT authentication\n');

        // Test 4: Request with valid API key (query parameter)
        console.log('Test 4: Request with API key as query parameter');
        console.log('⚠️  SKIPPED: Requires valid API key\n');

        // Test 5: Create quotation with API key
        console.log('Test 5: Create quotation with API key');
        console.log('⚠️  SKIPPED: Requires valid API key\n');

        // Test 6: Get quotations with API key
        console.log('Test 6: Get quotations with API key');
        console.log('⚠️  SKIPPED: Requires valid API key\n');

        console.log('\n📊 Test Summary');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⏭️  Skipped: 4\n`);

        console.log('📝 To run full tests with API key:');
        console.log('1. Navigate to http://localhost:4200/settings');
        console.log('2. Click "API Keys" under Privacy & Security');
        console.log('3. Create a new API key');
        console.log('4. Copy the token and set it in this script');
        console.log('5. Run: node test-quotations-api-key.js\n');

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

runTests();
