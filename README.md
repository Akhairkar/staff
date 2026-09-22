# Employee Register — Phase 1

Employee master module: add/edit/delete employees, photo upload, company-wise
filter (Company A/B/C), aur salary daalte hi PF/ESIC eligibility auto-tag.

Data abhi sirf browser session me hai (React state) — refresh karte hi reset ho
jayega. Isko permanent banane ke liye Supabase connect karna hoga (README ke
end me note hai).

## Local me chalane ke liye

```
npm install
npm run dev
```

Browser me `http://localhost:5173` khul jayega.

## GitHub par upload

Repo ka naam **`staff`** rakhna hai — `vite.config.js` me `base: "/staff/"`
isi naam se match hone ke liye set hai. Agar repo ka naam badla to yahan
bhi badalna padega.

```
git init
git add .
git commit -m "Employee master phase 1"
git branch -M main
git remote add origin https://github.com/<your-username>/staff.git
git push -u origin main
```

## GitHub Pages par deploy (automatic, GitHub Actions se)

Is zip me `.github/workflows/deploy.yml` already included hai — push karte
hi GitHub khud build karke deploy kar dega, `npm install` kahin bhi manually
nahi chalana padega.

1. Code push karne ke baad, repo → **Settings → Pages** → Source me
   **"GitHub Actions"** select karo (branch wala option nahi).
2. Repo → **Actions** tab me build automatically chalega — 1-2 min me green
   tick aa jayega.
3. Site live ho jayegi: `https://<your-username>.github.io/staff/`

(Vercel ya Netlify pe deploy karna ho to bas repo import karo — dono Vite
projects ko automatically detect kar lete hain, `base` ko `/` rakhna hoga
vite.config.js me us case me.)

## Aage kya (Phase 2+)

- Attendance / leave / week-off tracking
- Salary, PF, ESIC, overtime calculation engine
- Month-end PDF payslip aur company-wise PF/ESIC challan report
- Supabase se connect karke data permanent karna, aur login roles (Admin vs
  company HR)
