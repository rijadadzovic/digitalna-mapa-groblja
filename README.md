# Digitalna mapa groblja (React + Firebase + OpenStreetMap)

Ova aplikacija radi na mobitelu i računaru:
- mapa (OpenStreetMap) sa markerima grobova
- pretraga po imenu/prezimenu
- detalji groba na klik
- admin mod (login email+lozinka) za ručni unos i uređivanje podataka
- footer sa slikom i potpisom

## 1) Pokretanje lokalno

1. Instaliraj Node.js (LTS)
2. U terminalu uđi u folder i pokreni:

```bash
npm install
cp .env.example .env
npm run dev
```

## 2) Firebase podešavanje (kratko)

1. Firebase Console -> Create project
2. Build -> Authentication -> Get started -> Email/Password -> Enable
3. Build -> Firestore Database -> Create database (Production ili Test)
4. Project settings -> General -> Your apps -> Add app (Web) -> kopiraj config u `.env`
5. Authentication -> Users -> Add user -> napravi admin email + lozinka
6. U `.env` postavi `VITE_ADMIN_EMAIL` na taj email (ili izmijeni kod da dozvoli više admina)

## 3) Firestore pravila (obavezno postaviti)

U Firebase Console -> Firestore -> Rules postavi:

```
// Samo admin email smije pisati; svi mogu čitati
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /graves/{docId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null
        && request.auth.token.email == "admin@example.com";
    }
  }
}
```

Zamijeni email sa svojim admin email-om.

## 4) Deploy (Firebase Hosting)

1) Instaliraj Firebase CLI:
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
```

- Public directory: `dist`
- Configure as single-page app: `Yes`

2) Build + deploy:
```bash
npm run build
firebase deploy
```

## 5) Tvoja slika u footeru

Stavi sliku u `public/rijad.jpg` (ili promijeni naziv u kodu).

---

## 6) Brzi deploy na Firebase Hosting (spremno u projektu)

U projektu su već dodani fajlovi: `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`.

### A) 1x Podešavanje
1) Instaliraj Firebase CLI:
```bash
npm i -g firebase-tools
firebase login
```

2) U `.firebaserc` upiši svoj Project ID (Firebase Console → Project settings → Project ID):
```json
{
  "projects": { "default": "YOUR_FIREBASE_PROJECT_ID" }
}
```

3) U `firestore.rules` upiši svoj admin email (isti kao `VITE_ADMIN_EMAIL` u `.env`):
```js
request.auth.token.email == "admin@example.com";
```

4) Primijeni Firestore rules (opcionalno ali preporučeno):
```bash
firebase deploy --only firestore:rules
```

### B) Deploy aplikacije
```bash
npm run build
firebase deploy --only hosting
```

### Napomena o `.env`
`.env` ne ide na GitHub (zbog tajnih ključeva). Drži ga lokalno i postavi na računar gdje radiš deploy.
