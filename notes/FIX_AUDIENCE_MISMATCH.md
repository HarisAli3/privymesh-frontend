# Fix Audience Mismatch - Simple Instructions

## The Problem

Your backend logs show:
```
token has invalid audience
```

This means your token's audience doesn't match what the backend expects.

## The Solution

You need to **find what audience your token has** and **update the backend to use the same value**.

---

## Easiest Method: Check Token in Browser

### Step 1: Open Browser Console

1. Press **F12** to open Developer Tools
2. Click on the **Console** tab

### Step 2: Run This Code

**Copy and paste this entire code block into the console, then press Enter:**

```javascript
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
      
      console.log('✅ Found your token!');
      console.log('📋 Token Audience (aud):', payload.aud);
      console.log('📋 Token Issuer (iss):', payload.iss);
      console.log('📋 Full payload:', payload);
      
      // Show what to update
      if (payload.aud) {
        console.log('');
        console.log('════════════════════════════════════════');
        console.log('🔧 UPDATE BACKEND .env FILE:');
        console.log('════════════════════════════════════════');
        console.log('ZITADEL_AUDIENCE=' + (Array.isArray(payload.aud) ? payload.aud[0] : payload.aud));
        console.log('════════════════════════════════════════');
      }
    } else {
      console.error('Invalid token format');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
} else {
  console.log('❌ Token not found in cookies');
  console.log('💡 Make sure you are logged in');
}
```

### Step 3: Copy the Audience Value

After running the code, you'll see something like:
```
Token Audience (aud): 344631193884491779
```

**Copy that number!** (e.g., `344631193884491779`)

---

## Step 4: Update Backend Configuration

### Option A: Edit .env File Manually

1. **Open:** `E:\New folder (6)\FYP\privymesh-backend\.env`
2. **Find this line:**
   ```
   ZITADEL_AUDIENCE=344501045671493635
   ```
3. **Replace the number** with the one you copied from Step 3:
   ```
   ZITADEL_AUDIENCE=344631193884491779
   ```
   (Use YOUR number, not this example!)
4. **Save the file**

### Option B: Use Command Line

**Run this command** (replace `YOUR_AUDIENCE` with the number from Step 3):

```powershell
cd "E:\New folder (6)\FYP\privymesh-backend"
$audience = "YOUR_AUDIENCE_HERE"  # Paste your audience value here
(Get-Content .env) -replace 'ZITADEL_AUDIENCE=.*', "ZITADEL_AUDIENCE=$audience" | Set-Content .env
```

**Example:**
```powershell
cd "E:\New folder (6)\FYP\privymesh-backend"
$audience = "344631193884491779"
(Get-Content .env) -replace 'ZITADEL_AUDIENCE=.*', "ZITADEL_AUDIENCE=$audience" | Set-Content .env
```

---

## Step 5: Restart Backend

```powershell
cd "E:\New folder (6)\FYP\privymesh-backend"
docker-compose restart backend
```

**Or if running without Docker:**
- Stop the backend (Ctrl+C)
- Start it again

---

## Step 6: Test

1. **Refresh your browser** (F5 or Ctrl+R)
2. **Try using the dashboard** - it should work now!

---

## Verify It Worked

After restarting backend, check logs:

```powershell
docker logs privymesh-backend --tail 20
```

You should see:
```
Authenticated user: ID=..., Email=harisali.contact@gmail.com
```

Instead of:
```
token has invalid audience
```

---

## If You Still Have Issues

### Check Backend .env File

Run this to see current value:
```powershell
cd "E:\New folder (6)\FYP\privymesh-backend"
Get-Content .env | Select-String "AUDIENCE"
```

### Get Token Audience Again

If you need to check your token again, use the browser console code from Step 2.

### Check Both Values Match

1. **Token audience** (from browser console) = ?
2. **Backend ZITADEL_AUDIENCE** (from .env file) = ?

**They must be exactly the same!**

---

## Quick Summary

1. ✅ **F12** → Console → Paste code → Get audience number
2. ✅ **Edit** `privymesh-backend/.env` → Change `ZITADEL_AUDIENCE=...`
3. ✅ **Restart** backend: `docker-compose restart backend`
4. ✅ **Refresh** browser → Done!

