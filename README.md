# DeutscheBoost – Smart German Flashcard Translator

**DeutscheBoost** is a full-stack language learning app built to help users rapidly expand and review German vocabulary using intelligent flashcard decks and custom phrase collections. It combines real-time translation, persistent decks, and interactive reviews into a sleek mobile + web experience.

---

## 🌐 Live Demo & Download

- 🔗 Web App: [https://deutscheboost.onrender.com](https://deutscheboost.onrender.com)
- 📱 Android APK: [Download DeutscheBoost APK](https://www.dropbox.com/scl/fi/b66ckv8gq1a4055fns3hv/deutsche_boost.apk?rlkey=gnvmnjz1ukyt4f9th4mc4i8ra&st=hif8qboq&dl=1)

Please note that the backend may take a few moments to initialize after a request, as it is hosted on Render’s free tier which includes cold start delays.

---

## 📱 Features Overview

- 🔤 **Text Selection & Translation** – Select German phrases and get instant English translations via the DeepL API.
- 🗂️ **Flashcard Decks** – Translations are stored in user-created decks that can be reviewed as flashcards.
- 🧠 **Phrase Memorization** – Add your own phrases manually and review them in shuffle-mode for memory retention.
- 🔁 **Review & Flip** – Flashcards can be flipped between German and English sides, and browsed left/right.
- 🔒 **Authentication** – Firebase-secured login system with token-based protection and token refresh handling.
- 🌐 **Web + Native Support** – Runs as a cross-platform React Native app (Android/iOS/Web).

---

## 🧰 Tech Stack

| Layer             | Technology                     |
|------------------|--------------------------------|
| Frontend (App)   | React Native (via Expo SDK 53) |
| Routing/UI       | React Navigation, Vector Icons |
| Backend API      | FastAPI (Python)               |
| Authentication   | Firebase Auth (ID + refresh)   |
| Database         | Google Firestore               |
| Translations     | DeepL API (fallback dummy)     |
| Build Tools      | EAS Build, Expo CLI            |
| Hosting (API)    | Render.com                     |
| Hosting (Web)    | Expo Web Export + Render.com   |

---

## 🚀 Getting Started

### 🧑‍🎓 1. Sign In / Create an Account
DeutscheBoost uses Firebase authentication. After launching the app:

- Create an account or sign in
- The app will securely store your token and refresh it automatically

---

### 🔤 2. Translate a Phrase
Navigate to the **"Translate"** screen:

1. Paste a block of German text
2. Highlight any word or phrase
3. Enter a list number (e.g. `1`)
4. Tap **Translate**

➡️ The phrase and its English translation will be added to a flashcard deck (e.g. `list_1`).

---

### 🗂 3. Review Flashcards
Go to the **"History"** tab:

- See your decks (`list_1`, `list_2`, etc.)
- Tap one to start reviewing
- Flip each card to view either the German or English side
- Use ← and → to navigate

Cards are automatically **shuffled and deduplicated** on every load.

---

### ✍️ 4. Add Your Own Phrases
Head to the **"Phrases"** tab:

- Tap **Add Phrase** to manually input a German/English pair
- Save it and return to review mode

Use **Review Phrases** to go through your custom-set cards just like in the flashcard decks.

---

