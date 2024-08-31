import React, { useEffect, useContext } from "react";
import '../../assets/styles/inicioSesion.css'
import Menu from "../../components/general/menu";
import Footer from "../../components/general/footer";
import SubmitButton from "../../components/general/SubmitButton";
import { useState } from "react";
import axios from 'axios';
import usePostRequestJson from "../../services/usePostRequestJson";
import { useNavigate } from 'react-router-dom';
import { UsuarioContexto } from "../../context/UsuarioContexto";

function InicioSesion(){
    const [datos, setDatos] = useState({
        correo: '',
        contrasena: '',
    });

    const { usuario, actualizarUsuario, limpiarUsuario } = useContext(UsuarioContexto);

    const navigate = useNavigate();

    const {loading, error, response, postRequestJson} = usePostRequestJson('http://localhost:3001/login');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDatos({...datos, [name] : value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await postRequestJson(datos);
    }

    useEffect(() => {
        if (response) {
            actualizarUsuario(response);
            console.log(response.token);
            const rol = response.rol;
            localStorage.setItem('token', response.token);
    
            switch (rol) {
                case 'cliente':
                    navigate('/');
                    break;
                case 'profesional':
                    navigate('/');
                    break;
                case 'admin':
                    navigate('/panel_de_control')
                    break;
                case 'super_admin':
                    navigate('/panel_de_control');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [response])


    return(
        <>
            <Menu/>
            <section className="section-login-form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">Ingresar</h1>
                    <label htmlFor="correo" className="label-login-form">Correo:</label>
                    <input 
                        type="email" 
                        name="correo" 
                        id="correo" 
                        className="input-login-form" 
                        value={datos.correo}
                        onChange={handleChange}
                    />
                    <label htmlFor="contrasena" className="label-login-form">Contraseña:</label>
                    <input 
                        type="password" 
                        name="contrasena" 
                        id="contrasena"  
                        className="input-login-form" 
                        value={datos.contrasena}
                        onChange={handleChange}
                    />
                    <SubmitButton id='submit-boton'/>
                </form>
            </section>
            <Footer/>
        </>
    );
}

export default InicioSesion;