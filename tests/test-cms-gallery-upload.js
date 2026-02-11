/**
 * Test Script for CMS Gallery Upload Feature
 * 
 * This script tests the new organized folder structure and gallery upload endpoints
 * for both Blog and News Media modules.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || 'your-api-key-here';

// Test image path (you'll need to provide a test image)
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

console.log('🧪 CMS Gallery Upload Test Suite\n');
console.log(`API URL: ${API_URL}`);
console.log(`API Key: ${API_KEY ? '✓ Set' : '✗ Not set'}\n`);

// Helper function to create test image if it doesn't exist
function ensureTestImage() {
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.log('⚠️  Test image not found. Please provide a test image at:');
    console.log(`   ${TEST_IMAGE_PATH}\n`);
    return false;
  }
  return true;
}

// Test 1: Upload Blog Featured Image
async function testBlogFeaturedUpload() {
  console.log('📝 Test 1: Upload Blog Featured Image');
  
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(
      `${API_URL}/media/upload/blog/featured`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': API_KEY
        }
      }
    );

    console.log('✅ Success!');
    console.log('   URL:', response.data.url);
    console.log('   Filename:', response.data.filename);
    console.log('   Size:', response.data.size, 'bytes\n');
    
    return response.data;
  } catch (error) {
    console.log('❌ Failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 2: Upload Blog Gallery Images
async function testBlogGalleryUpload() {
  console.log('📝 Test 2: Upload Blog Gallery Images (Multiple)');
  
  try {
    const formData = new FormData();
    // Append the same image multiple times to simulate multiple uploads
    formData.append('files', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('files', fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(
      `${API_URL}/media/upload/blog/gallery`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': API_KEY
        }
      }
    );

    console.log('✅ Success!');
    console.log('   Files uploaded:', response.data.count);
    response.data.files.forEach((file, index) => {
      console.log(`   [${index + 1}] ${file.url}`);
    });
    console.log('');
    
    return response.data;
  } catch (error) {
    console.log('❌ Failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 3: Upload News Featured Image
async function testNewsFeaturedUpload() {
  console.log('📝 Test 3: Upload News Featured Image');
  
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(
      `${API_URL}/media/upload/news/featured`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': API_KEY
        }
      }
    );

    console.log('✅ Success!');
    console.log('   URL:', response.data.url);
    console.log('   Filename:', response.data.filename);
    console.log('   Size:', response.data.size, 'bytes\n');
    
    return response.data;
  } catch (error) {
    console.log('❌ Failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 4: Upload News Gallery Images
async function testNewsGalleryUpload() {
  console.log('📝 Test 4: Upload News Gallery Images (Multiple)');
  
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('files', fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(
      `${API_URL}/media/upload/news/gallery`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': API_KEY
        }
      }
    );

    console.log('✅ Success!');
    console.log('   Files uploaded:', response.data.count);
    response.data.files.forEach((file, index) => {
      console.log(`   [${index + 1}] ${file.url}`);
    });
    console.log('');
    
    return response.data;
  } catch (error) {
    console.log('❌ Failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 5: Verify Folder Structure
async function testFolderStructure() {
  console.log('📝 Test 5: Verify Folder Structure');
  
  const blogsDir = path.join(__dirname, '../backend/uploads/blogs');
  const newsDir = path.join(__dirname, '../backend/uploads/news');
  
  const blogsDirExists = fs.existsSync(blogsDir);
  const newsDirExists = fs.existsSync(newsDir);
  
  console.log('   blogs/ directory:', blogsDirExists ? '✅ Exists' : '❌ Not found');
  console.log('   news/ directory:', newsDirExists ? '✅ Exists' : '❌ Not found');
  
  if (blogsDirExists) {
    const blogsFiles = fs.readdirSync(blogsDir);
    console.log(`   blogs/ contains ${blogsFiles.length} file(s)`);
  }
  
  if (newsDirExists) {
    const newsFiles = fs.readdirSync(newsDir);
    console.log(`   news/ contains ${newsFiles.length} file(s)`);
  }
  
  console.log('');
}

// Run all tests
async function runTests() {
  if (!ensureTestImage()) {
    console.log('💡 Tip: Create a test image or use an existing one:');
    console.log('   cp /path/to/your/image.jpg tests/test-image.jpg\n');
    return;
  }

  console.log('Starting tests...\n');
  
  await testBlogFeaturedUpload();
  await testBlogGalleryUpload();
  await testNewsFeaturedUpload();
  await testNewsGalleryUpload();
  await testFolderStructure();
  
  console.log('✨ Test suite completed!\n');
  console.log('📁 Check the following directories for uploaded files:');
  console.log('   - backend/uploads/blogs/');
  console.log('   - backend/uploads/news/\n');
}

// Execute tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  process.exit(1);
});
