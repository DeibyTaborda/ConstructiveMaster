import React, { useEffect, useState, useContext } from "react";
import '../../assets/styles/perfilesProfesionales.css';
import Menu from '../../components/general/Menu';
import BarraDeBusqueda from "../../components/general/BarraDeBusqueda";
import CartaProfesional from "../../components/Profesionales/CartaProfesional";
import useAxios from "../../services/api";
import PaginaDeError from "../../components/general/PaginaDeError";
import { useNavigate } from "react-router-dom";
import { ProfesionalesContext, ProfesionalesProvider } from '../../context/ProfesionalesContext';
import Footer from "../../components/general/footer";

function PerfilesProfesionales() {
    const navigate = useNavigate();
    const { profesionales: profesionalesContext, loading: loadingContext, error: errorContext } = useContext(ProfesionalesContext);
    const [profesionales, setProfesionales] = useState([]);
    const [especialidadSeleccionada, SetEspecialidadSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('todos');
    const {loading, error, errorCode, response, data, fetchData} = useAxios('http://localhost:3001/buscar-profesionales', {busqueda});

    // Función para obtener los profesionales según los items del usuario
    const obtenerProfesionales = (busqueda) => {
        setBusqueda(busqueda);
    }

    // Función que guarda los datos del profesional seleccionado en el localStorage
    const obtenerIdProfesionalSeleccionado = (profesionalConsultado) => {
        const LOCAL_STORAGE_KEY = 'profesional_consultado';
        try {
            const datosJsonProfesional = JSON.stringify(profesionalConsultado);
            localStorage.setItem(LOCAL_STORAGE_KEY, datosJsonProfesional);
            SetEspecialidadSeleccionada(profesionalConsultado.especialidad);
        } catch (error) {
            console.error('Error al guardar los datos en localStorage:', error);
        }
    };

    const filtrarProfesionalesPorEspecialidad = (profesionales, especialidadSeleccionada) => {
        if (profesionales && especialidadSeleccionada) {
            const profesionalesFiltrados = profesionales.filter(profesional => profesional.especialidad === especialidadSeleccionada);
            const profesionalesFiltradosJSON = JSON.stringify(profesionalesFiltrados);
            localStorage.setItem('profesionalesPorEspecialidad', profesionalesFiltradosJSON);

            return navigate('/profesional-consultado');
        }
        return [];
    }
    
    useEffect(() => {
        filtrarProfesionalesPorEspecialidad(profesionalesContext, especialidadSeleccionada);
    }, [especialidadSeleccionada]);

    useEffect(() => {
        if (data) {
            setProfesionales(data);
        }
    }, [data])

    useEffect(() => {
        if (busqueda) {
           fetchData()
        }
    }, [busqueda]);

    useEffect(() => {
        if (especialidadSeleccionada) {
            console.log('Esta es la especialidad seleccionada', especialidadSeleccionada)
        }
    });

    if (error) return <PaginaDeError errorCode={errorCode}/>
    if (errorContext) return <p>{errorContext}</p>;

    return (
        <>
            <Menu/> 
            <div>
                <div className="contenedor-barra-de-navegacion">
                    <BarraDeBusqueda
                        name='item'
                        placeholder='Buscar profesional por epecialidad y nombre'
                        solicitudGET={obtenerProfesionales} 
                    /> 
                </div>

                <div className="contenedor-cartas-profesioales">                 
                    {profesionales && profesionales.map((profesional, index) => (
                        <div key={index} className="contendedor-segundario-carta-profesional">
                            <CartaProfesional
                                imagen={profesional.imagen}
                                nombre={`${profesional.nombre} ${profesional.apellido}`}
                                especialidad={profesional.especialidad}
                                disponibilidad={profesional.estado}
                                onClick={() => obtenerIdProfesionalSeleccionado(profesional)}
                            />
                        </div>
                    ))}

                    {profesionales.length === 0 && (
                        <div className="contenedor-sin-resultados-profesionales">
                            <img src="http://localhost:3001/uploads/imagenes/sinresultados.jpg" alt="Imagen búsqueda fallida" />
                            <p className="mensaje-sin-resultados-profesionales">No encontramos profesionales que coincidan con tu búsqueda. Puedes ajustar los filtros o revisar otras especialidades.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default PerfilesProfesionales;