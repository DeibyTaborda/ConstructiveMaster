import React, { useEffect, useContext, useState } from "react";
import '../../assets/styles/inicioSesion.css';
import Menu from "../../components/general/Menu";
import SubmitButton from "../../components/general/SubmitButton";
import usePostRequestJson from "../../services/usePostRequestJson";
import { useNavigate } from 'react-router-dom';
import { UsuarioContexto } from "../../context/UsuarioContexto";

function InicioSesion() {
    const [datos, setDatos] = useState({
        correo: '',
        contrasena: '',
    });

    const [errores, setErrores] = useState({
        correo: '',
        contrasena: '',
    });

    const [mensaje, setMensaje] = useState(''); // Para manejar el mensaje de error o éxito
    const { usuario, actualizarUsuario } = useContext(UsuarioContexto);
    const navigate = useNavigate();
    const { loading, error, response, postRequestJson } = usePostRequestJson('http://localhost:3001/login');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
        setErrores({ ...errores, [name]: '' });
        setMensaje(''); // Limpiar mensaje cuando el usuario empiece a escribir
    };

    const validarFormulario = () => {
        let erroresTemp = {};
        let isValid = true;

        if (!datos.correo) {
            erroresTemp.correo = 'El campo correo es obligatorio';
            isValid = false;
        }

        if (!datos.contrasena) {
            erroresTemp.contrasena = 'El campo contraseña es obligatorio';
            isValid = false;
        } else if (datos.contrasena.length > 20) {
            erroresTemp.contrasena = 'La contraseña no debe exceder los 20 caracteres';
            isValid = false;
        }

        setErrores(erroresTemp);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            const result = await postRequestJson(datos);
            if (result) {
                setMensaje('Inicio de sesión exitoso'); // Mensaje de éxito si la solicitud fue exitosa
            }
        }
    };

    useEffect(() => {
        if (response) {
            actualizarUsuario({ ...usuario, ...response });
            const rol = response.rol;
            localStorage.setItem('token', response.token);

            switch (rol) {
                case 'cliente':
                case 'profesional':
                    navigate('/');
                    break;
                case 'admin':
                case 'super_admin':
                    navigate('/panel_de_control');
                    break;
                default:
                    navigate('/');
            }
        }

        if (error) {
            setMensaje(error); // Mensaje de error si ocurre un problema
        }
    }, [response, error]);

    return (
        <>
            <Menu />
            <section className="section-login-form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">Ingresar</h1>
                    
                    {mensaje && (
                        <p 
                            style={{ 
                                color: error ? 'red' : 'green', 
                                fontWeight: 'bold', 
                                fontSize: '0.8rem',
                                margin: '10px 0',
                                textAlign: 'center' 
                            }}
                        >
                            {mensaje}
                        </p>
                    )}
                    
                    <label htmlFor="correo" className="label-login-form">Correo:</label>
                    <input 
                        type="email" 
                        name="correo" 
                        id="correo" 
                        className="input-login-form" 
                        value={datos.correo}
                        onChange={handleChange}
                    />
                    {errores.correo && <p className="error">{errores.correo}</p>}

                    <label htmlFor="contrasena" className="label-login-form">Contraseña:</label>
                    <input 
                        type="password" 
                        name="contrasena" 
                        id="contrasena" 
                        className="input-login-form" 
                        value={datos.contrasena}
                        onChange={handleChange}
                    />
                    {errores.contrasena && <p className="error">{errores.contrasena}</p>}

                    <SubmitButton id='submit-boton' />
                </form>
            </section>
        </>
    );
}

export default InicioSesion;
