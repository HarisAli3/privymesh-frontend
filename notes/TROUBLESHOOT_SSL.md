# Troubleshooting SSL Certificate Issues

## Error: ERR_SSL_UNRECOGNIZED_NAME_ALERT

This error means the SSL certificate doesn't match the domain name or hasn't been issued yet.

## Step 1: Check Let's Encrypt Logs

```bash
docker logs nginx-proxy-letsencrypt
```

Look for:
- Certificate generation attempts
- Errors about domain validation
- DNS verification issues

## Step 2: Verify DNS is Correct

```bash
# Check if DNS points to your server
dig privymesh.com
# or
nslookup privymesh.com
```

The A record should point to your VPS IP address (128.199.212.147).

## Step 3: Check if Certificate Exists

```bash
# Check if certificate was generated
docker exec nginx-proxy ls -la /etc/nginx/certs/

# Should see privymesh.com.crt and privymesh.com.key
```

## Step 4: Test HTTP First (Temporarily)

To verify the site works without SSL:

1. **Access via HTTP**: `http://privymesh.com` (should work)
2. **Check nginx-proxy config**: 
   ```bash
   docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf
   ```

## Step 5: Check nginx-proxy Detected Your Container

```bash
# Check nginx-proxy logs
docker logs nginx-proxy | grep -i privymesh

# Should see something like:
# "Generating nginx config for privymesh.com"
```

## Step 6: Verify Container Environment Variables

```bash
# Check if environment variables are set correctly
docker exec privymesh-frontend env | grep -E "VIRTUAL_HOST|LETSENCRYPT"

# Should show:
# VIRTUAL_HOST=privymesh.com
# LETSENCRYPT_HOST=privymesh.com
# LETSENCRYPT_EMAIL=harisali3@gmail.com
```

## Step 7: Check Container Network

```bash
# Verify container is on nginx-proxy network
docker inspect privymesh-frontend | grep -A 10 Networks

# Should show nginx-proxy network
```

## Common Issues and Solutions

### Issue 1: Certificate Not Generated Yet

**Solution**: Wait a few minutes. Let's Encrypt can take 1-5 minutes to generate certificates.

**Check**:
```bash
docker logs nginx-proxy-letsencrypt | tail -20
```

### Issue 2: DNS Not Pointing to Server

**Solution**: Update your DNS A record to point to 128.199.212.147

**Verify**:
```bash
dig privymesh.com +short
# Should return: 128.199.212.147
```

### Issue 3: Port 80 Not Accessible

Let's Encrypt needs port 80 to be accessible for domain validation.

**Check**:
```bash
# From another machine
curl -I http://privymesh.com

# Should return HTTP 200 or 301
```

**Fix**: Make sure port 80 is open in your firewall:
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Issue 4: Certificate Generation Failed

**Check logs**:
```bash
docker logs nginx-proxy-letsencrypt 2>&1 | grep -i error
```

**Common errors**:
- "Domain not found" - DNS not configured
- "Connection refused" - Port 80 blocked
- "Rate limit" - Too many certificate requests (wait 1 hour)

### Issue 5: Wrong Domain in Certificate

**Solution**: Remove old certificate and regenerate:
```bash
# Remove old certificate
docker exec nginx-proxy rm -f /etc/nginx/certs/privymesh.com.*

# Restart containers
docker restart nginx-proxy-letsencrypt
docker restart privymesh-frontend
```

## Manual Certificate Generation

If automatic generation fails, you can manually trigger it:

```bash
# Restart Let's Encrypt companion
docker restart nginx-proxy-letsencrypt

# Restart frontend container
docker restart privymesh-frontend

# Watch logs
docker logs -f nginx-proxy-letsencrypt
```

## Temporary Workaround: Use HTTP

If you need to test immediately, you can temporarily access via HTTP:

1. **Update Zitadel redirect URIs** to use HTTP (for testing only):
   - `http://privymesh.com/pm-auth`
   - `http://privymesh.com/slient-pm-auth`
   - `http://privymesh.com/`

2. **Access site**: `http://privymesh.com`

⚠️ **Warning**: This won't work for production because `crypto.subtle` requires HTTPS. This is only for testing.

## Verify Everything is Working

Once certificate is generated:

1. **Check certificate**:
   ```bash
   docker exec nginx-proxy ls -la /etc/nginx/certs/privymesh.com.*
   ```

2. **Test HTTPS**:
   ```bash
   curl -I https://privymesh.com
   # Should return HTTP 200
   ```

3. **Check browser**: Access `https://privymesh.com` - should work without errors

## Still Not Working?

1. **Check all logs**:
   ```bash
   docker logs nginx-proxy
   docker logs nginx-proxy-letsencrypt
   docker logs privymesh-frontend
   ```

2. **Verify DNS propagation**:
   ```bash
   # From multiple locations
   dig privymesh.com @8.8.8.8
   dig privymesh.com @1.1.1.1
   ```

3. **Test HTTP access**:
   ```bash
   curl http://privymesh.com
   # Should return HTML content
   ```

4. **Check firewall**:
   ```bash
   sudo ufw status
   # or
   sudo iptables -L -n
   ```

