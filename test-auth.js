// Test authentication and module loading
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlYXguY29tIiwic3ViIjoiNjhiYzkyYmNiMjg0OGNjNjhhZTk0ZDRkIiwib3JnYW5pemF0aW9uSWQiOiI2OGJjOTJiY2IyODQ4Y2M2OGFlOTRkNGEiLCJyb2xlcyI6WyJzdXBlcl9hZG1pbiJdLCJpYXQiOjE3NTcxODkwMjEsImV4cCI6MTc1NzE5MjYyMX0.JxbpvVOFPAVHpD5ZKOpx0SHFN0QodYzqLu7zLv8ejXg";
const orgId = "68bc92bcb2848cc68ae94d4a";

console.log("Setting token in localStorage...");
localStorage.setItem('access_token', token);

console.log("Token set. Now testing module API...");
fetch(`http://localhost:3000/api/modules/organization/${orgId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Modules loaded:', data.length);
  console.log('Module names:', data.map(m => m.name));
})
.catch(error => {
  console.error('Error loading modules:', error);
});
