# AnesIA

Assistant IA specialise en anesthesie-reanimation, concu pour accompagner les anesthesistes et IADE dans leur pratique clinique quotidienne.

## Fonctionnalites

- Chat IA avec LLM (Llama 3.3 70B via Groq)
- Reponses formatees en Markdown (tableaux, listes, titres, code blocks)
- Contexte patient integre (age, poids, taille, ASA, antecedents)
- Fiche de visite preanesthesique complete
- Historique des conversations (IndexedDB via Dexie)
- PWA installable avec support hors-ligne
- Interface glassmorphism adaptee au mobile

## Stack

- [Preact](https://preactjs.com/) — UI legere
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Dexie](https://dexie.org/) — IndexedDB
- [Marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) — Markdown sanitisé
- [Groq API](https://groq.com/) — LLM inference rapide

## Installation

```bash
git clone https://github.com/zoubayerBS/anesai.git
cd anesai
npm install
```

## Configuration

Créer un fichier `.env` a la racine :

```env
VITE_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_API_KEY=your_api_key_here
VITE_MODEL=llama-3.3-70b-versatile
VITE_MAX_TOKENS=1024
```

Un fichier `.env.example` est disponible comme modele.

## Developpement

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Licence

Projet prive.
