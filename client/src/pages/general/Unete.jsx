import React from "react";
import { useState } from "react";
import '../../assets/styles/unete.css';
import Menu from "../../components/general/menu";
import Footer from "../../components/general/footer";
import SubmitButton from "../../components/general/SubmitButton";
import useAxios from "../../services/api";
import axios from "axios";
import {validarNumerosYSimbolos, validarLongitudTexto} from '../../utils/utils'

function Unete(){
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        especialidad: '',
        correo: '',
        telefono: '',
        curriculum: ''
    });

    const [response, setResponse] = useState(null);
    const [errorPost, setErrorPost] = useState(null);

    const {loading, error, data, fetchData} = useAxios('http://localhost:3001/unete');

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(['nombre', 'apellido'].includes(name)){
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
        }

        if (name === 'correo') {
            if (validarLongitudTexto(value, 100)) return;
        }

        if (name === 'telefono') {
            if (validarLongitudTexto(value, 10)) return;
        }

        setDatos({...datos, [name] : value});
    }

    const handleFileChange = (e) => {
        const {name, files} = e.target;
        setDatos({...datos, [name] : files[0]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errorPost) setErrorPost('');
        if (response) setResponse('');

        const formData = new FormData();
        
        Object.keys(datos).forEach(key => {
            formData.append(key, datos[key]);
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });


        try {
            const response = await axios.post('http://localhost:3001/unete', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(response.data.message);
        } catch (error) {
            setErrorPost(error.response?.data.message);
        }

        setDatos({
            nombre: '',
            apellido: '',
            especialidad: '',
            correo: '',
            telefono: '',
            curriculum: ''
        });
    }

    return(
    <>
        <Menu/>
        <section className="section-register-form-unete">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">Unirme como profesional</h1>
                    <label htmlFor="nombre" className="label-login-form">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="input-login-form"
                        value={datos.nombre}
                        onChange={handleChange}
                    />                
                    <label htmlFor="apellido" className="label-login-form">Apellido:</label>
                    <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        className="input-login-form"
                        value={datos.apellido}
                        onChange={handleChange}

                    />
                    <label htmlFor="especialidad" className="label-login-form">Especialidad:</label>
                    <select name="especialidad" value={datos.especialidad} onChange={handleChange}>
                        <option value="seleccionar">Seleccionar</option>
                        {data && data.map((subcategoria, index) => (
                            <option key={index} value={subcategoria.subcategoria}>{subcategoria.subcategoria}</option>
                        ))};
                    </select>
                    <label htmlFor="correo" className="label-login-form">Correo:</label>
                    <input
                        type="email"
                        name="correo"
                        id="correo"
                        className="input-login-form"
                        value={datos.correo}
                        onChange={handleChange}
                    /> 
                    <label htmlFor="telefono" className="label-login-form">Teléfono:</label>
                    <input
                        type="number"
                        name="telefono"
                        id="telefono"
                        className="input-login-form"
                        value={datos.telefono}
                        onChange={handleChange}
                    />                  
                    <label htmlFor="curriculum" className="label-login-form">Hoja de vida:</label>
                    <input
                        type="file"
                        name="curriculum"
                        accept=".pdf,.doc,.docx"
                        id="curriculum"
                        onChange={handleFileChange}
                    />
                    <SubmitButton id='submit-boton' />
                </form>
                {response && (
                    <p>{response}</p>
                )}
                {errorPost && (
                    <p>{errorPost}</p>
                )}
            </section>
        <Footer/>
    </>
    );
}

export default Unete;