import React from "react";
import '../../assets/styles/buttonPequenoNaranja.css';

function ButtonPequenoNaranja({descripcion, onClick}) { 
    return(
        <>
            <button onClick={onClick} className="button-pequeno-naranja">{descripcion}</button>
        </>
    );
}

export default ButtonPequenoNaranja;