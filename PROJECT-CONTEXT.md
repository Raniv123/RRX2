# RRX2 — Project Context

📅 עדכון אחרון: 2026-05-25
💬 שיחה אחרונה: שדרוג v2.0 — Crimson Ritual design + 20 premium cards (Gemini) + critical bug fixes

---

## מה הפרויקט עושה

**RRX2 — INTIMACY** — אפליקציית קלפים אינטימית לזוגות, פלטפורמת מובייל בלבד (portrait).
משלבת פיתוי + מקצועיות ברמת מטפלי מין מובילים (Esther Perel, Emily Nagoski, OMGYes, Gottman).

המטרה: ה־**#1 בעולם** במשחקי קלפים זוגיים בעברית.

## טכנולוגיות

- **Framework**: React 19 + Vite 6 + TypeScript 5.8
- **Styling**: Tailwind (CDN) + custom CSS variables (`Crimson Ritual` palette)
- **Fonts**: Playfair Display (display), Cormorant Garamond (italic), Heebo (body)
- **AI**: Google Gemini 3.1 Pro (לתוכן הקלפים)
- **כיוון**: RTL מלא, עברית, mobile-first portrait

## עיצוב — Crimson Ritual (נבחר ב-2026-05-25)

**פלטה — 7 צבעים semantic:**

| Token | Hex | תפקיד |
|-------|-----|-------|
| `--ink` | `#080306` | רקע ראשי (שחור-בורגונדי) |
| `--blood-deep` | `#9f1239` | אקסנט עמוק, ייבוא |
| `--blood` | `#e02b4f` | אקסנט ראשי (אדום סקסי) |
| `--rose` | `#ff5277` | ורוד לוהט |
| `--ember` | `#ff8a5b` | גחל חם |
| `--gold` | `#f5c46e` | זהב — לסודות |
| `--bone` | `#fff5ed` | טקסט ראשי |

**טיפוגרפיה:**
- כותרות: Playfair Display 600
- italic: Cormorant Garamond 400 italic
- גוף: Heebo 300-500

**עקרונות עיצוב:**
- mobile-first portrait בלבד
- כל הכפתורים `rounded-full` או `rounded-3xl`
- glow effects (אדום-זהב) במקום צללים שטוחים
- ללא אימוג'ים ידידותיים — רק טיפוגרפיה ואייקונים SVG
- atmospheric gradient orbs ברקע (drift animation)

## זרימת המסך

```
LOGIN (1900) → MENU
                ├─ JOURNEY  (17 צעדים: FOREPLAY → HEAT → 69 → POSITIONS → FINALE)
                ├─ SCENARIO (roleplay אקראי)
                ├─ DICE     (פעולה · איבר · טוויסט)
                └─ TIPS     (1900 = נשי, 5888 = גברי)
```

## תכולת קלפים — 75 קלפים סה"כ

- **55 קלפים** מקוריים מ-`content.ts` (id 1-504)
- **20 קלפים פרימיום** מ-Gemini 3.1 Pro (id 1000-1019) — כל אחד עם ציטוט מחקרי ב-`secret`

חלוקה:
- FOREPLAY · 13 קלפים (level 0-2)
- HEAT · 18 קלפים (level 2-3, עם timer)
- 69 · 7 קלפים (level 3)
- TRANSITION · 6 קלפים (stations + frottage + surprises)
- POSITIONS · 21 קלפים (level 4-5)
- FINALE · 2 קלפים (edging + release)

## מה תיקנתי בשיחה הזו (v2.0)

### תיקוני באגים קריטיים ב-Journey.tsx
1. ✅ **Off-by-one** ב-`totalSteps` — היה `16`, צריך `17`
2. ✅ **Empty pool fallback** — אם pool ריק → לוקח fallback card לפי step, לא דורג שקט
3. ✅ **Timer cleanup** — `useRef` לintervals, cleanup ב-unmount
4. ✅ **`JourneyComplete` screen** — לא נתקעים בסוף, מקבלים מסך סיום עם "מסע חדש"
5. ✅ **`swapCard` תקין** — מסנן גם `playedCardIds`, fallback אם empty

