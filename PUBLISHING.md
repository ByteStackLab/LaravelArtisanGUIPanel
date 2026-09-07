# Laravel Artisan GUI — Publish Guide (Step by Step)

> **Extension:** Laravel Artisan GUI
> **Publisher ID:** `bytestacklab` (same publisher as ByteStackLab Material Theme — reused, not new)
> **Microsoft Account:** mokammeltanvir@outlook.com
> **Last updated:** September 2026

এই extension একই `bytestacklab` publisher-এর নিচে যাবে, তাই Azure DevOps org, PAT, এবং Marketplace
publisher — এগুলো **আগে থেকেই আছে** (ByteStackLab Material Theme থেকে)। নতুন করে বানাতে হবে না।

---

## বর্তমান অবস্থা (কী কী Ready)

- ✅ GitHub repo push হয়ে গেছে: https://github.com/ByteStackLab/LaravelArtisanToolkit
- ✅ `package.json` — publisher, repository, license, icon, keywords সব সেট করা
- ✅ Marketplace icon (`media/icon.png`, 512x512)
- ✅ README, CHANGELOG, LICENSE, `.vscodeignore`
- ✅ `.vsix` build + local package test করা (`laravel-artisan-gui-1.0.0.vsix`)
- ✅ Azure PAT + Marketplace publisher (`bytestacklab`) — reused from Material Theme, এখনো valid
- ⬜ **এই নতুন repo-তে `VSCE_PAT` আর `OVSX_TOKEN` secret যোগ করা** (secrets repo-specific, একটা repo-তে
  add করলে অন্য repo-তে automatically যায় না)
- ⬜ Open VSX namespace-এ এই extension প্রথমবার publish করা (namespace `bytestacklab` আগে থেকেই claimed)
- ⬜ Publish!

---

## Step 1: এই Repo-তে GitHub Secrets যোগ করুন (একবারই)

Material Theme-এর জন্য যে PAT token গুলো বানিয়েছিলেন, সেগুলোই এখানে reuse করা যাবে — নতুন করে বানাতে
হবে না, শুধু এই repo-তে secret হিসেবে add করতে হবে (GitHub secret value একবার set করলে আর পড়া যায় না,
তাই এক repo থেকে অন্য repo-তে copy করার কোনো automatic উপায় নেই):

1. https://github.com/ByteStackLab/LaravelArtisanToolkit/settings/secrets/actions এ যান
2. **New repository secret** → Name: `VSCE_PAT` → Value: Material Theme-এর জন্য যে Azure PAT token
   password manager-এ রেখেছিলেন সেটা paste করুন
3. আবার **New repository secret** → Name: `OVSX_TOKEN` → Value: Open VSX token paste করুন
4. Token যদি হারিয়ে ফেলে থাকেন বা expire হয়ে যায়, নিচের ট্রাবলশুটিং সেকশনে regenerate করার steps আছে

> Terminal থেকেও করা যায় (`gh` CLI login করা আছে এই মেশিনে):
> ```bash
> gh secret set VSCE_PAT --repo ByteStackLab/LaravelArtisanToolkit
> gh secret set OVSX_TOKEN --repo ByteStackLab/LaravelArtisanToolkit
> ```
> কমান্ড চালালে terminal-এ paste করতে বলবে — token সরাসরি টাইপ/paste করবেন, কোনো chat/message-এ না।

---

## Step 2: Local থেকে প্রথমবার Publish (দ্রুততম রাস্তা)

CI setup না করেও চাইলে নিজের terminal থেকেই সরাসরি publish করা যায়:

```bash
cd ~/LaravelArtisanToolkit

# Login — Azure PAT চাইবে (Material Theme-এরটাই কাজ করবে)
npx vsce login bytestacklab

# Publish!
npx vsce publish
```

Success হলে ৫-১০ মিনিটের মধ্যে live:

```
https://marketplace.visualstudio.com/items?itemName=bytestacklab.laravel-artisan-gui
```

Open VSX-এ প্রথমবার publish (VSCodium/Cursor/Gitpod ইউজারদের জন্য):

```bash
npx ovsx publish -p <OVSX_TOKEN>
```

### Publish হওয়ার পর Check করুন

1. Marketplace link খুলে দেখুন — icon, README, description ঠিক দেখাচ্ছে কিনা
2. VS Code Extensions panel এ "Laravel Artisan GUI" search করে দেখুন
3. Local `.vsix` uninstall করে marketplace থেকে install করুন:
   ```bash
   code --uninstall-extension bytestacklab.laravel-artisan-gui
   code --install-extension bytestacklab.laravel-artisan-gui
   ```

---

## Step 3: এরপর থেকে — CI দিয়ে Auto-Publish

`.github/workflows/publish.yml` already তৈরি করা আছে (Material Theme-এরটার মতোই) — Step 1-এর secret
দুটো add করা থাকলে, এই flow দিয়ে future update গুলো automatic হয়ে যাবে:

```bash
# 1. package.json এ version বাড়ান (যেমন 1.0.0 → 1.0.1)
# 2. CHANGELOG.md এ নতুন version এর entry যোগ করুন
git add package.json CHANGELOG.md
git commit -m "release: v1.0.1"
git push origin main
```

এই push এই Marketplace, Open VSX, আর GitHub Release তিনটাই automatically হয়ে যাবে। Progress দেখতে:
repo এর **Actions** tab। Version না বাড়ালে workflow skip করে যাবে ("Tag already exists"), তাই বারবার
push করলেও duplicate publish হবে না।

---

## Troubleshooting

| সমস্যা | সমাধান |
|---|---|
| `401/403 Unauthorized` publish এ | PAT expire হয়ে গেছে বা scope ঠিক নেই — নতুন PAT বানান (Azure DevOps → User settings → Personal Access Tokens, Organization: **All accessible organizations**, Scope: Marketplace → Manage) |
| `Publisher not found` | Publisher ID আর `package.json` এর `publisher` (`bytestacklab`) match করছে না |
| CI তে `VSCE_PAT` না পাওয়ার error | Step 1 এর secret এই repo-তে (Material Theme repo-তে না) add করা হয়েছে কিনা check করুন |
| README এর কিছু দেখাচ্ছে না | GitHub repo public আছে কিনা, push হয়েছে কিনা check করুন |
| `vsce: command not found` | এই repo-তে devDependency হিসেবেই আছে, `npx vsce` দিয়ে চালান (আলাদা global install লাগবে না) |
| Marketplace এ extension আসছে না | ৫-১০ মিনিট অপেক্ষা করুন, manage page এ status দেখুন: https://marketplace.visualstudio.com/manage/publishers/bytestacklab |

---

*ByteStackLab · September 2026*
