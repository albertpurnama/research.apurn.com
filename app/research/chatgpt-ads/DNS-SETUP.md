# 🌐 DNS Setup for research.apurn.com

## Quick Reference

After deploying to Railway, you'll need to add this DNS record:

### CNAME Record

```
Type:  CNAME
Name:  research
Value: [your-project-name].up.railway.app
TTL:   Auto (or 3600)
```

**You'll get the exact `Value` from Railway dashboard after deploying.**

---

## Step-by-Step DNS Setup

### 1. Deploy to Railway First

```bash
railway link
railway up
```

### 2. Get Your Railway URL

```bash
railway status
```

Look for something like:
```
URL: https://chatgpt-ads-research-production.up.railway.app
```

The domain is: `chatgpt-ads-research-production.up.railway.app`

### 3. Add Custom Domain in Railway

#### Via Dashboard:
1. Go to https://railway.app
2. Open your project
3. Settings → Domains
4. Click **+ Custom Domain**
5. Enter: `research.apurn.com`

Railway will show you the exact DNS settings needed.

#### Via CLI:
```bash
railway domain research.apurn.com
```

### 4. Update DNS (Choose your provider)

---

## DNS Provider: Cloudflare (Most Common)

If `apurn.com` is on Cloudflare:

1. Go to https://dash.cloudflare.com
2. Select **apurn.com** domain
3. Click **DNS** tab
4. Click **Add record**

**Settings:**
```
Type:    CNAME
Name:    research
Target:  chatgpt-ads-research-production.up.railway.app
Proxy:   DNS only (gray cloud) ← IMPORTANT!
TTL:     Auto
```

**⚠️ Important:** Turn OFF Cloudflare proxy (gray cloud, not orange)
- Railway needs direct DNS access for HTTPS

5. Click **Save**

---

## DNS Provider: Namecheap

If `apurn.com` is on Namecheap:

1. Go to https://ap.www.namecheap.com
2. Domain List → Manage (next to apurn.com)
3. Advanced DNS tab
4. Add New Record

**Settings:**
```
Type:    CNAME Record
Host:    research
Value:   chatgpt-ads-research-production.up.railway.app
TTL:     Automatic
```

5. Save

---

## DNS Provider: GoDaddy

If `apurn.com` is on GoDaddy:

1. Go to https://dcc.godaddy.com
2. My Products → DNS
3. Click apurn.com
4. Add record

**Settings:**
```
Type:    CNAME
Name:    research
Value:   chatgpt-ads-research-production.up.railway.app
TTL:     1 hour
```

5. Save

---

## DNS Provider: Vercel/Other

If `apurn.com` is managed elsewhere:

**Generic CNAME record:**
```
research.apurn.com → [your-railway-url].up.railway.app
```

Add this wherever your DNS is managed.

---

## Verify DNS Propagation

### Check if DNS is working:

```bash
# Check CNAME
dig research.apurn.com CNAME

# Should show:
# research.apurn.com. 3600 IN CNAME chatgpt-ads-research-production.up.railway.app.
```

### Check from multiple locations:

Go to: https://www.whatsmydns.net

- Enter: `research.apurn.com`
- Type: `CNAME`

Should show your Railway URL globally.

---

## Timeline

| Step | Time |
|------|------|
| Add DNS record | 1 minute |
| DNS propagation starts | Immediate |
| Propagation complete | 5-60 minutes |
| HTTPS certificate | 1-5 minutes after DNS |

**Total:** Usually 10-60 minutes, max 24 hours

---

## Testing

### 1. Test Railway URL (should work immediately)

```bash
railway open
```

Or visit directly:
```
https://chatgpt-ads-research-production.up.railway.app
```

### 2. Test custom domain (after DNS propagates)

```bash
open https://research.apurn.com
```

If it doesn't work yet:
- **Wait 5-10 minutes** for DNS
- **Clear browser cache** (Cmd+Shift+R)
- **Check DNS:** `dig research.apurn.com`

---

## HTTPS Certificate

Railway automatically provisions HTTPS certificates via Let's Encrypt.

**This happens automatically after DNS propagates.**

Usually takes 1-5 minutes after DNS is working.

---

## Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"

**Issue:** DNS not propagated yet

**Fix:**
1. Wait 10-30 more minutes
2. Check DNS with `dig research.apurn.com`
3. Verify you added the CNAME correctly

### "This site can't provide a secure connection"

**Issue:** HTTPS certificate not provisioned yet

**Fix:**
1. Wait 5 more minutes
2. Make sure DNS is pointing to Railway
3. Try `http://research.apurn.com` (Railway will redirect to HTTPS)

### Cloudflare proxy issues

**Issue:** Orange cloud is ON in Cloudflare

**Fix:**
1. Click the orange cloud → Turn it gray
2. Railway needs direct DNS access
3. Wait 5 minutes and try again

### Works on Railway URL but not custom domain

**Issue:** DNS not configured correctly

**Fix:**
1. Check Railway dashboard → Domains → Should show "Active"
2. Verify CNAME record points to correct Railway URL
3. Run `dig research.apurn.com` to verify

---

## Quick DNS Checklist

- [ ] Deployed to Railway (`railway up`)
- [ ] Got Railway URL from `railway status`
- [ ] Added custom domain in Railway dashboard
- [ ] Added CNAME record in DNS provider
- [ ] CNAME points to: `[your-project].up.railway.app`
- [ ] If Cloudflare: Proxy is OFF (gray cloud)
- [ ] Waited 10-60 minutes for DNS propagation
- [ ] Verified with `dig research.apurn.com`
- [ ] Tested `https://research.apurn.com`
- [ ] HTTPS certificate auto-provisioned ✅

---

## Final Result

After setup completes, you'll have:

✅ **Primary URL:** `https://research.apurn.com` (what you share)
✅ **Backup URL:** `https://[project].up.railway.app` (always works)
✅ **HTTPS:** Automatic (Let's Encrypt)
✅ **Mobile-optimized:** Perfect for phone reading
✅ **Auto-updates:** Just `railway up` to deploy changes

---

## Example: Complete DNS Record

Here's what your DNS should look like:

```
apurn.com DNS Records:

@ (root)          A       76.76.21.21           (your main site)
www               CNAME   apurn.com
research          CNAME   chatgpt-ads-research-production.up.railway.app  ← NEW!
```

---

**Ready to set up DNS! After `railway up` completes, follow this guide to add your custom domain.** 🚀
