# Jesse Hielema Portfolio

Live site: [Deploy to Netlify](https://app.netlify.com/drop)

## Quick Deploy Instructions

### Option 1: Drag & Drop (Eenvoudigst)
1. Ga naar [Netlify Drop](https://app.netlify.com/drop)
2. Log in met je Netlify account (of maak een gratis account aan)
3. Sleep de hele `portfolio` map naar de Netlify Drop zone
4. Wacht tot de upload compleet is
5. Je krijgt een live URL zoals: `https://random-name-12345.netlify.app`

### Option 2: Via Git (Aanbevolen voor updates)
1. Maak een GitHub repository aan
2. Push deze code naar GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/JOUW-USERNAME/portfolio.git
   git push -u origin main
   ```
3. Ga naar [Netlify](https://app.netlify.com)
4. Klik op "Add new site" → "Import an existing project"
5. Kies GitHub en selecteer je repository
6. Netlify detecteert automatisch de instellingen
7. Klik op "Deploy site"

### Option 3: Via Netlify CLI
```bash
# Installeer Netlify CLI (Node.js required)
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Custom Domain
Na deployment kun je een custom domain instellen:
1. Ga naar Site settings → Domain management
2. Klik op "Add custom domain"
3. Volg de instructies om je DNS in te stellen

## Automatische Updates
Als je via Git deployed hebt, worden wijzigingen automatisch gedeployed bij elke push naar je repository.
