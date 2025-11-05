// Copy and paste this ENTIRE code into browser console (F12 > Console)

// Get token from cookies
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('zitadel_token='))
  ?.split('=')[1];

if (token) {
  try {
    // Decode the token
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      
      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('✅ FOUND YOUR TOKEN AUDIENCE!');
      console.log('═══════════════════════════════════════════════════');
      console.log('');
      console.log('📋 Your Token Audience:', payload.aud);
      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('🔧 COPY THIS TO BACKEND .env FILE:');
      console.log('═══════════════════════════════════════════════════');
      console.log('');
      
      const audience = Array.isArray(payload.aud) ? payload.aud[0] : payload.aud;
      console.log('ZITADEL_AUDIENCE=' + audience);
      
      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('📍 File to edit:');
      console.log('E:\\New folder (6)\\FYP\\privymesh-backend\\.env');
      console.log('═══════════════════════════════════════════════════');
    } else {
      console.error('Invalid token format');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
} else {
  console.log('❌ Token not found. Make sure you are logged in.');
}

