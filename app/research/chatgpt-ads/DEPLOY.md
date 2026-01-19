# 🚀 Deploy to Railway with Bun

## Quick Deploy (3 Steps)

### 1. Install dependencies with Bun

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/chatgpt-ads
bun install
```

### 2. Initialize Railway project (first time only)

```bash
railway init
```

You'll be asked:
- **Project name:** `chatgpt-ads-research` (or whatever you want)
- **Environment:** `production`

### 3. Deploy!

```bash
railway up
```

That's it! Railway will:
- ✅ Detect Bun (via nixpacks.toml)
- ✅ Run `bun install`
- ✅ Start with `bun run start`
- ✅ Give you a live URL

---

## 🌐 Get Your URL

After deployment:

```bash
railway open
```

This will open your live site in browser!

Or get the URL:

```bash
railway status
```

Look for the domain (e.g., `https://chatgpt-ads-research-production.up.railway.app`)

---

## 🔄 Update/Redeploy

Made changes? Just run:

```bash
railway up
```

Railway will rebuild and redeploy automatically.

---

## 🎨 Add Custom Domain

1. Go to Railway dashboard: https://railway.app
2. Click your project
3. Go to **Settings** → **Domains**
4. Click **+ Custom Domain**
5. Enter: `research.promptingcompany.com`
6. Railway will show you DNS settings
7. Add CNAME record to your DNS:
   ```
   research.promptingcompany.com → your-project.up.railway.app
   ```

---

## 🧪 Test Locally First

```bash
bun install
bun run dev

# Open http://localhost:3000
```

Test on phone (same WiFi):
```bash
# Get your local IP
ipconfig getifaddr en0

# Open on phone: http://YOUR_IP:3000
```

---

## 📊 Monitor Deployment

Watch logs in real-time:

```bash
railway logs
```

Check deployment status:

```bash
railway status
```

---

## 🐛 Troubleshooting

### If deployment fails:

**Check logs:**
```bash
railway logs
```

**Common issues:**

1. **Bun not detected:**
   - Make sure `nixpacks.toml` exists
   - Commit and push again

2. **Port issues:**
   - Railway auto-assigns PORT via $PORT env var
   - Our start command handles this: `-p ${PORT:-3000}`

3. **Dependencies not installed:**
   ```bash
   bun install
   git add bun.lockb
   railway up
   ```

---

## 🎯 Your Files

Files created for Railway + Bun:

- ✅ `package.json` - Bun scripts
- ✅ `railway.json` - Railway config
- ✅ `nixpacks.toml` - Tells Railway to use Bun
- ✅ `bunfig.toml` - Bun configuration
- ✅ `.railwayignore` - Files to skip

---

## 🚀 Next Steps After Deploy

1. **Get URL:** `railway open`
2. **Test mobile:** Open URL on phone
3. **Share with team:** Send URL
4. **Add custom domain:** `research.promptingcompany.com`
5. **Set up auto-deploy:** Link GitHub repo (optional)

---

## 💡 Pro Tip: GitHub Integration

For auto-deploy on git push:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Add ChatGPT ads research site"
   git push
   ```

2. In Railway dashboard:
   - Settings → Connect Repo
   - Select your repo
   - Now every push auto-deploys!

---

## 📞 Need Help?

Railway docs: https://docs.railway.app
Bun docs: https://bun.sh/docs

Your project is ready to deploy! Just run:
```bash
bun install
railway up
```
