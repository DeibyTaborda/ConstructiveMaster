import React, { useEffect, useState } from "react";
import { longitudMaxima, longitudMinima } from "../../utils/utils";
import usePostRequestJson from "../../services/usePostRequestJson";
import '../../assets/styles/formularioContrasena.css';
import { useNavigate } from "react-router-dom";

function FormCambiarContasena() {
    const [data, setData] = useState({
        nuevaContrasena: '',
        contrasenaActual: ''
    });

    const [errores, setErrores] = useState(null);
    const [respuestaExitosa, setRespuestasExitosas] = useState('');
    const navigate = useNavigate();

    const {loading, error, response, postRequestJson} = usePostRequestJson('http://localhost:3001/cambiar-contrasena');

    const eliminarError = (name) => {
        setErrores({...errores, [name]: ''});
    }

    const handleOnchange = (e) => {
        const {name, value} = e.target;
        eliminarError(name);
        const longitudValor = longitudMaxima(value, 20);
        if (longitudValor) return;
        setData({...data, [name] : value});
    }

    const validacion = (data) => {
        const errores = {};
        if (!data.nuevaContrasena && !data.contrasenaActual) errores.errorGeneral = 'Por favor, ingresa la contraseña actual y una nueva contraseña';
        if (!data.nuevaContrasena) errores.nuevaContrasena = 'Por favor, ingresa la contraseña actual';
        if (!data.contrasenaActual) errores.contrasenaActual = 'Por favor, ingrese una nueva contraseña';
        if(data.nuevaContrasena.length > 0 && longitudMinima(data.nuevaContrasena, 8)) errores.nuevaContrasena = 'La contraseña debe contener minimo 8 caracteres';
        if(data.contrasenaActual.length > 0 && longitudMinima(data.contrasenaActual, 8)) errores.contrasenaActual = 'La contraseña debe contener minimo 8 caracteres';
        if(longitudMaxima(data.nuevaContrasena, 20)) errores.nuevaContrasena = 'La contraseña no debe tener más de 20 caracteres';
        if (longitudMaxima(data.contrasenaActual, 20)) errores.contrasenaActual = 'La contraseña no debe tener más de 20 caracteres';
        return errores;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrores('');
        setRespuestasExitosas('');
        const contrasenasValidadas = validacion(data);
        if (Object.values(contrasenasValidadas).length > 0) {
            setErrores(contrasenasValidadas);
        } else {
            postRequestJson(data);
            setData({
                nuevaContrasena: '',
                contrasenaActual: ''
            })
        }
    }

    useEffect(() => {
        if (response || error) {
            setRespuestasExitosas(response || null);
            setErrores(error || null)
            setTimeout(() => {
                setRespuestasExitosas('');
                localStorage.clear();
                navigate('/login')
            }, 2000);
            
        }
    }, [response, error]);

    return(
        <form onSubmit={handleSubmit} className="formulario-cambiar-contrasena">
            <p className="error-formulario">{typeof errores === 'string' ? errores : ''}</p>
            <label htmlFor="nuevaContrasena" className="etiqueta-formulario-cambiar-contrasena">Contraseña nueva:</label>
            <input
                type="password" 
                name="nuevaContrasena" 
                id="nuevaContrasena"  
                onChange={handleOnchange}
                value={data.nuevaContrasena}
                className="campo-formulario-cambiar-contrasena"
            />
            {errores?.nuevaContrasena && <p className="error-formulario">{errores.nuevaContrasena}</p>}

            <label htmlFor="contrasenaActual" className="etiqueta-formulario-cambiar-contrasena">Contraseña actual:</label>
            <input
                type="password" 
                name="contrasenaActual" 
                id="contrasenaActual"  
                onChange={handleOnchange}
                value={data.contrasenaActual}
                className="campo-formulario-cambiar-contrasena"
            />
            {errores?.contrasenaActual && <p className="error-formulario">{errores.contrasenaActual}</p>}
            {respuestaExitosa && <p className="mensaje-exitoso">{respuestaExitosa}</p>}

            <input type="submit" className="boton-submit" value="Cambiar contraseña" />
        </form>
    );
}

export default FormCambiarContasena;