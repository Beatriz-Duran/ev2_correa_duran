import { useState } from 'react';
import { imagenDeCarta } from '../imagenesCartas';
import { buscarPinta, esJoker, nombreCarta } from '../logic/carioca';

function CaraDibujada({ carta }) {
  const joker = esJoker(carta);
  const indice = joker ? '★' : carta.numero;
  const simbolo = joker ? '' : buscarPinta(carta.pinta).simbolo;

  return (
    <>
      <span className="carta__indice" aria-hidden="true">
        {indice}
        <small>{simbolo}</small>
      </span>
      <span className="carta__centro" aria-hidden="true">
        {joker ? 'Joker' : simbolo}
      </span>
      <span className="carta__indice carta__indice--invertido" aria-hidden="true">
        {indice}
        <small>{simbolo}</small>
      </span>
    </>
  );
}

function Carta({ carta, onDescartar }) {
  const [imagenFallo, setImagenFallo] = useState(false);

  const joker = esJoker(carta);
  const color = joker ? 'joker' : buscarPinta(carta.pinta).color;
  const imagen = imagenFallo ? null : imagenDeCarta(carta);

  return (
    <div className={`carta carta--${color}`} role="img" aria-label={nombreCarta(carta)}>
      {imagen ? (
        <img
          className="carta__imagen"
          src={imagen}
          alt=""
          draggable="false"
          onError={() => setImagenFallo(true)}
        />
      ) : (
        <CaraDibujada carta={carta} />
      )}
      <button
        type="button"
        className="carta__descartar"
        aria-label={`Descartar ${nombreCarta(carta)}`}
        onClick={() => onDescartar(carta.id)}
      >
        ×
      </button>
    </div>
  );
}

export default Carta;
