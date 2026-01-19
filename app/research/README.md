# Universal Commerce Protocol Research Hub

Mobile-optimized research documentation for commerce protocols and ChatGPT ads analysis.

## 🚀 Quick Deploy to Railway

### Prerequisites
- Bun installed
- Railway CLI installed: `curl -fsSL https://railway.app/install.sh | sh`
- Logged into Railway: `railway login`

### Deploy

```bash
# Install dependencies
bun install

# Link to Railway (choose personal account)
railway link

# Deploy
railway up
```

### Add Custom Domain

```bash
# Via CLI
railway domain research.apurn.com

# Or via dashboard
# https://railway.app → Your Project → Settings → Domains
```

## 📚 Documentation Structure

### ChatGPT Ads Research
- Comprehensive research report
- Market opportunity analysis ($25B)
- Product archetypes
- Strategic plan for Prompting Company
- Paid GEO deep dive

### Commerce Protocols (UCP, AP2, ACP, x402)
- Protocol summary
- Detailed comparison
- Testable flows
- Product archetypes

## 🌐 Live Site

After deployment:
- **Railway URL:** https://[your-project].up.railway.app
- **Custom Domain:** https://research.apurn.com

## 🔄 Updates

Made changes? Just redeploy:

```bash
railway up
```

## 📱 Features

- ✅ Mobile-optimized reading experience
- ✅ Organized by categories
- ✅ Swipe navigation (mobile)
- ✅ Keyboard shortcuts (desktop)
- ✅ Dark mode support
- ✅ Progress indicator
- ✅ Remembers your position

## 🛠️ Local Development

```bash
bun install
bun run dev

# Open http://localhost:3000
```

## 📊 Tech Stack

- **Frontend:** Vanilla JS + Marked.js (markdown parser)
- **Backend:** Bun + serve (static file server)
- **Hosting:** Railway
- **Domain:** research.apurn.com

## 📂 Project Structure

```
.
├── index.html                    ← Main mobile reader
├── chatgpt-ads/                 ← ChatGPT ads research
│   ├── comprehensive-research-report.md
│   ├── market-opportunity-synthesis.md
│   ├── product-archetypes-aligned.md
│   ├── prompting-company-strategic-opportunities.md
│   └── paid-geo-deep-dive.md
├── ucp-ap2-acp-x402/           ← Commerce protocols research
│   ├── SUMMARY.md
│   ├── commerce-protocols-comparison.md
│   ├── TESTABLE-FLOWS.md
│   └── UCP-PRODUCT-ARCHETYPES.md
├── package.json
├── railway.json
└── nixpacks.toml

```

## 🎯 Navigation

- **Categories:** ChatGPT Ads | Commerce Protocols
- **Documents:** Organized tabs within each category
- **Swipe:** Left/right to navigate docs (mobile)
- **Keyboard:** Arrow keys to navigate (desktop)
- **Bottom Nav:** Previous/Next buttons

## 📞 Support

For issues or questions:
- Railway: https://railway.app/help
- This repo: [Add your repo URL]

---

**Last Updated:** January 2026
**Status:** Ready for deployment ✅
