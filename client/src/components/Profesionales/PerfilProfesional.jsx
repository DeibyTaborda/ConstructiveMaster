import React, { useEffect, useState } from "react";
import '../../assets/styles/perfilProfesional.css';
import TarjetaDatoProfesional from "./TarjetaDatoProfesional";
import useAxios from "../../services/api";
import { useNavigate } from 'react-router-dom'
import TarjetaError from "../general/TarjetaError";

function PerfilProfesional({cambioProfesional, cambiarValor}) {
    const [errores, setErrores] = useState('');
    const [mostrarError, setMostrarError] = useState(false);
    const [datosPerfilProfesional, setDatosPerfilProfesional] = useState([]);
    const { loading, error, response, data, fetchData } = useAxios(`http://localhost:3001/campos_personalizados-profesional/${datosPerfilProfesional.id}`);
    const { loading: loadingImagenes, error: errorImagenes, response: responseImagenes, data: dataImagenes, fetchData: fetchDataImagenes } = useAxios(`http://localhost:3001/imagenes/profesionales/${datosPerfilProfesional.id}`);
    const navigate = useNavigate();

    const obtenerDatosProfesionalConsultado = () => {
        const datos = localStorage.getItem('profesional_consultado');
        try {
            const datosProfesionalConsultado = JSON.parse(datos);
            return datosProfesionalConsultado;
        } catch (error) {
            mostrarMensajeDeError('Error inesparado, por favor, intentálo más tarde');
            return null;
        }
    };

    const mostrarMensajeDeError = (mensajeError) => {
        setErrores(mensajeError);
        setMostrarError(true);

        setTimeout(() => {
            setMostrarError(false);
        }, 3000);
    };

    const obtenerDatosProfesionalAContratar = () => {
        if (localStorage.getItem('token')) {
            const profesionalSeleccionado = localStorage.getItem('profesional_consultado');
            localStorage.setItem('profesionalAContratar', profesionalSeleccionado);
           return navigate('/solicitud/trabajo');
        }
        return navigate('/login');
    }

    const datosProfesional = obtenerDatosProfesionalConsultado();

    useEffect(() => {
        setDatosPerfilProfesional(datosProfesional || {});
    }, []);

    useEffect(() => {
        if (datosPerfilProfesional.id || datosPerfilProfesional) {
            fetchData();
            fetchDataImagenes();
        }
    }, [datosPerfilProfesional]);

    useEffect(() => {
        if (cambioProfesional) {
            setDatosPerfilProfesional(datosProfesional);
            cambiarValor();
        }
    }, [cambioProfesional]);

    useEffect(() => {
        if (dataImagenes) {
            console.log(dataImagenes);
        }
    }, [dataImagenes])

    return (
        <div className="contenedor-principal-perfil-profesional-consultado">
            <div className="contenedor-imagen-nombre-profesional-consultado">
                <div className="contenedor-imagen-profesional-consultado">
                    <img 
                        src={datosPerfilProfesional?.imagen ? `http://localhost:3001/${datosPerfilProfesional.imagen}` : `/usernone.jpg`} 
                        alt="imagen profesional" 
                        className="imagen-perfil-profesional-consultado"
                    />
                </div>
                <h3 className="nombre-profesional-consultado">{`${datosPerfilProfesional.nombre} ${datosPerfilProfesional.apellido}`}</h3>
                <h4 className="especialidad-profesional-consultado">{datosPerfilProfesional.especialidad}</h4>
            </div>
            {datosPerfilProfesional.descripcion ? (
                <div className="contenedor-descripcion-profesional-consultado">
                    <p>{datosPerfilProfesional?.descripcion}</p>
                </div>
            ) : (
                <p className="perfil-sin-descripcion">Sin descripción</p>
            )}
            <div className="cotenedor-tarjetas">
                {data && data.map((campo, index) => (
                    <TarjetaDatoProfesional key={index} dato={campo.key} valor={campo.value} />
                ))}
            </div>
            <div className="contenedor-imagenes-titulo-imagenes">
               {dataImagenes && dataImagenes.length > 0 &&  <h2 className="titulo-imagenes-profesional-consultado">Imágenes</h2>}
                <div className="contenedor-imagenes-profesional-consultado">
                    {dataImagenes && dataImagenes.map(imagen => (
                        <img key={imagen.id} src={`http://localhost:3001/${imagen.imagen}`} alt={imagen.id} className="imagen-profesional-consultado" />
                    ))}
                    
                </div>
            </div>
            <button className="button-contratar-profesional-seleccionado" onClick={() => obtenerDatosProfesionalAContratar()}>Contratar</button>

            {mostrarError && (
                <TarjetaError mensajeError={errores}/>
            )}
        </div>
    );
}

export default PerfilProfesional;
