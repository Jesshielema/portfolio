# Portfolio Upgrade Guide - Van LocalStorage naar CMS

## Huidige Status ✅

Je portfolio is nu volledig functioneel met:
- **Dynamische feed** die posts kan laden en weergeven
- **Admin panel** (`admin.html`) voor het toevoegen van nieuwe posts
- **Moderne UI** geïnspireerd op Instagram/Behance
- **Responsive design** voor mobile en desktop
- **LocalStorage** voor het opslaan van nieuwe posts

## Volgende Stappen 🚀

### Optie 1: Sanity CMS (Aanbevolen)
**Voordelen:** Zeer gebruiksvriendelijk, mobile app, perfecte API, gratis tier

#### Setup Stappen:
1. **Account aanmaken:**
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```

2. **Schema definieren in Sanity Studio:**
   ```javascript
   // schemas/post.js
   export default {
     name: 'post',
     title: 'Portfolio Post',
     type: 'document',
     fields: [
       {
         name: 'title',
         title: 'Titel',
         type: 'string',
         validation: Rule => Rule.required()
       },
       {
         name: 'slug',
         title: 'Slug',
         type: 'slug',
         options: { source: 'title' }
       },
       {
         name: 'image',
         title: 'Afbeelding',
         type: 'image',
         options: { hotspot: true }
       },
       {
         name: 'type',
         title: 'Project Type',
         type: 'string',
         options: {
           list: ['Design', 'Branding', 'UI/UX', 'Motion', 'Web']
         }
       },
       {
         name: 'description',
         title: 'Beschrijving',
         type: 'text'
       },
       {
         name: 'featured',
         title: 'Uitgelicht',
         type: 'boolean'
       },
       {
         name: 'publishedAt',
         title: 'Publicatiedatum',
         type: 'datetime'
       }
     ]
   }
   ```

3. **API integratie in je frontend:**
   ```javascript
   // Vervang de loadPosts() functie in script.js
   async function loadPostsFromSanity() {
     const query = `*[_type == "post"] | order(publishedAt desc) {
       _id,
       title,
       slug,
       "image": image.asset->url,
       type,
       description,
       featured,
       publishedAt
     }`;
     
     try {
       const response = await fetch(
         `https://YOUR_PROJECT_ID.api.sanity.io/v2021-10-21/data/query/production?query=${encodeURIComponent(query)}`
       );
       const data = await response.json();
       return data.result;
     } catch (error) {
       console.error('Error loading posts:', error);
       return [];
     }
   }
   ```

### Optie 2: Firebase (Goede alternatief)
**Voordelen:** Gratis tier, realtime updates, Google integratie

#### Setup:
1. Firebase project aanmaken
2. Firestore database opzetten
3. Authentication toevoegen voor admin toegang
4. Firebase SDK toevoegen aan je project

### Optie 3: Supabase (Open source alternatief)
**Voordelen:** PostgreSQL database, real-time subscriptions, open source

## Mobile Upload Workflow 📱

### Voor Sanity:
1. **Sanity Studio app** downloaden op je telefoon
2. Posts direct uploaden en bewerken via de app
3. Posts verschijnen automatisch op je website

### Voor Firebase:
1. **Progressive Web App (PWA)** maken van je admin panel
2. Firebase storage voor afbeeldingen
3. Push notifications voor nieuwe posts

## Deployment Opties 🌐

### Statische Hosting (Aanbevolen voor start):
- **Netlify:** Gratis, automatische deployments vanuit Git
- **Vercel:** Excellente performance, perfecte Next.js integratie
- **GitHub Pages:** Gratis, simpel voor statische sites

### Commands voor deployment:
```bash
# Voor Netlify
npm install -g netlify-cli
netlify deploy --prod

# Voor Vercel
npm install -g vercel
vercel --prod
```

## Geavanceerde Features 🔥

1. **Search functionaliteit**
   - Filter posts op type
   - Zoeken in titels en beschrijvingen

2. **Project detail pagina's**
   - Volledige project showcase
   - Afbeelding galleries
   - Video support

3. **Contact formulier**
   - Email integration
   - Form submissions naar database

4. **Analytics**
   - Google Analytics
   - Post view tracking

5. **SEO optimalisatie**
   - Meta tags per post
   - Open Graph images
   - Structured data

## Quick Start voor Sanity 🏃‍♂️

Als je wilt beginnen met Sanity, run dan deze commands:

```bash
# 1. Installeer Sanity CLI
npm install -g @sanity/cli

# 2. Nieuwe Sanity project
sanity init

# 3. Start Sanity Studio
cd your-sanity-project
sanity start

# 4. Deploy Studio
sanity deploy
```

## Vragen of Hulp Nodig? 💬

- Sanity Documentatie: https://www.sanity.io/docs
- Firebase Documentatie: https://firebase.google.com/docs
- Voor specifieke implementatie vragen, laat het me weten!

---

**Tip:** Begin met Sanity voor de beste mobile upload ervaring. Je kunt posts uploaden via hun mobiele app en ze verschijnen direct op je website!
