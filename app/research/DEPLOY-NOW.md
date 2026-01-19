# 🚀 Deploy to research.apurn.com NOW

## Quick Commands (Copy-Paste)

### Step 1: Link to Railway
```bash
railway link
```

**When prompted, select:**
- ✅ **Personal account** (Albert Putra Purnama)
- ✅ **Create new project**
- ✅ **Name:** `ucp-research` (or press enter)

### Step 2: Deploy
```bash
railway up
```

Wait 2-3 minutes for build to complete.

### Step 3: Get Your URL
```bash
railway open
```

Or check status:
```bash
railway status
```

You'll see: `https://ucp-research-production.up.railway.app`

**Test this URL first!** ✅

---

## Step 4: Add Custom Domain

### Via CLI (Easiest):
```bash
railway domain research.apurn.com
```

### Via Dashboard:
1. Go to https://railway.app
2. Click **ucp-research** project
3. **Settings** → **Domains** → **+ Custom Domain**
4. Enter: `research.apurn.com`
5. Click **Add Domain**

Railway will show you the DNS settings.

---

## Step 5: Update DNS

Go to where `apurn.com` DNS is hosted (Cloudflare/Namecheap/etc.) and add:

```
Type:  CNAME
Name:  research
Value: ucp-research-production.up.railway.app
TTL:   Auto
```

**If using Cloudflare:**
- ⚠️ Make sure proxy is **OFF** (gray cloud, not orange)

**Wait 10-60 minutes for DNS propagation**

---

## Step 6: Verify

```bash
# Check DNS
dig research.apurn.com

# Open site
open https://research.apurn.com
```

---

## ✅ That's It!

Your site will be live at:
- ✅ **Primary:** https://research.apurn.com
- ✅ **Backup:** https://ucp-research-production.up.railway.app

---

## 🔄 To Update Later

Made changes? Just run:
```bash
railway up
```

---

## 📊 What You're Deploying

The mobile reader now shows **ALL** your research:

### Category 1: ChatGPT Ads 💰
- Research Report (47 pages)
- Market Opportunity ($25B analysis)
- Product Archetypes (5 products)
- Strategic Plan (Prompting Company)
- Paid GEO Deep Dive (complete spec)

### Category 2: Commerce Protocols 🔗
- Summary (protocol overview)
- Protocols Comparison (UCP, AP2, ACP, x402)
- Testable Flows
- UCP Product Archetypes

---

## 📱 Features

- ✅ **Two-tier navigation:** Categories + Documents
- ✅ **Mobile-optimized:** Swipe between docs
- ✅ **Progress indicator:** Know where you are
- ✅ **Remembers position:** Picks up where you left off
- ✅ **Dark mode:** Auto-detects system preference
- ✅ **Keyboard nav:** Arrow keys on desktop

---

## 🐛 Troubleshooting

### "No project linked"
Run: `railway link` first

### Build fails
Check logs: `railway logs`

### Custom domain not working
1. Wait 30-60 minutes for DNS
2. Check DNS: `dig research.apurn.com`
3. Verify CNAME points to Railway

### Site works but markdown not loading
1. Check browser console (F12)
2. Make sure all .md files are in correct folders
3. Verify file paths in index.html

---

## 🎯 Ready to Deploy?

Just run these 2 commands:

```bash
railway link
railway up
```

Then add custom domain and update DNS. Done! 🎉

---

**Your research hub is ready to go live!**
