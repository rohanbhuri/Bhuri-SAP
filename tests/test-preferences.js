#!/usr/bin/env node

/**
 * Test script for preferences endpoint
 * Usage: node test-preferences.js <token>
 */

const http = require('http');

const token = process.argv[2];
if (!token) {
  console.error('Usage: node test-preferences.js <your-jwt-token>');
  process.exit(1);
}

// Test GET preferences
const getOptions = {
  hostname: 'localhost',
  port: 3000, // Change to 3001 for True Process
  path: '/api/preferences',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

console.log('Testing GET /api/preferences...');
const getReq = http.request(getOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✓ GET preferences successful');
      testPost();
    } else {
      console.log('\n✗ GET preferences failed');
    }
  });
});

getReq.on('error', (e) => {
  console.error('Error:', e.message);
});

getReq.end();

// Test POST preferences
function testPost() {
  const postData = JSON.stringify({
    theme: 'dark',
    primaryColor: '#3B82F6',
    currency: 'USD',
    currencySymbol: '$'
  });

  const postOptions = {
    hostname: 'localhost',
    port: 3000, // Change to 3001 for True Process
    path: '/api/preferences',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('\nTesting POST /api/preferences...');
  const postReq = http.request(postOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✓ POST preferences successful');
      } else {
        console.log('\n✗ POST preferences failed');
      }
    });
  });

  postReq.on('error', (e) => {
    console.error('Error:', e.message);
  });

  postReq.write(postData);
  postReq.end();
}
