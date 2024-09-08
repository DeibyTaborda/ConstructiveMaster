import React, { useEffect, useState } from "react";
import '../../assets/styles/contenedoresTablasAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin"; 
import useAxios from "../../services/api";
import ConfirmarAccionEntidad from "../../components/administrador/ConfirmarAccionEntidad.jsx";
import useDelete from "../../services/delete";
import FormEditarCliente from "../../components/administrador/FormEditarCliente";
import {usePutRequest} from '../../services/usePutRequest.js';
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad.jsx";
import usePostRequest from '../../services/usePostRequest.js';
import FormAgregarCliente from "../../components/administrador/FormAgregarCliente.jsx";
import { MdDelete } from "react-icons/md";
import PaginaDeError from "../../components/general/PaginaDeError.jsx";

function Clientes(){
    // Estado de los registros de los clientes
    const [clientes, setClientes] = useState([]);

    // Estado de manejo de errores
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);

    // Estado del id del profesional seleccionado
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(null);

    //Estado de las columnas de la tabla cliente
    const [columnas, setColumnas] = useState(['id', 'nombre', 'correo', 'contrasena', 'telefono', 'direccion', 'imagen', 'Acciones']);

    // Estado para ocultar y renderizar el modal de eliminar y los formularios de agregar y editar
    const [ModalEliminarCliente, setModalEliminarCliente] = useState(false);
    const [ModalAgregarCliente, setModalAgregarCliente] = useState(false);
    const [ModalEditarCliente, setModalEditarCliente] = useState(false);

    // Solicitudes HTTP
    const {data, loading, error, fetchData} = useAxios('http://localhost:3001/clientes');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/clientes');
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/clientes/${idClienteSeleccionado}`);

    const abrirConfirmarEliminarCliente = () => setModalEliminarCliente(false);

    const seleccionarIdCliente = (id) => { 
        setIdClienteSeleccionado(id);
        setModalEliminarCliente(true);
    };

    const seleccionarIdClienteForm = (id) => {
        setIdClienteSeleccionado(id);
        setModalEditarCliente(true);
    };

    const eliminarCliente = async() => {
        await eliminar();
        fetchData();
        setModalEliminarCliente(false);
    };

    const actualizarCliente = async(data) => {
        await sendPutRequest(`http://localhost:3001/clientes/${idClienteSeleccionado}`, data);
        fetchData();
        setModalEditarCliente(false); 
    };

    const datosClienteEliminar = () => {
        const clienteEncontrado = data.find((cliente) => cliente.id === idClienteSeleccionado);
        return clienteEncontrado;
    };

    const agregarCliente = async(data) => {
        await postRequest(data);
        await fetchData();
        setModalAgregarCliente(false);
    };

    useEffect(() => {
        setClientes(data);
    }, [data]);

    useEffect(() => {
        if (errorAgregar) {
            setErrores(errorAgregar);
            setRespuestasExitosas('');
        } else if (errorActualizar) {
            setErrores(errorActualizar);
            setRespuestasExitosas('');
        } else if (errorEliminar) {
            setErrores(errorEliminar);
            setRespuestasExitosas('');
        }
    }, [errorAgregar, errorActualizar, errorEliminar]);

    useEffect(() => {
        if (responseAgregar) {
            setRespuestasExitosas(responseAgregar);
            setErrores('');      
        } else if (responseActualizar) {
            setRespuestasExitosas(responseActualizar);
            setErrores('');
        } else if (responseEliminar) {
            setRespuestasExitosas(responseEliminar);
            setErrores('');
        }
    }, [responseAgregar, responseActualizar, responseEliminar]);

    if (!clientes) return <PaginaDeError/>

    return(
        <>
            <div className="contenedor-general-tablas">
                <MenuAdmin/>
                <div className="subcontenedor-tablas">
                    <div className="contenedor-tablas-admin">
                        <TablaAdmin data={clientes} columns={columnas} title='Clientes' tableId={'clientes'} onClick={seleccionarIdCliente} onClickEdit={seleccionarIdClienteForm}/>
                    </div>
                    <TarjetaAgregarEntidad cadena={'Añadir nuevo cliente'} onClick={() => setModalAgregarCliente(true)}/>
                    {ModalEliminarCliente && (
                        <div className="contenedor-modales-position-fixed">
                            <ConfirmarAccionEntidad 
                            titulo='Eliminar a'
                            referencia={datosClienteEliminar().nombre}
                            mensaje='¿Estás seguro de que deseas eliminar este cliente?'
                            onClick={eliminarCliente}
                            onClickCancelar={abrirConfirmarEliminarCliente}
                            Icono={MdDelete}
                            boton1="Eliminar"
                            boton2="Cancelar"
                            />
                        </div>
                    )}
                    {ModalEditarCliente && (
                        <div className="contenedor-modales-position-fixed">
                            <FormEditarCliente datos={datosClienteEliminar()} solicitudPUT={actualizarCliente} onClick={() => setModalEditarCliente(false)}/>
                        </div>
                    )}
                    {ModalAgregarCliente && (
                        <div className="contenedor-modales-position-fixed">
                            <FormAgregarCliente solicitudPOST={agregarCliente} onClick={() => setModalAgregarCliente(false)}/>
                        </div>
                    )}
                        {/* Manejo de mensajes al final del componente */}
                    {loading && <p>Loading...</p>}
                    {loadingActualizar && <p>Actualizando cliente...</p>}
                    {loadingAgregar && <p>Agregando cliente...</p>}
                    {loadingEliminar && <p>Eliminando cliente...</p>}

                    {errores && <p>{errores}</p>}
                    {respuestasExitosas && <p>{respuestasExitosas}</p>}



                </div>
            </div>
        </>
    );
}

export default Clientes;
