import React from "react";

function FormAddAdmin() {
    return(
        <>
            <form action="">
                <label htmlFor="nombre">Nombre:</label>
                <input 
                    type="text" 
                    name="nombre" 
                    className="input-form-add-admin" 
                />
                <label htmlFor="apellido">Apellido:</label>
                <input 
                    type="text"
                    name="apellido"
                    className="input-form-add-admin"
                />
                <label htmlFor="correo">Correo:</label>
                <input 
                    type="email"
                    name="correo"
                    className="input-form-add-admin" 
                />
                <label htmlFor="telefono">Teléfono:</label>
                <input 
                    type="number" 
                    name="telefono"
                    className="input-form-add-admin"
                />
            </form>
            
        </>
    );
}

export default FormAddAdmin;