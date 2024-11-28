import React, { useEffect, useState } from "react";
import '../../assets/styles/profesionales.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad";
import FormAgregarProfesional from "../../components/super-administrador/FormAgregarProfesional";
import usePostRequest from "../../services/usePostRequest";
import FormEditarProfesional from "../../components/super-administrador/FormEditarProfesional";
import PaginaDeError from "../../components/general/PaginaDeError.jsx";
import useDelete from "../../services/delete.js";
import ConfirmarAccionEntidad from "../../components/administrador/ConfirmarAccionEntidad.jsx";
import RutaRestringida from "../../components/general/RutaRestringida.jsx";
import { MdDelete } from "react-icons/md";
import { usePutRequest } from "../../services/usePutRequest.js";
import { useAccionExitosa } from "../../hooks/useAccionExitosa.js";

function Profesionales() {
    const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);
    const [columnas, setColumnas] = useState(['id', 'nombre', 'apellido', 'especialidad_nombre', 'correo', 'telefono', 'curriculum', 'contrasena', 'imagen', 'estado', 'created_at', 'Acciones']);
    
    // Estado de manejo de errores y respuestas exitosas
    const [errores, setErrores] = useState('');
    const [respuestasExitosas, setRespuestasExitosas] = useState('');
    const {accionRealizada, realizarAccion} = useAccionExitosa(3000);

    const {loading, error, data, errorCode, fetchData} = useAxios('http://localhost:3001/profesionales/admin');
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/profesionales');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`);

    const [isOpenFormEditarProfesional, setIsOpenFormEditarProfesional] = useState(false);
    const [isOpenAgregarProfesional, setIsOpenAgregarProfesional] = useState(false);
    const [isOpenEliminarProfesional, setIsOpenEliminarProfesional] = useState(false);

    const cerrarFormEditar = () =>  setIsOpenFormEditarProfesional(false);
    const cerrarFormAgregarTrabajo = () => setIsOpenAgregarProfesional(false);
    const cerrarModalConfimarEliminar = () => setIsOpenEliminarProfesional(false);

    const mostrarMensaje = (tipo, mensaje) => {
        if (tipo === 'error') {
            setErrores(mensaje);
            setTimeout(() => setErrores(''), 3000);
        } else {
            setRespuestasExitosas(mensaje);
            setTimeout(() => setRespuestasExitosas(''), 2000);
        }
    };

    const crearProfesional = async (formData) => {
        setErrores('');
        setRespuestasExitosas('');
        await postRequest(formData);
        if (errorAgregar) {
            mostrarMensaje('error', errorAgregar);
        } else if (responseAgregar) {
            mostrarMensaje('success', responseAgregar);
            await fetchData();
        }
        cerrarFormAgregarTrabajo();
    };

    const editarProfesional = async (data) => {
        setErrores('');
        setRespuestasExitosas('');
        await sendPutRequest(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`, data);
        await fetchData();
        if (errorActualizar) {
            mostrarMensaje('error', errorActualizar);
        } else if (responseActualizar) {
            mostrarMensaje('success', responseActualizar);
            await fetchData();
        }
        cerrarFormEditar();
    };

    const inhabilitarProfesional = async () => {
        setErrores('');
        setRespuestasExitosas('');
        await eliminar();
        await fetchData();
        if (errorEliminar) {
            mostrarMensaje('error', errorEliminar);
        } else if (responseEliminar) {
            mostrarMensaje('success', responseEliminar);
            await fetchData();
        }
        cerrarModalConfimarEliminar();
        realizarAccion();
    };

    const obtenerIdProfesionalEditar = (id) => {
        setIdProfesionalSeleccionado(id);
        setIsOpenFormEditarProfesional(!isOpenAgregarProfesional);
    };

    const obtenerIdProfesionalEliminar = (id) => {
        setIdProfesionalSeleccionado(id);
        setIsOpenEliminarProfesional(!isOpenEliminarProfesional);
    };

    const datosProfesionalSeleccionado = (datos) => {
        return datos.find(profesional => profesional.id === idProfesionalSeleccionado);
    };

    useEffect(() => {
        if (data) {
            setProfesionales(data);
        }
    }, [data]);

    if (!profesionales) return <PaginaDeError />;
    if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

    return (
        <>
            <div className="contenedor-general-tablas">
                <MenuAdmin />
                <div className="subcontenedor-tablas">
                    <div className="contenedor-tablas-admin">
                        <TablaAdmin
                            columns={columnas}
                            title={'Profesionales'}
                            data={profesionales}
                            onClickEdit={obtenerIdProfesionalEditar}
                            onClick={obtenerIdProfesionalEliminar}
                            tableId={'profesionales'}
                        />
                    </div>
                    <div>
                        <TarjetaAgregarEntidad cadena={'Agregar profesional'} onClick={() => setIsOpenAgregarProfesional(!isOpenAgregarProfesional)} id="nono" />
                    </div>
                    <div>
                        {isOpenEliminarProfesional && (
                            <div className="contenedor-modales-position-fixed">
                                <ConfirmarAccionEntidad
                                    titulo='Deshabilitar profesional'
                                    referencia={`${datosProfesionalSeleccionado(profesionales).nombre} ${datosProfesionalSeleccionado(profesionales).apellido}`}
                                    mensaje="¿Estás seguro de que deseas deshabilitar el profesional?"
                                    onClick={inhabilitarProfesional}
                                    onClickCancelar={cerrarModalConfimarEliminar}
                                    Icono={MdDelete}
                                    boton1="Deshabilitar"
                                    boton2="Cancelar"
                                />
                            </div>
                        )}
                        {isOpenAgregarProfesional && (
                            <div className="contenedor-modales-position-fixed">
                                <FormAgregarProfesional onClickCrear={crearProfesional} onClickCancelar={cerrarFormAgregarTrabajo} />
                            </div>
                        )}
                        {isOpenFormEditarProfesional && (
                            <div className="contenedor-modales-position-fixed">
                                <FormEditarProfesional onClickEditar={editarProfesional} onClickCancelar={cerrarFormEditar} datosProfesional={datosProfesionalSeleccionado(profesionales)} />
                            </div>
                        )}
                        {errores && <p className="error-eliminar">{errores}</p>}
                        {respuestasExitosas && <p className="respuesta-exitosa">{respuestasExitosas}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profesionales;
