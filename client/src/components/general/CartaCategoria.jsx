import React from "react";
import '../../assets/styles/cartaCategoria.css';

function CartaCategoria({ categoria, imagen, alt, onClick }) {
    return(
        <div className="contenedor-carta-categoria" onClick={onClick}>
            <div className="imagen-categoria">
                <img src={imagen ? `http://localhost:3001/${imagen}` : '/iconoImagen.png'} alt={alt} />
                <h2 className="nombre-categoria">{categoria}</h2>
            </div>
        </div>
    );
}

export default CartaCategoria;
