# Jesse Hielema Portfolio

Een moderne, responsieve portfolio website geïnspireerd op Instagram/Behance feeds.

## Features ✨

- **Dynamische Feed:** Posts worden automatisch geladen en weergegeven in een moderne grid layout
- **Admin Panel:** Eenvoudig nieuwe posts toevoegen via `admin.html`
- **Responsive Design:** Werkt perfect op desktop, tablet en mobile
- **Modern UI:** Strakke navigatie met slide-in menu
- **Mobile-Ready:** Voorbereid voor mobiele upload workflow

## Bestanden 📁

- `index.html` - Hoofdpagina met portfolio feed
- `admin.html` - Admin panel voor het toevoegen van posts
- `styles.css` - Alle styling voor de website
- `script.js` - JavaScript functionaliteit
- `UPGRADE_GUIDE.md` - Gids voor upgraden naar een volledige CMS

## Gebruik 🚀

### Posts Toevoegen
1. Ga naar `admin.html`
2. Vul de formulier in met project details
3. Upload een afbeelding
4. Klik op "Post Toevoegen"
5. De post verschijnt automatisch op de hoofdpagina

### Lokaal Runnen
Open `index.html` in je browser, of gebruik een lokale server:

```bash
# Met Python
python -m http.server 8000

# Met Node.js (npx serve)
npx serve .

# Met PHP
php -S localhost:8000
```

## Technische Details 🔧

### Huidige Stack:
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Storage:** Browser LocalStorage (tijdelijk)
- **Styling:** Custom CSS Grid & Flexbox
- **Responsiviteit:** Mobile-first design

### Aanbevolen Upgrade Path:
1. **CMS:** Sanity.io voor content management
2. **Framework:** Next.js voor betere performance
3. **Deployment:** Netlify of Vercel
4. **Mobile Upload:** Sanity Studio mobile app

## Volgende Stappen 📱

Voor een volledige mobiele upload workflow, check `UPGRADE_GUIDE.md` voor:
- Sanity CMS integratie
- Firebase alternatief
- Deployment instructies
- Geavanceerde features

## Browser Support 🌐

- Chrome (aanbevolen)
- Firefox
- Safari
- Edge

## Mobile Upload Ready 📲

Dit project is voorbereid voor eenvoudige mobile uploads via:
- Sanity Studio mobile app
- Progressive Web App conversie
- Direct upload naar cloud storage

Zie `UPGRADE_GUIDE.md` voor gedetailleerde instructies!
