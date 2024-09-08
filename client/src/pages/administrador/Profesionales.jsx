import React, { useEffect, useState } from "react";
import '../../assets/styles/profesionales.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad";
import FormAgregarProfesional from "../../components/super-administrador/FormAgregarProfesional";
import usePostRequest from "../../services/usePostRequest";
import FormEditarProfesional from "../../components/super-administrador/FormEditarProfesional";
import { usePutRequest } from "../../services/usePutRequest.js";
import useDelete from "../../services/delete.js";
import ConfirmarAccionEntidad from "../../components/administrador/ConfirmarAccionEntidad.jsx";
import { MdDelete } from "react-icons/md";
import PaginaDeError from "../../components/general/PaginaDeError.jsx";

function Profesionales() {
    // Estados del id, nombre y apellido del profesional seleccionado
    const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);

    // Columnas de la tabla profesionales
    const [columnas, setColumnas] = useState( ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'contrasena', 'imagen', 'Acciones'])

    // Estado de manejo de errores
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);

    // Hooks para realizar las solicitudes HTTP
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/profesionales');
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/profesionales');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`);

    // Estados para manejar el renderizado de algunos componentes
    const [isOpenFormEditarProfesional, setIsOpenFormEditarProfesional] = useState(false);
    const [isOpenAgregarProfesional, setIsOpenAgregarProfesional] = useState(false);
    const [isOpenEliminarProfesional, setIsOpenEliminarProfesional] = useState(false);

    // Funciones para cerrar los componentes de editar, confirmar y agregar
    const cerrarFormEditar = () =>  setIsOpenFormEditarProfesional(false);
    const cerrarFormAgregarTrabajo = () => setIsOpenAgregarProfesional(false);
    const cerrarModalConfimarEliminar = () => setIsOpenEliminarProfesional(false); 

    // Funciones para crear, editar y eliminar un profesional
    const crearProfesional = async(formData) => {
        setErrores('');
        setRespuestasExitosas('');
        await postRequest(formData);
        await fetchData();
        cerrarFormAgregarTrabajo();
    }

    const editarProfesional = async(data) => {
        setErrores('');
        setRespuestasExitosas('');
        await sendPutRequest(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`, data);
        await fetchData();
        cerrarFormEditar();
        
    }

    const eliminarProfesional = async () => {
        setErrores('');
        setRespuestasExitosas('');
        await eliminar();
        await fetchData();
        cerrarModalConfimarEliminar();
    }

    // Funciones para capturar el id del profesional
    const obtenerIdProfesionalEditar = (id) => {
        setIdProfesionalSeleccionado(id);
        setIsOpenFormEditarProfesional(!isOpenAgregarProfesional);
    }

    const obtenerIdProfesionalEliminar = (id) => {
        setIdProfesionalSeleccionado(id)
        setIsOpenEliminarProfesional(!isOpenEliminarProfesional);
    }

    // Función para obtener el nombre completo de un profesional
    const datosProfesionalSeleccionado = (datos) => {
        const profesionalEncontrado = datos.find(profesional => profesional.id === idProfesionalSeleccionado);
        return profesionalEncontrado;
    }

    // Hooks
    useEffect(() => {
        if (errorAgregar) {
            setErrores(errorAgregar);
            setRespuestasExitosas('');
        } 
    }, [errorAgregar]);
    
    useEffect(() => {
        if (responseAgregar) {
            setRespuestasExitosas(responseAgregar);
            setErrores('');
        }
    }, [responseAgregar]);
    
    useEffect(() => {
        if (errorActualizar) {
            setErrores(errorActualizar);
            setRespuestasExitosas('');
        }
    }, [errorActualizar]);
    
    useEffect(() => {
        if (responseActualizar) {
            setRespuestasExitosas(responseActualizar);
            setErrores('');
        }
    }, [responseActualizar]);

    useEffect(() => {
        if (responseEliminar) {
            setRespuestasExitosas(responseEliminar);
            setErrores('');
        }
    }, [responseEliminar]);

    useEffect(() => {
        if (errorEliminar) {
            setErrores(errorEliminar);
            setRespuestasExitosas('');
        }
    }, [responseEliminar]);

    useEffect(() => {
        if (data) {
            setProfesionales(data);
        } 
    }, [data]);

    if (!profesionales) return <PaginaDeError/>

    return(
        <>
            <div className="contenedor-general-tablas">
                <MenuAdmin />
                <div className="subcontenedor-tablas">
                    <div className="contenedor-tablas-admin">
                        <TablaAdmin  columns={columnas}  title={'Profesionales'} data={profesionales} onClickEdit={obtenerIdProfesionalEditar} onClick={obtenerIdProfesionalEliminar} tableId={'profesionales'}/>                 
                    </div>
                   <div>
                   <TarjetaAgregarEntidad cadena={'Agregar profesional'} onClick={() => setIsOpenAgregarProfesional(!isOpenAgregarProfesional)} id="nono"/>
                   </div>
                    <div>
                        {isOpenEliminarProfesional && (
                            <div className="contenedor-modales-position-fixed">
                                <ConfirmarAccionEntidad 
                                titulo='Eliminar profesional'
                                referencia={`${datosProfesionalSeleccionado(profesionales).nombre} ${datosProfesionalSeleccionado(profesionales).apellido}`}
                                mensaje="¿Estás seguro de que deseas eliminar el profesional?"
                                onClick={eliminarProfesional}
                                onClickCancelar={cerrarModalConfimarEliminar}
                                Icono={MdDelete}
                                boton1="Eliminar"
                                boton2="Cancelar"
                            />
                            </div>
                        )}

                        {isOpenAgregarProfesional && (
                             <div className="contenedor-modales-position-fixed">
                                <FormAgregarProfesional onClickCrear={crearProfesional} onClickCancelar={cerrarFormAgregarTrabajo}/>
                             </div>          
                        )}

                        { isOpenFormEditarProfesional && (
                            <div className="contenedor-modales-position-fixed">
                                <FormEditarProfesional onClickEditar={editarProfesional} onClickCancelar={cerrarFormEditar} datosProfesional={datosProfesionalSeleccionado(profesionales)}/>
                            </div>
                        )}
                        {respuestasExitosas ? <p>{respuestasExitosas}</p> : ''}
                        {errores && typeof errores === 'string' ? (
                            <p>{errores}</p>
                        ) : (
                            errores && Object.values(errores).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profesionales; 