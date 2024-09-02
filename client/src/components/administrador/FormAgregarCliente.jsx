import React, { useState } from "react";
import '../../assets/styles/formAgregarCliente.css';
import { validarNumerosYSimbolos, validarLongitudTexto, validarCorreo2, primeraLetraMayuscula } from '../../utils/utils';

function FormAgregarCliente({ solicitudPOST, onClick }) {
    const [errores, setErrores] = useState({});
    const [data, setData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        imagen: ''
    });

    const handleOnchange = (e) => {
        const { name, value } = e.target;

        if (name === 'nombre') {
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
            const primeraletra = primeraLetraMayuscula(value);
            setData({ ...data, [name]: primeraletra });
            return;
        }

        if (name === 'telefono' && value.length > 10) return;
        if (name === 'correo' && validarLongitudTexto(value, 100)) return;
        if (name === 'direccion' && validarLongitudTexto(value, 30)) return;

        setData({ ...data, [name]: value });
    };

    const handleFileOnchange = (e) => {
        const { name, files } = e.target;
        setData({ ...data, [name]: files[0] });
    };

    const validacion = () => {
        let mensajesError = {};

        if (!data.nombre) {
            mensajesError.nombre = 'El nombre es obligatorio';
        }

        if (!data.correo) {
            mensajesError.correo = 'El correo es obligatorio';
        } else if (!validarCorreo2(data.correo)) {
            mensajesError.correo = 'El formato del correo es incorrecto';
        }

        setErrores(mensajesError);

        // Retorna true si no hay errores
        return Object.keys(mensajesError).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validacion()) {
            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('correo', data.correo);
            formData.append('telefono', data.telefono);
            formData.append('direccion', data.direccion);
            formData.append('imagen', data.imagen);

            solicitudPOST(formData);
        }
    };

    return (
        <form className="form-agregar-cliente" onSubmit={handleSubmit}>
            <h3 className="titulo-form-agregar-cliente">Añadir cliente</h3>
            <label htmlFor="nombre" className="label-form-agregar-cliente">Nombre:</label>
            <input
                type="text"
                name="nombre"
                className="input-form-agregar-cliente"
                onChange={handleOnchange}
                value={data.nombre}
            />
            {errores.nombre && (
                <p className="mensaje-error">{errores.nombre}</p>
            )}

            <label htmlFor="correo" className="label-form-agregar-cliente">Correo:</label>
            <input
                type="text"
                name="correo"
                className="input-form-agregar-cliente"
                onChange={handleOnchange}
                value={data.correo}
            />
            {errores.correo && (
                <p className="mensaje-error">{errores.correo}</p>
            )}

            <label htmlFor="telefono" className="label-form-agregar-cliente">Teléfono:</label>
            <input
                type="number"
                name="telefono"
                className="input-form-agregar-cliente"
                onChange={handleOnchange}
                value={data.telefono}
            />

            <label htmlFor="direccion" className="label-form-agregar-cliente">Dirección:</label>
            <input
                type="text"
                name="direccion"
                className="input-form-agregar-cliente"
                value={data.direccion}
                onChange={handleOnchange}
            />

            <label htmlFor="imagen" className="label-form-agregar-cliente">Imagen:</label>
            <input
                type="file"
                name="imagen"
                className="input-file-form-agregar-cliente"
                onChange={handleFileOnchange}
            />

            <div className="contenedor-botones-form-agregar-cliente">
            <input 
                type="submit" 
                className="boton-form-agregar-cliente" 
                value={'Añadir'}/>
            <button className="boton-cancelar-agregar-cliente" onClick={onClick}>Cancelar</button>
            </div>
        </form>
    );
}

export default FormAgregarCliente;
