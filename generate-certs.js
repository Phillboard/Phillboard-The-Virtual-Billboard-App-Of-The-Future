
// generate-certs.js - Run this with Node.js to generate self-signed certificates
// For development only, not for production use

const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating self-signed certificates for HTTPS development...');

try {
  // Check if mkcert is installed
  try {
    execSync('mkcert -version', { stdio: 'ignore' });
    console.log('mkcert is installed, using it to generate certificates');
    
    // Generate certificates using mkcert
    execSync('mkcert -install', { stdio: 'inherit' });
    execSync('mkcert localhost 127.0.0.1 ::1', { stdio: 'inherit' });
    
    // Rename files to match what vite.config.ts expects
    fs.renameSync('localhost+2-key.pem', 'localhost-key.pem');
    fs.renameSync('localhost+2.pem', 'localhost.pem');
    
    console.log('Certificates generated successfully!');
    
  } catch (error) {
    console.log('mkcert not found, falling back to OpenSSL');
    
    // Generate certificates using OpenSSL
    execSync(`
      openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"
    `, { stdio: 'inherit' });
    
    console.log('Certificates generated successfully using OpenSSL!');
  }
  
  console.log('\nImportant: You will need to add these certificates to your trusted store.');
  console.log('For Chrome on Android, you may need to enable chrome://flags/#allow-insecure-localhost');
  console.log('\nStarting your dev server with HTTPS should now work!');
  
} catch (error) {
  console.error('Error generating certificates:', error);
  console.error('\nPlease install mkcert or OpenSSL, or manually generate certificates.');
  process.exit(1);
}
