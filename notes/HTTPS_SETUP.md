# HTTPS Setup Guide for PrivyMesh Frontend

The frontend requires HTTPS because `crypto.subtle` API (used for PKCE) only works in secure contexts.

## Option 1: Using nginx-proxy with Let's Encrypt (Recommended - Easiest)

This automatically handles SSL certificates and HTTPS.

### Step 1: Set up nginx-proxy

```bash
# Create a network for nginx-proxy
docker network create nginx-proxy

# Run nginx-proxy with Let's Encrypt
docker run -d \
  --name nginx-proxy \
  --restart=always \
  -p 80:80 \
  -p 443:443 \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  -v certs:/etc/nginx/certs \
  -v vhost:/etc/nginx/vhost.d \
  -v html:/usr/share/nginx/html \
  --network nginx-proxy \
  jwilder/nginx-proxy

# Run Let's Encrypt companion
docker run -d \
  --name nginx-proxy-letsencrypt \
  --restart=always \
  --volumes-from nginx-proxy \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --network nginx-proxy \
  jrcs/letsencrypt-nginx-proxy-companion
```

### Step 2: Update docker-compose.yml

Your `docker-compose.yml` is already configured with the necessary labels. Just make sure:

1. **You have a domain name** (not just IP address) - Let's Encrypt requires a domain
2. **Set the environment variables** in your `.env` file:

```bash
VIRTUAL_HOST=yourdomain.com
LETSENCRYPT_HOST=yourdomain.com
LETSENCRYPT_EMAIL=your-email@example.com
```

### Step 3: Update your Zitadel redirect URIs

In your Zitadel application settings, update redirect URIs to use HTTPS:
- `https://yourdomain.com/pm-auth`
- `https://yourdomain.com/slient-pm-auth`
- `https://yourdomain.com/`

### Step 4: Run your frontend

```bash
docker-compose up -d
```

nginx-proxy will automatically:
- Detect your container
- Request SSL certificate from Let's Encrypt
- Configure HTTPS
- Redirect HTTP to HTTPS

---

## Option 2: Manual nginx Reverse Proxy with Let's Encrypt

If you prefer manual control or don't want to use nginx-proxy.

### Step 1: Install Certbot

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# On CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Step 2: Get SSL Certificate

```bash
# Stop your frontend container first
docker-compose down

# Get certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Step 3: Create nginx configuration

Create `/etc/nginx/sites-available/privymesh`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 4: Enable site and restart nginx

```bash
sudo ln -s /etc/nginx/sites-available/privymesh /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Update docker-compose.yml

Change ports back to expose only:

```yaml
ports:
  - "127.0.0.1:80:80"  # Only accessible from localhost (nginx will proxy)
```

### Step 6: Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab (runs twice daily)
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet
```

---

## Option 3: Using Cloudflare (Quick Fix)

If you have a domain, you can use Cloudflare's free SSL:

1. **Point your domain to Cloudflare** (update DNS)
2. **Enable Cloudflare SSL** (Full or Full Strict mode)
3. **Update docker-compose.yml** to expose port 80 only
4. **Cloudflare will handle HTTPS** automatically

Then update your environment variables:
```bash
ZITADEL_REDIRECT_URI=https://yourdomain.com/pm-auth
ZITADEL_SILENT_REDIRECT_URI=https://yourdomain.com/slient-pm-auth
```

---

## Option 4: Self-Signed Certificate (Development Only)

⚠️ **Warning**: This will show browser warnings. Only for testing!

### Step 1: Generate self-signed certificate

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/CN=128.199.212.147"
```

### Step 2: Update Dockerfile to support HTTPS

Modify the nginx config in Dockerfile to listen on 443 and use the certificates.

---

## Important Notes

1. **Domain Required**: Let's Encrypt requires a domain name, not just an IP address
2. **Update Zitadel**: Make sure your Zitadel application redirect URIs use HTTPS
3. **Environment Variables**: All redirect URIs must use `https://` not `http://`
4. **Port 443**: Make sure port 443 is open in your firewall

---

## Troubleshooting

### Certificate not working
- Check domain DNS is pointing to your server
- Verify port 80 and 443 are open
- Check nginx logs: `docker logs nginx-proxy`

### Still getting crypto.subtle error
- Verify you're accessing via HTTPS (check browser URL bar)
- Check browser console for mixed content warnings
- Ensure all redirect URIs use HTTPS

### nginx-proxy not detecting container
- Check container is on the same network: `docker network connect nginx-proxy privymesh-frontend`
- Verify environment variables are set correctly
- Check nginx-proxy logs: `docker logs nginx-proxy`

