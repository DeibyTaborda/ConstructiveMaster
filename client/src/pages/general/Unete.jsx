import React, { useEffect, useState } from "react";
import '../../assets/styles/unete.css';
import Menu from "../../components/general/Menu";
import Footer from "../../components/general/footer";
import SubmitButton from "../../components/general/SubmitButton";
import useAxios from "../../services/api";
import axios from "axios";
import MensajeExito from "../../components/general/MensajeExitoso";
import TarjetaError from "../../components/general/TarjetaError";
import { validarNumerosYSimbolos, validarLongitudTexto } from '../../utils/utils';

function Unete() {
    const [errores, setErrores] = useState('');
    const [mostrarError, setMostrarError] = useState(false);
    const [envioFormulario, setEnvioFormulario] = useState(false);
    const [respuestaExitosa, setRespuestaExitosa] = useState('');
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        especialidad: '',
        correo: '',
        telefono: '',
        curriculum: ''
    });

    const [errors, setErrors] = useState({});
    const [response, setResponse] = useState(null);
    const [errorPost, setErrorPost] = useState(null);

    const { loading, error, data, fetchData } = useAxios('http://localhost:3001/subcategorias');

    const eliminarError = (name) => {
        setErrors({...errors, [name] : ''});
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        eliminarError(name);
        if (name === 'nombre' && value.length > 30) return;
        if (name === 'apellido' && value.length > 30) return;
        if (name === 'telefono' && value.length > 10) return;
        setDatos({ ...datos, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDatos({ ...datos, [name]: files[0] });
    };
    
    const mostrarMensajeExitoso = (mensaje) => {
        setRespuestaExitosa(mensaje);
        setEnvioFormulario(true);

        setTimeout(() => {
            setEnvioFormulario(false);
        }, 3000);
    };

    const mostrarMensajeError = (mensaje) => {
        setErrores(mensaje);
        setMostrarError(true);

        setTimeout(() => {
            setMostrarError(false);
        }, 3000);
    };
        
    const validateForm = () => {
        const newErrors = {};

        if (!datos.nombre) {
            newErrors.nombre = "El nombre es obligatorio";
        } else if (validarNumerosYSimbolos(datos.nombre)) {
            newErrors.nombre = "El nombre no debe contener números ni símbolos";
        }

        if (!datos.apellido) {
            newErrors.apellido = "El apellido es obligatorio";
        } else if (validarNumerosYSimbolos(datos.apellido)) {
            newErrors.apellido = "El apellido no debe contener números ni símbolos";
        }

        if (datos.especialidad === "seleccionar" || !datos.especialidad) {
            newErrors.especialidad = "Debe seleccionar una especialidad";
        }

        if (!datos.correo) {
            newErrors.correo = "El correo es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(datos.correo)) {
            newErrors.correo = "Correo no válido";
        }

        if (!datos.telefono) {
            newErrors.telefono = "El teléfono es obligatorio";
        } else if (!/^\d{10}$/.test(datos.telefono)) {
            newErrors.telefono = "El teléfono debe tener 10 dígitos";
        }

        if (!datos.curriculum) {
            newErrors.curriculum = "Debe adjuntar su currículum";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setErrorPost(null);
        setResponse(null);

        const formData = new FormData();
        Object.keys(datos).forEach(key => {
            formData.append(key, datos[key]);
        });

        try {
            const response = await axios.post('http://localhost:3001/unete', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(response.data.message);
            mostrarMensajeExitoso(response.data.message);
        } catch (error) {
            setErrorPost(error.response?.data.message);
            mostrarMensajeError(error.response?.data.message);
        }

        setDatos({
            nombre: '',
            apellido: '',
            especialidad: '',
            correo: '',
            telefono: '',
            curriculum: ''
        });
    };

    return (
        <>
            <Menu />
            <section className={`section-register-form-unete ${data && data.length === 0 ? 'gradiente' : ''}`}>
                {data && data.length > 0 ? (
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
                     {errors.nombre && <p className="error-mensaje">{errors.nombre}</p>}
 
                     <label htmlFor="apellido" className="label-login-form">Apellido:</label>
                     <input
                         type="text"
                         name="apellido"
                         id="apellido"
                         className="input-login-form"
                         value={datos.apellido}
                         onChange={handleChange}
                     />
                     {errors.apellido && <p className="error-mensaje">{errors.apellido}</p>}
 
                     <label htmlFor="especialidad" className="label-login-form">Especialidad:</label>
                     <select name="especialidad" value={datos.especialidad} onChange={handleChange}>
                         <option value="seleccionar">Seleccionar</option>
                         {data && data.map((subcategoria, index) => (
                             <option key={index} value={subcategoria.id}>{subcategoria.subcategoria}</option>
                         ))}
                     </select>
                     {errors.especialidad && <p className="error-mensaje">{errors.especialidad}</p>}
 
                     <label htmlFor="correo" className="label-login-form">Correo:</label>
                     <input
                         type="email"
                         name="correo"
                         id="correo"
                         className="input-login-form"
                         value={datos.correo}
                         onChange={handleChange}
                     />
                     {errors.correo && <p className="error-mensaje">{errors.correo}</p>}
 
                     <label htmlFor="telefono" className="label-login-form">Teléfono:</label>
                     <input
                         type="number"
                         name="telefono"
                         id="telefono"
                         className="input-login-form"
                         value={datos.telefono}
                         onChange={handleChange}
                     />
                     {errors.telefono && <p className="error-mensaje">{errors.telefono}</p>}
 
                     <label htmlFor="curriculum" className="label-login-form">Hoja de vida:</label>
                     <input
                         type="file"
                         name="curriculum"
                         accept=".pdf,.doc,.docx"
                         id="curriculum"
                         onChange={handleFileChange}
                     />
                     {errors.curriculum && <p className="error-mensaje">{errors.curriculum}</p>}
 
                     <SubmitButton id='submit-boton' />
                 </form>
                ) : (
                    <div className="contenedor-sin-especialidades">
                        <img src="interrogacion.png" alt="" />
                        <p className="sitio-sin-especialidades">Esta sección no esta disponible a causa de que no hay espealidades disponibles</p>
                    </div>
                )}
               

                {envioFormulario && (
                <MensajeExito 
                    mensaje={respuestaExitosa}
                    style={{position: 'fixed', top: '50%', left:'50%', margin: '0 auto', transform: 'translate(-50%, -50%)'}}
                />
                 )}

                {mostrarError && (
                    <TarjetaError 
                        mensajeError={errores}
                    />
                )}
            </section>
            <Footer />

        </>
    );
}

export default Unete;