### שיפורי אבטחה / נגישות
1. ✅ Login: rate limit (3 ניסיונות → 30s lockout)
2. ✅ `aria-label`, `role="progressbar"`, `role="timer"` בכל הקומפוננטות
3. ✅ `prefers-reduced-motion` — כל אנימציה מבוטלת
4. ✅ `inputMode="numeric"` ב-PIN
5. ✅ Touch targets ≥ 44px
6. ✅ `<meta name="robots" content="noindex,nofollow">` + `referrer no-referrer`
7. ✅ הסרת `maximum-scale=1` ה-aria-violation

### עיצוב מאפס
1. ✅ index.html — Crimson palette, fonts, glass effects, semantic CSS vars
2. ✅ UI.tsx — Button + Modal + SvgIcon חדשים עם gradients ו-glow
3. ✅ Login.tsx — shimmer text, glass PIN input, focus ring
4. ✅ Menu.tsx — 4 tiles: המסע (גדול) + תרחישים/קוביה (2-col) + הסודות
5. ✅ Journey.tsx — fully rewritten with `STEPS[]` array (deterministic, type-safe)
6. ✅ Scenario.tsx — glass card עם pills לתפקידים
7. ✅ Dice.tsx — 3 slots עם glow צבעוני שונה לכל אחד
8. ✅ Tips.tsx — gender-gated, glass tip cards

### תוכן
1. ✅ הוספת 20 קלפים פרימיום מ-Gemini עם:
   - `desc` סקסי + ברור
   - `details` בפורמט "הוא: ... היא: ... שניכם: ..." (4-6 צעדים ברורים)
   - `secret` עם ציטוט מחקרי מ-Nagoski/Perel/OMGYes/Gottman
2. ✅ הוספת `secret` ל-id 504 (FINALE) — מצוטט מ-Gottman

## מה עוד צריך (לפעם הבאה)

- [ ] Mood selector לפני Journey (קצר/ארוך/אינטנסיבי)
- [ ] localStorage persistence — לחזור למסע אחרי סגירה (architect ADR-001/003)
- [ ] Streak counter (ימי משחק רצופים)
- [ ] Card feedback (👍/👎) להתאמה אישית
- [ ] PWA: manifest.json + Service Worker + icons
- [ ] Wake Lock — לשמור שהמסך לא ינעל באמצע המסע
- [ ] Surprise card injection אקראי (15% per step)
- [ ] Cross-session memory — לא לחזור על קלפי הסשן הקודם
- [ ] Migration ל-Tailwind מקומי (לא CDN)
- [ ] Vitest tests ל-`drawForStep`, timer cleanup, PIN

## הסוכנים שהיו בלופ

- 🔵 **החוקר** — סקירת 10 מתחרים + 15 מכניקות + 20 ניסוחים + 5 פיצ'רים חסרים + ציטוטי מחקר
- 🟣 **האדריכל** — 12 באגים מזוהים + 5 ADRs + Risk Matrix
- 🔴 **המעצב** — 3 mockups בסיסיים + 3 mockups לבחירה (option-A/B/C) — נבחר B
- 🟢 **Gemini 3.1 Pro** — 20 קלפים חדשים (data/new-cards.json)

## אזהרות

- ⚠️ **PIN בצד-לקוח** — `1900` ו-`5888` חשופים בקוד. מתאים לשימוש אישי, לא לפריסה ציבורית.
- ⚠️ **Tailwind CDN** — לא לprodaction. צריך לעבור ל-`@tailwindcss/vite` בשלב הבא.
- ⚠️ **content.ts** — 555+ שורות, כדאי לפצל ל-`cards.ts`, `tips.ts`, `scenarios.ts`, `icons.ts`.

## איך להריץ

```bash
cd D:/CLAUDE-CODE/PROJECTS/אישי/RRX2
npm install
npm run dev   # vite — port אוטומטי
npm run build # production build to dist/
```

API key: `.env.local` → `GEMINI_API_KEY=...`
