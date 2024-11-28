import { useState, useEffect } from 'react';

const useEfectoEscritura = (texto, velocidad = 50) => {
  const [textoMostrado, setTextoMostrado] = useState('');
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (indice < texto.length) {
      const temporizador = setTimeout(() => {
        setTextoMostrado((textoActual) => textoActual + texto[indice]);
        setIndice((indiceActual) => indiceActual + 1);
      }, velocidad);

      return () => clearTimeout(temporizador);
    }
  }, [texto, indice, velocidad]);

  return textoMostrado;
};

export default useEfectoEscritura;