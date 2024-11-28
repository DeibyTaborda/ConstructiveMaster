import React, { useState } from "react";
import '../../assets/styles/formAgregarAdmin.css';
import '../../assets/styles/forms.css';
import usePostRequestJson from "../../services/usePostRequestJson";
import { validarNumerosYSimbolos, validarLongitudTexto, validarCorreo } from "../../utils/utils";
import { useAccionExitosa } from "../../hooks/useAccionExitosa";

function FormAgregarAdmin() {
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        correo: ''
    });

    const {accionRealizada, realizarAccion} = useAccionExitosa(2000);

    const [errores, setErrores] = useState({});
    const { error, response, loading, postRequestJson } = usePostRequestJson('http://localhost:3001/agregar/admin');

    const validacion = () => {
        let mensajesError = {};
        if (!data.nombre) mensajesError.nombre = 'El nombre es obligatorio';
        if (!data.apellido) mensajesError.apellido = 'El apellido es obligatorio';
        if (!data.correo) mensajesError.correo = 'El correo es obligatorio';
        if (data.correo) {
            if (validarCorreo(data.correo)) mensajesError.correo = 'Por favor, introduce un correo electrónico válido.';
        }

        return mensajesError;
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        if (['nombre', 'apellido'].includes(name)) {
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
        } else if (name === 'correo') {
            if (validarLongitudTexto(value, 60)) return;
        }

        setData({ ...data, [name]: value });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const validacionErrores = validacion();
        if (Object.keys(validacionErrores).length === 0) {
            await postRequestJson(data);
            realizarAccion();
            setErrores({});
            setData({
                nombre: '',
                apellido: '',
                correo: ''
            });
        } else {
            setErrores(validacionErrores);
        }
    }

    if (loading) return <p>Enviando...</p>

    return (
        <form onSubmit={handleSubmit} className="form-agregar-admin">
            <label htmlFor="nombre" className="label-form-agregar-admin">Nombre</label>
            <input
                type="text"
                name="nombre"
                className="input-form-agregar-admin"
                onChange={handleOnChange}
                value={data.nombre}
                placeholder="Nombre"
            />
            <label htmlFor="apellido" className="label-form-agregar-admin">Apellido</label>
            <input
                type="text"
                name="apellido"
                className="input-form-agregar-admin"
                onChange={handleOnChange}
                value={data.apellido}
                placeholder="Apellido"
            />
            <label htmlFor="correo" className="label-form-agregar-admin">Correo</label>
            <input
                type="email"
                name="correo"
                className="input-form-agregar-admin"
                onChange={handleOnChange}
                value={data.correo}
                placeholder="Correo electrónico"
            />
            <button type="submit" className="submit-button-form-agregar-admin">Enviar</button>
            {errores && (
                <div className="error-messages">
                    {errores.nombre && <p className="error-message">{errores.nombre}</p>}
                    {errores.apellido && <p className="error-message">{errores.apellido}</p>}
                    {errores.correo && <p className="error-message">{errores.correo}</p>}
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
            {accionRealizada && <p className="response-message">{response}</p>}
        </form>
    );
}

export default FormAgregarAdmin;
