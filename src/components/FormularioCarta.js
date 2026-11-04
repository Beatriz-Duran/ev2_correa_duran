import { useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { JOKER, PINTAS, normalizarNumero } from '../logic/carioca';

function FormularioCarta({ onAgregar }) {
  const [numero, setNumero] = useState('');
  const [pinta, setPinta] = useState(PINTAS[0].id);
  const [error, setError] = useState(null);
  const campoNumero = useRef(null);
  const boton = useAnimationControls();
  const formulario = useAnimationControls();

  const esJoker = normalizarNumero(numero) === JOKER;

  function rechazar(mensaje) {
    setError(mensaje);
    formulario.start({ x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.3 } });
    campoNumero.current.focus();
  }

  function enviar(evento) {
    evento.preventDefault();

    const valor = normalizarNumero(numero);
    if (!valor) {
      rechazar('Escribe A, un número del 2 al 10, J, Q, K o Joker.');
      return;
    }

    const motivo = onAgregar(valor, pinta);
    if (motivo) {
      rechazar(motivo);
      return;
    }

    setError(null);
    setNumero('');
    campoNumero.current.focus();
    boton.start({
      scale: [1, 1.14, 0.96, 1],
      rotate: [0, -3, 2, 0],
      transition: { duration: 0.35 },
    });
  }

  return (
    <motion.form className="formulario" onSubmit={enviar} animate={formulario} noValidate>
      <div className="campo">
        <label htmlFor="numero">Número</label>
        <input
          id="numero"
          ref={campoNumero}
          type="text"
          value={numero}
          onChange={(evento) => setNumero(evento.target.value)}
          placeholder="A, 2 a 10, J, Q, K"
          autoComplete="off"
          aria-describedby="ayuda-numero"
          aria-invalid={Boolean(error)}
        />
      </div>

      <div className="campo">
        <label htmlFor="pinta">Pinta</label>
        <select
          id="pinta"
          value={pinta}
          onChange={(evento) => setPinta(evento.target.value)}
          disabled={esJoker}
        >
          {PINTAS.map(({ id, nombre, simbolo }) => (
            <option key={id} value={id}>
              {simbolo} {nombre}
            </option>
          ))}
        </select>
      </div>

      <motion.button type="submit" className="boton boton--agregar" animate={boton} whileTap={{ scale: 0.95 }}>
        Agregar
      </motion.button>

      <p id="ayuda-numero" className={error ? 'formulario__nota formulario__nota--error' : 'formulario__nota'} role="status">
        {error ?? 'Escribe Joker para agregar un comodín; no necesita pinta.'}
      </p>
    </motion.form>
  );
}

export default FormularioCarta;
