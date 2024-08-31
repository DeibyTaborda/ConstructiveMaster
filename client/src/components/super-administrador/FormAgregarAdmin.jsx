import React, {useState} from "react";
import '../../assets/styles/formAgregarAdmin.css';
import usePostRequestJson from "../../services/usePostRequestJson";
import { validarNumerosYSimbolos, validarLongitudTexto, validarCorreo } from "../../utils/utils";

function FormAgregarAdmin() {
    // Estado de los campos del formulario
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        correo: ''
    });

    // 
    const [errores, setErrores] = useState({});

    // Realiza la solicitud POST a la url proporcionada
    const {error, response, loading, postRequestJson} = usePostRequestJson('http://localhost:3001/agregar/admin');

    // validación que se ejecuta cuando se envía el formulario
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

    // Se maneja las entradas de los eventos que ocurren en cada campo del formulario
    const handleOnchange = (e) => {
        const { name, value } = e.target;
    
        if (['nombre', 'apellido'].includes(name)) {
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
        } else if (name === 'correo') {
            if (validarLongitudTexto(value, 60)) return;
        }
    
        setData({ ...data, [name]: value });
    }


    // Función que se ejecuta cuando se envía el formulairo
    const handleSubmit = async(e) => {
        e.preventDefault();

        const validacionErrores = validacion();
        if (Object.keys(validacionErrores).length === 0) {
            await postRequestJson(data);
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


    return(
        <>
            <form onSubmit={handleSubmit} className="form-agregar-admin">
                <label htmlFor="nombre" className="label-agregar-admin">Nombre</label>
                <input 
                    type="text" 
                    name="nombre" 
                    className="input-agregar-admin" 
                    onChange={handleOnchange}
                    value={data.nombre}
                />
                <label htmlFor="apellido" className="label-agregar-admin">Apellido</label>
                <input 
                    type="text" 
                    name="apellido" 
                    className="input-agregar-admin" 
                    onChange={handleOnchange}
                    value={data.apellido}
                />
                <label htmlFor="correo" className="label-agregar-admin">Correo:</label>
                <input 
                    type="email" 
                    name="correo"
                    className="input-agregar-admin"
                    onChange={handleOnchange}
                    value={data.correo}
                />
                <input type="submit" />
                {errores && (
                <div>
                <p>{errores.nombre}</p>
                <p>{errores.apellido}</p>
                <p>{errores.correo}</p>
                </div>
            )}
            {error && (
                <p>{error}</p>
            )}
            {response && (
                <p>{response}</p>
            )}
            </form>

        </>
    );
}

export default FormAgregarAdmin;