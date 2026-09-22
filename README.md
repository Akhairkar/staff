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

1. GitHub par naya repo banao, jaise `employee-master`.
2. Is poore folder ko us repo me push karo:
   ```
   git init
   git add .
   git commit -m "Employee master phase 1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/employee-master.git
   git push -u origin main
   ```

## GitHub Pages par deploy (free hosting)

1. `vite.config.js` me `base: "/employee-master/"` already set hai — agar repo
   ka naam alag rakha hai to yahi naam wahan bhi daalo.
2. Build karo:
   ```
   npm run build
   ```
   Isse `dist/` folder banega.
3. `dist/` ko `gh-pages` branch par publish karo (easiest tareeka):
   ```
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```
4. Repo Settings → Pages me source `gh-pages` branch select karo. Kuch minute
   me site `https://<your-username>.github.io/employee-master/` par live ho
   jayegi.

(Vercel ya Netlify pe deploy karna ho to bas repo import karo — dono Vite
projects ko automatically detect kar lete hain, `base` ko `/` rakhna hoga
vite.config.js me us case me.)

## Aage kya (Phase 2+)

- Attendance / leave / week-off tracking
- Salary, PF, ESIC, overtime calculation engine
- Month-end PDF payslip aur company-wise PF/ESIC challan report
- Supabase se connect karke data permanent karna, aur login roles (Admin vs
  company HR)
