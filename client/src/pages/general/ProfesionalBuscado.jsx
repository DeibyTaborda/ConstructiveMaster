import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/profesionalBuscado.css';
import PerfilProfesional from "../../components/Profesionales/PerfilProfesional";
import CartaProfesional from "../../components/Profesionales/CartaProfesional";
import PaginaDeError from "../../components/general/PaginaDeError";
import TarjetaError from "../../components/general/TarjetaError";
import { ProfesionalesContext } from "../../context/ProfesionalesContext";
import Footer from "../../components/general/footer";

function ProfesionalBuscado() {
    const navigate = useNavigate();
    const [cambioProfesional, setCambioProfesional] = useState(null);
    const [errores, setErrores] = useState('');
    const [mostrarError, setMostrarError] = useState(false);

    // Función para obtener profesionales desde localStorage
    const obtenerProfesionalesPorEspecialidad = () => {
        const profesionalesEnJSON = localStorage.getItem('profesionalesPorEspecialidad');
        const profesionales = profesionalesEnJSON ? JSON.parse(profesionalesEnJSON) : [];
        
        const profesionalConsultadoJSON = localStorage.getItem('profesional_consultado');
        const profesionalConsultado = profesionalConsultadoJSON ? JSON.parse(profesionalConsultadoJSON) : null;
    
        if (!profesionalConsultado) {
            return profesionales;
        }
    
        const profesionalesFiltrados = profesionales.filter(profesional => profesional.id !== profesionalConsultado.id);
        return profesionalesFiltrados;
    };
    
    const [profesionalesLocalStorage, setProfesionalesLocalStorage] = useState(obtenerProfesionalesPorEspecialidad());
    const {profesionales} = useContext(ProfesionalesContext);

    const cambiarValorCambioProfesional = () => {
        setCambioProfesional(false);
    }
        
    // Función para guardar un profesional seleccionado en localStorage
    const guardarProfesionalSeleccionado = (profesional) => {
        if (!profesional) {
            mostrarMensajeDeError('No se puede guardar un profesional nulo o indefinido en localStorage');
            return;
        }
    
        try {
            localStorage.setItem('profesional_consultado', JSON.stringify(profesional));
            setCambioProfesional(true);
        } catch (error) {
            mostrarMensajeDeError('Error al guardar el profesional seleccionado');
        }
    };

    // Función para mostrar mensajes de error
    const mostrarMensajeDeError = (mensajeError) => {
        setErrores(mensajeError);
        setMostrarError(true);

        setTimeout(() => {
            setMostrarError(false);
        }, 3000);
    };

    useEffect(() => {
        setProfesionalesLocalStorage(obtenerProfesionalesPorEspecialidad);
    }, [cambioProfesional]);

    if (profesionales.length === 0) {
        return <PaginaDeError errorCode={404} />;
    }

    return (
        <>
        <section className="section-profesional-encontrado">
            <div className="contenedor-perfil-profesional-encontrado">
                <PerfilProfesional 
                    cambioProfesional={cambioProfesional}
                    cambiarValor={cambiarValorCambioProfesional}
                />
            </div>
            <div className="contenedor-profesionales-por-especialidad">
                {profesionalesLocalStorage.length > 0 ? (
                    profesionalesLocalStorage.map((profesional, index) => (
                        <div key={index} className="contenedor-carta-profesional">
                            <CartaProfesional
                                imagen={profesional.imagen}
                                nombre={profesional.nombre}
                                especialidad={profesional.especialidad}
                                disponibilidad={profesional.estado}
                                onClick={() => guardarProfesionalSeleccionado(profesional)}
                            />
                        </div>
                    ))
                ) : (
                    <p>No se encontraron profesionales en esta especialidad.</p>
                )}
            </div>

            {mostrarError && (
                <TarjetaError mensajeError={errores} />
            )}
        </section>
        <Footer/>
        </>
    );
}

export default ProfesionalBuscado;
