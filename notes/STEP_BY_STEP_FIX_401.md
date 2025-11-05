# Step-by-Step Fix for 401 Unauthorized Error

## What You Need To Do

Find your token's **audience** value and update the backend configuration to match it.

---

## Step 1: Check Backend Logs (Easiest Way)

The backend logs will tell you exactly what audience your token has!

**Run this command:**
```bash
cd "../privymesh-backend"
docker-compose logs backend | Select-String -Pattern "audience|Audience" -Context 2
```

**Or if using Docker directly:**
```bash
docker logs privymesh-backend | grep -i audience
```

**Look for lines like:**
```
Audience mismatch - Expected: 344501045671493635, Got: [344631193884491779]
Tip: Set ZITADEL_AUDIENCE to one of the token audiences: [344631193884491779]
```

**The number in "Got:" is your token's audience!** (e.g., `344631193884491779`)

---

## Step 2: Update Backend Configuration

**Edit the backend `.env` file:**

1. **Open:** `privymesh-backend/.env`
2. **Find the line:** `ZITADEL_AUDIENCE=344501045671493635`
3. **Replace it with:** The audience value from Step 1

**Example:**
```bash
# Before
ZITADEL_AUDIENCE=344501045671493635

# After (using the value from backend logs)
ZITADEL_AUDIENCE=344631193884491779
```

---

## Step 3: Restart Backend

```bash
cd "../privymesh-backend"
docker-compose restart backend
```

**Or if backend is running locally:**
- Stop it (Ctrl+C)
- Start it again

---

## Step 4: Test

1. **Refresh your browser** (F5)
2. **Try using the dashboard** - it should work now!

---

## Alternative: Get Token Audience from Browser

If you want to check the token directly:

### Method 1: Browser Console

1. **Open browser console** (Press F12)
2. **Go to Application/Storage tab**
3. **Look for:**
   - Cookies → `zitadel_token`
   - Or Local Storage → tokens
4. **Copy the token** (long string starting with `eyJ...`)

### Method 2: Use jwt.io

1. **Copy your token** (from Method 1)
2. **Go to:** https://jwt.io
3. **Paste token** in the left panel (Encoded)
4. **Look in the payload** (right panel) for `"aud"`:
   ```json
   {
     "aud": "344631193884491779",  ← This is your audience!
     "iss": "http://localhost:8080",
     ...
   }
   ```
5. **Copy the `aud` value**

### Method 3: Browser Console Code

**Paste this in browser console (F12 > Console tab):**

```javascript
// Get token from cookie
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('zitadel_token='))
  ?.split('=')[1];

if (token) {
  // Decode token (simple base64 decode)
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  console.log('Token Audience:', payload.aud);
  console.log('Token Issuer:', payload.iss);
  console.log('Full payload:', payload);
} else {
  console.log('Token not found in cookies');
}
```

This will print your token's audience directly in the console!

---

## Quick Check: What's Your Current Backend Audience?

**Check what backend is currently configured:**

```bash
# Windows PowerShell
cd "../privymesh-backend"
Get-Content .env | Select-String "AUDIENCE"
```

**You'll see something like:**
```
ZITADEL_AUDIENCE=344501045671493635
```

**Now compare this with what the backend logs say your token has!**

---

## Common Scenarios

### Scenario 1: Backend Logs Show This
```
Got: [344631193884491779]
```

**Fix:** Update backend `.env`:
```bash
ZITADEL_AUDIENCE=344631193884491779
```

### Scenario 2: Backend Logs Show Multiple Audiences
```
Got: [344631193884491779, 344501045671493635]
```

**Fix:** Use the first one (or any one from the list):
```bash
ZITADEL_AUDIENCE=344631193884491779
```

### Scenario 3: No Audience in Logs
If logs don't show audience mismatch, the issue might be:
- Token expired → Will auto-refresh now
- JWKS not loading → Check Zitadel is running
- Issuer mismatch → Check ZITADEL_INSTANCE_URL

---

## Summary

**Do this:**
1. ✅ Run: `docker-compose logs backend | grep audience`
2. ✅ Copy the audience value from the log
3. ✅ Paste it in `privymesh-backend/.env` as `ZITADEL_AUDIENCE=<value>`
4. ✅ Restart backend: `docker-compose restart backend`
5. ✅ Refresh browser

**That's it!**

