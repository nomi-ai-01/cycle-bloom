# Cycle Bloom — private period tracker PWA

## Assumptions and honest platform limits
- Cycle day 1 is the first day of bleeding. Cycle length is the calendar-day difference between two recorded period starts.
- Predictions use up to six recent valid cycles (15–60 days), then fall back to the chosen average.
- Dates, notes, symptoms, and settings are stored in local IndexedDB (localStorage fallback). There are no accounts, analytics, ad trackers, or cycle-data cloud sync.
- The app checks reminders when opened or foregrounded. Browsers do not reliably run a daily timer while a static site is closed. Background push requires a provider plus a secure server scheduler; this project does not claim background delivery is already enabled.
- The PIN is a convenience lock, not encryption. Exported JSON backups are unencrypted. Anyone with access to the unlocked device/browser profile may access local data.
- Google Fonts are loaded online and may not be available offline. Core app assets are cached by the service worker.

## File tree (v3)
```text
cycle-bloom-main/
├── index.html            (poori app: HTML + CSS + JS)
├── sw.js                 (offline cache + notification click)
├── manifest.webmanifest
├── favicon-48.png
├── icon-192.png
├── icon-512.png
├── icon-maskable-512.png
├── apple-touch-icon.png
└── README.md
```

## Run locally
1. Put all files in one folder.
2. Install Python 3 or Node.js.
3. Run `python -m http.server 8080` in this folder, or `npx serve .`.
4. Open the localhost URL. Do not open `index.html` as a `file://` URL; service workers and notifications need localhost or HTTPS.
5. Complete onboarding and test. Data is scoped to that browser origin.

## Deploy free with GitHub Pages
1. Create a GitHub repository, e.g. `cycle-bloom-pwa`.
2. Upload all files and folders, keeping `index.html` at the repository root.
3. Go to repository **Settings → Pages**.
4. Under Build and deployment choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
5. Wait for deployment and open the HTTPS URL shown by GitHub.
6. Open the app and complete onboarding. After changes, commit/push and wait for redeployment.
7. GitHub Pages only serves static files. It cannot run the optional Netlify function in this project.

## Netlify static hosting
1. Import this repository into Netlify.
2. Leave build command blank and use `.` as the publish directory.
3. Deploy. `netlify.toml` configures the optional function folder.

## Notifications
### Included reminder behavior
- Permission is requested only when the user opts in.
- When the app opens or returns to the foreground, it checks the selected time, predicted date and lead window, then displays one discreet notification per day if due.
- This is not a reliable background scheduler. If the app is fully closed, a daily reminder may not appear.

### iPhone (Safari, iOS/iPadOS 16.4+)
1. Open the deployed HTTPS URL in Safari.
2. Tap **Share → Add to Home Screen**.
3. Launch Cycle Bloom from the new Home Screen icon.
4. Turn on notifications in Settings and allow permission if prompted.
5. Test the reminder by setting a time a few minutes ahead and opening the app after that time.
6. Web Push on iPhone requires the installed Home Screen web app and notification permission. The foreground reminder code here does not provide background push.

### Android (Chrome)
1. Open the HTTPS URL in Chrome.
2. Tap **Install this app** if offered, or Chrome menu → Install app / Add to Home screen.
3. Enable notifications and grant permission.
4. Test foreground reminders by setting a time a few minutes ahead and opening the app after it passes.
5. Background push requires the optional provider and server-side scheduler.

### Optional OneSignal background push: setup outline
Background Web Push requires a provider account and a server-side function. A public static client cannot safely store a provider REST key. OneSignal's product steps and free-plan limits can change, so verify its current official documentation before enabling.

1. Create a Web Push app in OneSignal and configure the site origin and service worker according to its current guide.
2. For Netlify hosting only, set `ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY` in Netlify environment variables. Never commit the REST key.
3. `netlify/functions/send-reminder.mjs` is a one-shot API example. It accepts only an opaque provider subscription ID and future send timestamp; its notification body is generic and contains no cycle date, phase, symptoms, or notes.
4. It is intentionally **not wired into the frontend** and is not a production recurring scheduler. Before exposing it, add consent UX, subscription registration, authentication/ownership checks, rate limiting, cancellation/refresh logic on period logging, and a server-side recurring schedule. Otherwise a stale reminder could still be sent after a user logs a period.
5. GitHub Pages cannot run this function. Use Netlify or another trusted serverless host for background push.

## Date and privacy notes
- Dates are stored as local `YYYY-MM-DD` strings to avoid UTC date shifts.
- Importing a JSON backup replaces current local data after confirmation. Exported files are unencrypted; keep them private.
- The service worker caches same-origin GET app files only. No cycle data is transmitted by this app.
- The PIN is a SHA-256 hash where Web Crypto is available, but local storage itself is not encrypted.

