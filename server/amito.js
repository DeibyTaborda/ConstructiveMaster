const primeraLetraMayusculas = (texto) => {
    const palabras = texto.split(' ');

    const palabrasConPrimeraLetraMayuscula = palabras.map(palabra => {
        const primeraLetra = palabra.charAt(0).toUpperCase();
        const restoDeLaPalabra = palabra.slice(1);
        return primeraLetra + restoDeLaPalabra;
    });
    
    return palabrasConPrimeraLetraMayuscula.join(' ');
}

const resultado = primeraLetraMayusculas('James anoto un golazo');
console.log(resultado);