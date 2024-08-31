import { useEffect } from "react";

function useClicAfuera(referencia, manejador) {
  useEffect(() => {
    const oyente = (evento) => {
      // Si se hace clic fuera del componente referenciado, ejecuta el manejador
      if (!referencia.current || referencia.current.contains(evento.target)) {
        return;
      }
      manejador(evento);
    };

    document.addEventListener("mousedown", oyente);
    return () => {
      document.removeEventListener("mousedown", oyente);
    };
  }, [referencia, manejador]);
}

export default useClicAfuera;
