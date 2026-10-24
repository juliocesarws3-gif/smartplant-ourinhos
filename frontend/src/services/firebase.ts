import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApDu8N4JmB4htRGI2SKviLGb0ASjNMfjE",
  authDomain: "smartplant-ourinhos.firebaseapp.com",
  projectId: "smartplant-ourinhos",
  storageBucket: "smartplant-ourinhos.firebasestorage.app",
  messagingSenderId: "1082104025249",
  appId: "1:1082104025249:web:434ee82253fc8ec2d920e0"
};

// Inicialização segura do Firebase (evita duplicação)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export const subscribeToOrders = (callback: (orders: any[]) => void) => {
  try {
    const ordersCol = collection(db, 'ordens_servico');
    return onSnapshot(ordersCol, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
      console.warn('[Firebase Sync] Firestore em modo fallback local:', error.message);
    });
  } catch (e) {
    console.warn('[Firebase Sync] Inicialização NoSQL local ativa');
    return () => {};
  }
};
