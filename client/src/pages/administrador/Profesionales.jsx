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
import ConfirmarEliminarCliente from "../../components/administrador/ConfirmarEliminarCliente.jsx";

function Profesionales() {
    const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/profesionales');
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/profesionales');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`);

    const columnas = ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'contrasena', 'imagen', 'Acciones'];

    const crearProfesional = async(formData) => {
        setErrores('');
        setRespuestasExitosas('');
        await postRequest(formData);
        await fetchData();
    }

    const editarProfesional = async(data) => {
        setErrores('');
        setRespuestasExitosas('');
        await sendPutRequest(`http://localhost:3001/profesionales/${idProfesionalSeleccionado}`, data);
        await fetchData();
    }

    const eliminarProfesional = async () => {
        await eliminar();
        await fetchData();
    }

    const obtenerIdProfesionalEditar = (id) => {
        setIdProfesionalSeleccionado(id);
    }

    const obtenerIdProfesionalEliminar = (id) => {
        setIdProfesionalSeleccionado(id)
    }

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
        }
    }, [errorActualizar]);
    
    useEffect(() => {
        if (idProfesionalSeleccionado) {
            console.log(idProfesionalSeleccionado);
        }
    }, [idProfesionalSeleccionado]);
    
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
            setRespuestasExitosas();
        }
    }, [responseEliminar]);

    return(
        <>
            <div className="container-menu-table">
                <MenuAdmin />
                <div className="container-table-solicitud-profesional">
                    <div className="hola">
                        <TablaAdmin  columns={columnas}  title={'Profesionales'} data={data} onClickEdit={obtenerIdProfesionalEditar} onClick={obtenerIdProfesionalEliminar} tableId={'profesionales'}/>                 
                    </div>
                    <TarjetaAgregarEntidad cadena={'Agregar profesional'}/>
                    <div>
                        <ConfirmarEliminarCliente onClickDelete={eliminarProfesional}/>
                        <FormAgregarProfesional onClickCrear={crearProfesional}/>
                        <FormEditarProfesional onClickEditar={editarProfesional}/>
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