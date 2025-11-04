// Zitadel Configuration
// Copy these values to your .env.local file

export const ZITADEL_CONFIG = {
  // Zitadel Instance URL (use HTTP for local development)
  instanceUrl: 'http://localhost:8080',
  
  // Zitadel OAuth Application Client ID
  clientId: '344501045671493635',
  
  // Redirect URI (must match what's configured in Zitadel)
  redirectUri: 'http://localhost:5175/pm-auth',

  // Silent Redirect URI
  silentRedirectUri: 'http://localhost:5175/pm-silent-auth',

  // Auth Audience (add your audience value here)
  auth_audience: '344501045671493635',

  // Auth Client ID (add your client id here, like netbird)
  auth_client_id: 'your_auth_client_id_here',
  
  // Post Logout Redirect URI
  postLogoutRedirectUri: 'http://localhost:5175/',
  
  // Scopes
  scopes: 'openid email profile offline_access',
};

// Instructions:
// 1. Create a .env.local file in the root of your project
// 2. Add the following variables:
//    ZITADEL_INSTANCE_URL=http://localhost:8080
//    ZITADEL_CLIENT_ID=your_actual_client_id
//    ZITADEL_REDIRECT_URI=http://localhost:5173/auth/callback
//    ZITADEL_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
// 3. Replace 'your_actual_client_id' with your Zitadel OAuth application client ID