## Test checklist
- [ ] Log period starts around a month end (e.g. Jan 31) and across a leap day.
- [ ] Log a past date; future dates must be rejected.
- [ ] Add irregular cycle starts 20, 31 and 45 days apart and inspect the estimate.
- [ ] Switch device timezone; saved dates should not shift.
- [ ] Change month in calendar and select a day to edit.
- [ ] Try light/dark/automatic themes and Urdu RTL.
- [ ] Export, delete, import, and try an invalid JSON backup.
- [ ] Test notification denied, granted, time not yet reached, and same-day duplicate check.
- [ ] Test app lock after backgrounding.
- [ ] On iPhone install from Safari Home Screen; on Android test Chrome install and offline mode.
- [ ] Check 320px viewport, keyboard focus, reduced motion, manifest and service worker.
- [ ] Before public launch, test on physical devices and review the privacy/notification behavior.

## Update (v2) - kya theek hua
- Period ki shuruaat sirf pehle din se gini jati hai (pehle har flagged din cycle ka hisaab bigar deta tha).
- Notification ab service worker se jati hai (Android Chrome par `new Notification()` kaam nahi karta).
- **Calendar reminders (.ics)**: Settings/Home par "Add reminders to my calendar". iPhone aur Android dono mein
  asli alarm lagta hai, app band ho tab bhi, bina server ke. Naya period log karne ke baad dobara dabayein.
- PNG icons (iPhone/Android install ke liye zaroori), update-friendly service worker (v2).
- Urdu: home screen ke messages translate hue. Baqi static labels abhi English mein hain.

## Update (v3) - kya naya / theek hua
**Home screen**
- Ulta countdown: bara number ab "kitne din baqi" dikhata hai (28 se 0 tak) aur ring dheere dheere khali hoti hai.
- Period se 5 din ya kam reh jayen to poora circle red ho jata hai (glow ke saath). Period late ho to bhi red + "DAYS LATE".
- Period chal rahi ho to ring "Period day 2 of 5" dikhati hai.
- Purana bara red "warning" box hata diya. Ab sirf chhoti si naram line aati hai (5 din ya kam reh jayen tab).
- "In 1 days" ki ghalti theek: ab "Tomorrow" / "Today" / "In 5 days".
- Naya cycle bar: Period / Follicular / Fertile / Luteal ke rang aur aaj ka nishan, saath mein phase ka chhota tip.
- Poora page chhote layout mein ek screen par fit hota hai (Home, Calendar, Log, Insights).

**Bugs jo theek hue**
- Period late ho to pehle app agle cycle ki tareekh dikha deti thi; ab "Late by N days" dikhati hai.
- "Period ended" pehle kisi bhi din dabane par period ki lambai 10 kar deti thi; ab har period ka asli end din save hota hai aur average period length usi se banti hai.
- "Period started today" dobara dabane par naya cycle ban jata tha; ab roka jata hai.
- Notification ab service worker se aati hai (Android par `new Notification()` kaam nahi karta). Settings mein "Send test" button hai.
- Note mein `</textarea>` jaisa text likhne par page toot sakta tha; ab escape hota hai.
- Calendar: agle mahine ke period se pehle aane wale fertile din ab sahi dikhte hain; future din ka "Log" button band hai.
- Calendar file (.ics): ab agle 2 cycles, period ki tareekh ka all-day event bhi, aur "1 days" ki ghalti theek.
- Lock button bina PIN ke chup rehta tha; ab bata deta hai.
- Theme-color (status bar) ab dark/light ke saath badalta hai.

**Naya**
- Week Sunday / Monday / Saturday se shuru (Settings).
- Calendar mein note wale dinon par chhota dot, saaf legend, "Today" button.
- Insights: average period length, chart par maheene aur average line, sab se ziada aane wali alamaat.
- Urdu mein ab har label (onboarding, install hint, Settings) translate hai.
- PNG icons (192, 512, maskable, apple-touch) aur aap ka naya logo (GPT wala) sab sizes mein.

Deploy: purani files ki jagah in sab files ko GitHub repo mein upload karein (index.html root par). Browser mein ek baar refresh karein; service worker v5 purana cache khud hata deta hai.

## Update (v4) - Canva design + naya logo
- Poora look Canva wale design jaisa: DM Sans + Fraunces fonts, naram pink rang, bare round cards, Home par ring + journey card + gentle reminder card, Calendar mein bare rounded din, neeche navigation bar.
- Aap ka logo (Bloom Cycle Tracker) header, lock screen aur sab icons (192, 512, maskable, apple-touch, favicon) mein lag gaya.
- Andar ka sara kaam pehle jaisa hai: IndexedDB/local data, PIN lock, notifications, .ics reminders, Urdu, export/import.
- Deploy: zip kholein, sari files GitHub repo mein upload karein (index.html root par). Phir browser mein ek baar refresh karein; service worker v7 purana cache khud hata deta hai.
