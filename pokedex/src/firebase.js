import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Las credenciales se leen del archivo .env (Vite solo expone las que empiezan con VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
}

const app = initializeApp(firebaseConfig)

// Conexión a Firestore; la usaremos para guardar el equipo
export const db = getFirestore(app)
