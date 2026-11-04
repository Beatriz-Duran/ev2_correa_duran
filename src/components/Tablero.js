import { AnimatePresence, motion } from 'framer-motion';
import Carta from './Carta';
import { CARTAS_DEL_JUEGO } from '../logic/carioca';

function Tablero({ cartas, onDescartar }) {
  const huecos = Math.max(0, CARTAS_DEL_JUEGO - cartas.length);

  return (
    <ul className="tablero" aria-label="Cartas en la mesa">
      <AnimatePresence mode="popLayout">
        {cartas.map((carta) => (
          <motion.li
            key={carta.id}
            layout
            className="tablero__lugar"
            initial={{ opacity: 0, y: -70, rotate: -16, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, x: 90, rotate: 24, scale: 0.8, transition: { duration: 0.3 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <Carta carta={carta} onDescartar={onDescartar} />
          </motion.li>
        ))}
      </AnimatePresence>

      {Array.from({ length: huecos }, (_, indice) => (
        <li key={indice} className="tablero__lugar tablero__lugar--vacio" aria-hidden="true" />
      ))}
    </ul>
  );
}

export default Tablero;
