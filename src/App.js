import { useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import FormularioCarta from './components/FormularioCarta';
import Resultado from './components/Resultado';
import Tablero from './components/Tablero';
import { elegirImagenJoker } from './imagenesCartas';
import {
  CARTAS_DEL_JUEGO,
  JOKER,
  ordenarPorNumero,
  ordenarPorPinta,
  revisarLimite,
  validarTresTrios,
} from './logic/carioca';
import { guardarJugada } from './services/jugadas';

function App() {
  const [cartas, setCartas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [guardado, setGuardado] = useState(null);
  const siguienteId = useRef(1);
  const ultimoIntento = useRef(0);

  function reiniciarResultado() {
    ultimoIntento.current += 1;
    setResultado(null);
    setGuardado(null);
  }

  function agregarCarta(numero, pinta) {
    const joker = numero === JOKER;
    const carta = {
      id: siguienteId.current,
      numero,
      pinta: joker ? null : pinta,
      imagenJoker: joker ? elegirImagenJoker(cartas) : null,
    };

    const motivo = revisarLimite(cartas, carta);
    if (motivo) return motivo;

    siguienteId.current += 1;
    setCartas([...cartas, carta]);
    reiniciarResultado();
    return null;
  }

  function descartarCarta(id) {
    setCartas((actuales) => actuales.filter((carta) => carta.id !== id));
    reiniciarResultado();
  }

  function limpiarMesa() {
    setCartas([]);
    reiniciarResultado();
  }

  async function validarJuego() {
    const intento = ultimoIntento.current + 1;
    ultimoIntento.current = intento;

    const { valido, trios, motivo } = validarTresTrios(cartas);
    setResultado({ intento, valido, motivo });
    setGuardado(null);

    if (!valido) return;

    setCartas(trios.flat());
    setGuardado('guardando');

    const estado = await guardarJugada(cartas);
    if (ultimoIntento.current === intento) setGuardado(estado);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="aplicacion">
        <main className="mesa">
          <header className="encabezado">
            <p className="encabezado__marca">Carioca</p>
            <p className="encabezado__ronda">
              Tres tríos: <strong>{cartas.length} de {CARTAS_DEL_JUEGO} cartas</strong>
            </p>
          </header>

          <FormularioCarta onAgregar={agregarCarta} />

          <Tablero cartas={cartas} onDescartar={descartarCarta} />

          <div className="acciones">
            <motion.button
              type="button"
              className="boton boton--validar"
              onClick={validarJuego}
              disabled={guardado === 'guardando'}
              whileTap={{ scale: 0.96 }}
            >
              Validar Juego
            </motion.button>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => setCartas(ordenarPorNumero(cartas))}
              disabled={cartas.length < 2}
            >
              Ordenar por número
            </button>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => setCartas(ordenarPorPinta(cartas))}
              disabled={cartas.length < 2}
            >
              Ordenar por pinta
            </button>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={limpiarMesa}
              disabled={cartas.length === 0}
            >
              Limpiar mesa
            </button>
          </div>

          <Resultado resultado={resultado} guardado={guardado} />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
