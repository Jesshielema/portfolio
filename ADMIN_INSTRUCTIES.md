# Admin Instructies - Portfolio Jesse Hielema

## Admin Toegang 🔐

Je portfolio is nu beveiligd! Alleen jij kunt als admin nieuwe posts toevoegen.

### Hoe in te loggen als admin:

1. **Ga naar:** `admin.html` (typ dit direct in de adresbalk)
2. **Wachtwoord:** `portfolio2024`
3. **Sessie duurt:** 30 minuten (daarna automatisch uitgelogd)

### Admin Functies:

✅ **Nieuwe posts toevoegen**
✅ **Afbeeldingen uploaden** 
✅ **Featured posts instellen**
✅ **Project types categoriseren**
✅ **Automatische uitlog na 30 min**

## Beveiliging Features 🛡️

### Voor Bezoekers:
- **Geen admin link** in het hoofdmenu
- **Geen zichtbare admin toegang** op de website
- **Admin panel alleen bereikbaar** via directe URL

### Voor Jou als Admin:
- **Wachtwoord beveiliging** op admin panel
- **Session timeout** (30 minuten)
- **Automatische uitlog** bij inactiviteit
- **Shake animatie** bij verkeerd wachtwoord

## Hoe Posts Toevoegen 📝

1. **Login:** Ga naar `admin.html` en log in
2. **Invullen:**
   - Titel van je project
   - Project type (Design, Branding, UI/UX, etc.)
   - Beschrijving (optioneel)
   - Upload afbeelding
   - Featured post? (verschijnt bovenaan)

3. **Upload:** Klik "Post Toevoegen"
4. **Resultaat:** Post verschijnt direct op je portfolio!

## Wachtwoord Wijzigen 🔑

Om je wachtwoord te wijzigen:

1. Open `admin.html` in een code editor
2. Zoek naar: `const ADMIN_PASSWORD = 'portfolio2024';`
3. Verander `'portfolio2024'` naar jouw nieuwe wachtwoord
4. Sla het bestand op

**Tip:** Kies een sterk wachtwoord met letters, cijfers en symbolen!

## Mobile Gebruik 📱

Het admin panel werkt ook perfect op je telefoon:
- Responsive design
- Touch-friendly interface
- Afbeeldingen uploaden vanaf je telefoon
- Same beveiligingsfeatures

## Veiligheid Tips 🚨

1. **Deel je wachtwoord nooit** met anderen
2. **Log altijd uit** na gebruik (vooral op publieke computers)
3. **Verander je wachtwoord** regelmatig
4. **Gebruik een sterke wachtwoord** (minimaal 12 karakters)

## Technische Details ⚙️

- **Storage:** Posts worden opgeslagen in browser localStorage
- **Sessies:** 30 minuten timeout voor veiligheid
- **Afbeeldingen:** Ondersteunt JPG, PNG, GIF (max 5MB)
- **Backup:** Data blijft bewaard in je browser

## Toekomstige Upgrades 🚀

Voor productie gebruik wordt aanbevolen:
- **Database** (Sanity/Firebase) in plaats van localStorage
- **Server-side authenticatie** 
- **HTTPS** voor veilige verbindingen
- **Cloud storage** voor afbeeldingen

## Problemen? 🆘

Als je problemen hebt:
1. **Refresh** de pagina
2. **Check** je wachtwoord
3. **Clear browser cache** als nodig
4. **Gebruik incognito mode** om te testen

---

**Veel plezier met je portfolio admin panel!** 🎨
