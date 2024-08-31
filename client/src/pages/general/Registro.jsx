import React, { useState } from "react";
import '../../assets/styles/registro.css';
import Menu from "../../components/general/menu";
import SubmitButton from "../../components/general/SubmitButton";
import Footer from "../../components/general/footer";
import axios from 'axios';
import { validarNombre, validarLongitudCorreo, validarContrasena} from "../../utils/utils";

function Registro() {
    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmContrasena: ''
    });

    const [errores, setErrores] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmContrasena: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch(name){
            case 'nombre':
                error = validarNombre(value);
                break;
            case 'correo':
                error = validarLongitudCorreo(value);
                break;
            case 'contrasena':
                error = validarContrasena(value);
                break;
            case 'confirmContrasena':
                error = validarContrasena(value);
                break;
        }

        if (error === '') {
            setDatos({ ...datos, [name]: value });
          }
          setErrores({ ...errores, [name]: error });
    };


    const handleSubmit = async (e) => {
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        e.preventDefault();

        if(datos.contrasena. length < 8){
            setErrores({ ...errores, contrasena: 'La contraseña debe ser de al menos 8 caracteres'});
        }
        
        if(datos.confirmContrasena !== datos.contrasena){
            return setErrores({ ...errores, confirmContrasena: 'Las contraseñas no coinciden'});
        }

        if (!regexCorreo.test(datos.correo)){
            return setErrores({ ...errores, correo : 'El correo no es válido'});
        }

        try {
            const response = await axios.post('http://localhost:3001/registro', datos);
            console.log('Los datos se enviaron de manera exitosa');

            setDatos({
                nombre : '',
                correo : '',
                contrasena : '',
                confirmContrasena : ''
            });

        } catch (error) {
            console.error('Error en enviar los datos', error);
            alert('Error en enviar los datos');
        }
    };

    return (
        <>
            <Menu />
            <section className="section-register-form">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">Registro</h1>
                    <label htmlFor="nombre" className="label-login-form">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="input-login-form"
                        onChange={handleChange}
                        value={datos.nombre}
                    />
                    {errores.nombre ? <p className="error">{errores.nombre}</p> : ''}
                    
                    <label htmlFor="correo" className="label-login-form">Correo:</label>
                    <input
                        type="email"
                        name="correo"
                        id="correo"
                        className="input-login-form"
                        onChange={handleChange}
                        value={datos.correo}
                    />
                    {errores.correo ? <p className="error">{errores.correo}</p> : ''}
                    
                    <label htmlFor="contrasena" className="label-login-form">Contraseña:</label>
                    <input
                        type="password"
                        name="contrasena"
                        id="contrasena"
                        className="input-login-form"
                        onChange={handleChange}
                        value={datos.contrasena}
                    />
                    {errores.contrasena && <p className="error">{errores.contrasena}</p>}
                    
                    <label htmlFor="confirmContrasena" className="label-login-form">Confirmar contraseña:</label>
                    <input
                        type="password"
                        name="confirmContrasena"
                        id="confirmContrasena"
                        className="input-login-form"
                        onChange={handleChange}
                        value={datos.confirmContrasena}
                    />
                    {errores.confirmContrasena && <p className="error">{errores.confirmContrasena}</p>}
                    
                    <SubmitButton id='submit-boton'  value={'Registrarse'}/>
                </form>
            </section>
            <Footer />
        </>
    );
}

export default Registro;
