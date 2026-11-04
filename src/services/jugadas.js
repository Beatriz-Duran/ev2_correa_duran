import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

const COLECCION = 'jugadascarioca';
const LIMITE_DE_ESPERA_MS = 15000;

const firebaseConfigurado = Object.values(firebaseConfig).every(
  (valor) => valor && !valor.includes('TU_')
);

const db = firebaseConfigurado ? getFirestore(initializeApp(firebaseConfig)) : null;

function esperarCon(limite, promesa) {
  let temporizador;
  const tiempoAgotado = new Promise((_, rechazar) => {
    temporizador = setTimeout(() => rechazar(new Error('Firestore no respondió a tiempo')), limite);
  });

  return Promise.race([promesa, tiempoAgotado]).finally(() => clearTimeout(temporizador));
}

export async function guardarJugada(cartas) {
  if (!db) return 'sin-configurar';

  try {
    await esperarCon(
      LIMITE_DE_ESPERA_MS,
      addDoc(collection(db, COLECCION), {
        juego: 'Tres tríos',
        cartas: cartas.map(({ numero, pinta }) => ({ numero, pinta })),
        creadaEn: serverTimestamp(),
      })
    );
    return 'guardado';
  } catch (error) {
    console.error('No se pudo guardar la jugada:', error);
    return 'error';
  }
}
