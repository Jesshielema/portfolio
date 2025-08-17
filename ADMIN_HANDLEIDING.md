# 🚀 Portfolio Admin Handleiding

## ✨ Nieuwe Functies

### 1. 📸 Meerdere Foto's per Project
- Klik op **"+ Foto"** in de admin panel
- Upload meerdere afbeeldingen tegelijk
- Bezoekers kunnen door alle foto's navigeren in de lightbox
- Zoom functie: klik op foto in lightbox om in/uit te zoomen

### 2. 🎛️ Admin Panel Toegang
**URL:** `jouw-website.com/admin.html`

**Functies:**
- ✅ Projecten toevoegen/bewerken/verwijderen
- ✅ Meerdere afbeeldingen per project uploaden
- ✅ Project details aanpassen (titel, beschrijving, type, jaar)
- ✅ Projecten als 'uitgelicht' markeren
- ✅ Live voorvertoning van wijzigingen

### 3. 📊 Google Analytics Setup
1. **Ga naar:** https://analytics.google.com
2. **Maak account** en property aan
3. **Kopieer je Measurement ID** (GA_MEASUREMENT_ID)
4. **Vervang in index.html en admin.html:**
   ```html
   gtag('config', 'JOUW_MEASUREMENT_ID');
   ```

**Wat wordt getrackt:**
- 📈 Pagina bezoeken
- 🖱️ Project hover interactions  
- 👀 Project clicks en modal opens
- 📧 Contact form submissions
- 📱 Mobile vs desktop gebruik

### 4. 🎨 Enhanced User Experience
- **Smooth scrolling** naar secties
- **Enhanced hover effects** op projecten
- **Lightbox zoom** functionaliteit
- **Responsive design** voor alle apparaten
- **Loading animations** voor betere UX

## 🔧 Technische Verbeteringen

### JavaScript Organisatie
- ✅ Alle JavaScript verplaatst naar `script.js`
- ✅ Modulaire functie structuur
- ✅ Clean HTML bestanden
- ✅ Betere onderhoudbaarheid

### Admin Panel Beheer
```javascript
// Nieuwe functies beschikbaar:
- addNewProject()     // Nieuw project toevoegen
- addImage(projectId) // Foto's toevoegen aan project
- editProject(id)     // Project bewerken
- deleteProject(id)   // Project verwijderen
- saveChanges()       // Wijzigingen opslaan
- previewSite()       // Live voorvertoning
```

## 📈 Google Analytics Dashboard
Na setup kun je zien:
1. **Realtime bezoekers**
2. **Populairste projecten** 
3. **Contact form conversies**
4. **Mobiel vs desktop gebruik**
5. **Gemiddelde sessie duur**

## 🚀 Deployment Updates
Na wijzigingen in admin panel:

```bash
git add .
git commit -m "Update portfolio projects via admin panel"  
git push
```

→ **Automatische deployment naar Netlify**

## 🎯 Best Practices
1. **Optimaliseer afbeeldingen** voor web (WebP, max 1MB)
2. **Gebruik descriptieve titels** voor betere SEO
3. **Update regelmatig** met nieuwe projecten
4. **Monitor analytics** voor optimalisatie
5. **Test op mobiele apparaten**

## 🆘 Troubleshooting
**Admin panel werkt niet?**
- Check browser console voor errors
- Refresh de pagina (Ctrl+F5)
- Clear browser cache

**Afbeeldingen laden niet?**
- Controleer bestandsformaat (JPG, PNG, WebP)
- Zorg voor correct pad naar images folder
- Check bestandsgrootte (<5MB aanbevolen)

**Analytics werken niet?**
- Vervang GA_MEASUREMENT_ID met echte ID
- Check Google Analytics dashboard na 24h
- Verifieer script loading in browser developer tools

---
**💡 Tip:** Bookmark admin.html voor snelle toegang tot je portfolio beheer!
