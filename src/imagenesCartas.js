import { esJoker } from './logic/carioca';

const IMAGENES_JOKER = [
  'https://balatrowiki.org/images/Mr._Bones.png',
  'https://balatrowiki.org/images/Blueprint.png',
  'https://balatrowiki.org/images/Throwback.png',
  'https://balatrowiki.org/images/Brainstorm.png',
];

const NOMBRE_NUMERO = { A: 'Ace', J: 'Jack', Q: 'Queen', K: 'King' };

const NOMBRE_PINTA = {
  diamante: 'Diamonds',
  corazon: 'Hearts',
  trebol: 'Clubs',
  pica: 'Spades',
};

export function elegirImagenJoker(cartas) {
  const enUso = cartas.map((carta) => carta.imagenJoker);
  const libres = IMAGENES_JOKER.filter((imagen) => !enUso.includes(imagen));

  return libres[Math.floor(Math.random() * libres.length)];
}

export function imagenDeCarta(carta) {
  if (esJoker(carta)) return carta.imagenJoker;

  const numero = NOMBRE_NUMERO[carta.numero] ?? carta.numero;
  const archivo = `${numero}_of_${NOMBRE_PINTA[carta.pinta]}.png`;

  return `https://balatrowiki.org/images/thumb/${archivo}/134px-${archivo}`;
}
