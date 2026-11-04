
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const PINTAS = [
  { id: 'diamante', nombre: 'Diamante', simbolo: '♦︎', color: 'roja' },
  { id: 'corazon', nombre: 'Corazón', simbolo: '♥︎', color: 'roja' },
  { id: 'trebol', nombre: 'Trébol', simbolo: '♣︎', color: 'negra' },
  { id: 'pica', nombre: 'Pica', simbolo: '♠︎', color: 'negra' },
];

export const JOKER = 'JOKER';
const COPIAS_POR_CARTA = 2;
const MAX_JOKERS = 4;

const CARTAS_POR_TRIO = 3;
const CANTIDAD_DE_TRIOS = 3;
export const CARTAS_DEL_JUEGO = CARTAS_POR_TRIO * CANTIDAD_DE_TRIOS;

const ALIAS = {
  1: 'A',
  AS: 'A',
  11: 'J',
  12: 'Q',
  13: 'K',
  JK: JOKER,
  JOKER,
  COMODIN: JOKER,
};
export function normalizarNumero(texto) {
  const limpio = texto
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

  if (VALORES.includes(limpio)) return limpio;
  return ALIAS[limpio] ?? null;
}

export function esJoker(carta) {
  return carta.numero === JOKER;
}

export function buscarPinta(id) {
  return PINTAS.find((pinta) => pinta.id === id);
}

export function nombreCarta(carta) {
  if (esJoker(carta)) return 'Joker';
  return `${carta.numero} de ${buscarPinta(carta.pinta).nombre}`;
}
export function revisarLimite(cartasEnMesa, carta) {
  if (esJoker(carta)) {
    const jokers = cartasEnMesa.filter(esJoker).length;
    return jokers >= MAX_JOKERS
      ? `Ya están los ${MAX_JOKERS} jokers de las dos barajas en la mesa.`
      : null;
  }

  const copias = cartasEnMesa.filter(
    (otra) => otra.numero === carta.numero && otra.pinta === carta.pinta
  ).length;

  return copias >= COPIAS_POR_CARTA
    ? `Ya están las ${COPIAS_POR_CARTA} copias de ${nombreCarta(carta)} en la mesa.`
    : null;
}
export function validarTresTrios(cartas) {
  if (cartas.length !== CARTAS_DEL_JUEGO) {
    return {
      valido: false,
      trios: [],
      motivo: `Tres tríos usan exactamente ${CARTAS_DEL_JUEGO} cartas y en la mesa hay ${cartas.length}.`,
    };
  }

  const jokers = cartas.filter(esJoker);
  const porNumero = new Map();

  for (const carta of cartas) {
    if (esJoker(carta)) continue;
    porNumero.set(carta.numero, [...(porNumero.get(carta.numero) ?? []), carta]);
  }

  if (porNumero.size > CANTIDAD_DE_TRIOS) {
    return {
      valido: false,
      trios: [],
      motivo: `Hay ${porNumero.size} números distintos en la mesa y solo caben ${CANTIDAD_DE_TRIOS} tríos.`,
    };
  }

  for (const [numero, grupo] of porNumero) {
    if (grupo.length > CARTAS_POR_TRIO) {
      return {
        valido: false,
        trios: [],
        motivo: `Hay ${grupo.length} cartas de ${numero}: un trío usa ${CARTAS_POR_TRIO} y no se permiten dos tríos del mismo número.`,
      };
    }
  }

  const jokersLibres = [...jokers];
  const trios = [...porNumero.entries()]
    .sort(([a], [b]) => VALORES.indexOf(a) - VALORES.indexOf(b))
    .map(([, grupo]) => [
      ...grupo,
      ...jokersLibres.splice(0, CARTAS_POR_TRIO - grupo.length),
    ]);
  while (jokersLibres.length > 0) {
    trios.push(jokersLibres.splice(0, CARTAS_POR_TRIO));
  }

  return { valido: true, trios, motivo: null };
}

function posicionNumero(carta) {
  return esJoker(carta) ? VALORES.length : VALORES.indexOf(carta.numero);
}

function posicionPinta(carta) {
  return esJoker(carta)
    ? PINTAS.length
    : PINTAS.findIndex((pinta) => pinta.id === carta.pinta);
}

export function ordenarPorNumero(cartas) {
  return [...cartas].sort(
    (a, b) => posicionNumero(a) - posicionNumero(b) || posicionPinta(a) - posicionPinta(b)
  );
}

export function ordenarPorPinta(cartas) {
  return [...cartas].sort(
    (a, b) => posicionPinta(a) - posicionPinta(b) || posicionNumero(a) - posicionNumero(b)
  );
}
