import React from "react";
import '../../assets/styles/cartaSubcategoria.css';

function CartaSubcategoria({subcategoria, imagen, onClick}) {

    return (
        <div className="card" onClick={onClick}>
            <img src={imagen ? `http://localhost:3001/${imagen}` : '/iconoImagen.png'} alt={subcategoria} className="card-image" />
            <div className="card-name">
                {subcategoria}
            </div>
        </div>
    );
}

export default CartaSubcategoria;