import { useState } from "react";

export const useAccionExitosa = (duracion = 3000) => {
    const [accionRealizada, setAccionRealizada] = useState(false);

    const realizarAccion = () => {

        setAccionRealizada(true);

        setTimeout(() => setAccionRealizada(false), duracion);
    };

    return { accionRealizada, realizarAccion };
};
