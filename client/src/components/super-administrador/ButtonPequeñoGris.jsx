import React from "react";
import '../../assets/styles/buttonPequenoGris.css';

function ButtonPequenoGris({descripcion, onClick}) {
    return(
        <>
            <button onClick={onClick} className="button-pequeno-gris">{descripcion}</button>
        </>
    );
}

export default ButtonPequenoGris;