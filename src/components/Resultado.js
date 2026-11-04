import { AnimatePresence, motion } from 'framer-motion';

const ANIMACION_VALIDO = {
  initial: { opacity: 0, scale: 0.4 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 420, damping: 13 },
};

const ANIMACION_INVALIDO = {
  initial: { opacity: 0, y: -18 },
  animate: { opacity: 1, y: 0, x: [0, -12, 12, -8, 8, 0] },
  transition: { duration: 0.45 },
};

const MENSAJES_DE_GUARDADO = {
  guardando: 'Guardando jugada...',
  guardado: 'Jugada guardada.',
  'sin-configurar': 'No se guardó: faltan las credenciales en src/firebaseConfig.js.',
  error: 'No se guardó: revisa tu conexión y las reglas de Firestore.',
};

function Resultado({ resultado, guardado }) {
  const detalle = resultado?.valido ? MENSAJES_DE_GUARDADO[guardado] : resultado?.motivo;

  return (
    <div className="resultado" aria-live="polite">
      <AnimatePresence mode="wait">
        {resultado && (
          <motion.div key={resultado.intento} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
            <motion.h1
              className={resultado.valido ? 'resultado__titulo' : 'resultado__titulo resultado__titulo--invalido'}
              {...(resultado.valido ? ANIMACION_VALIDO : ANIMACION_INVALIDO)}
            >
              {resultado.valido ? 'TRES TRÍOS :D' : 'NO FORMA JUEGO :C'}
            </motion.h1>
            {detalle && <p className="resultado__detalle">{detalle}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Resultado;
