import React, { useEffect, useState } from "react";
import '../../assets/styles/clientesAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin"; 
import useAxios from "../../services/api";
import ConfirmarEliminarCliente from "../../components/administrador/ConfirmarEliminarCliente";
import useDelete from "../../services/delete";
import FormEditarCliente from "../../components/administrador/FormEditarCliente";
import {usePutRequest} from '../../services/usePutRequest.js';
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad.jsx";
import usePostRequest from '../../services/usePostRequest.js';
import FormAgregarCliente from "../../components/administrador/FormAgregarCliente.jsx";

function Clientes(){
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(null);
    const [ModalEliminarCliente, setModalEliminarCliente] = useState(false);
    const [ModalAgregarCliente, setModalAgregarCliente] = useState(false);
    const [ModalEditarCliente, setModalEditarCliente] = useState(false);

    // Solicitudes HTTP
    const {data, loading, error, fetchData} = useAxios('http://localhost:3001/clientes');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/clientes');
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/clientes/${idClienteSeleccionado}`);

    const [datos, setDatos] = useState(data);

    useEffect(() => {
        setDatos(data);
    }, [data]);

    useEffect(() => {
        if (idClienteSeleccionado) {
            console.log(idClienteSeleccionado);
        }
    }, [idClienteSeleccionado]);

    const title = 'Clientes'; 

    const columnas = ['id', 'nombre', 'correo', 'contrasena', 'telefono', 'direccion', 'imagen', 'Acciones']; 

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

    return(
        <>
            <div className="container-menu-table-clientes">
                <MenuAdmin/>
                <div className="container-table-clientes">
                    <div className="subcontenedor-tabla-clientes">
                        <TablaAdmin data={datos} columns={columnas} title={title} tableId={'clientes'} onClick={seleccionarIdCliente} onClickEdit={seleccionarIdClienteForm}/>
                    </div>
                    <TarjetaAgregarEntidad cadena={'Añadir nuevo cliente'} onClick={() => setModalAgregarCliente(true)}/>
                    {ModalEliminarCliente && (
                        <div className="contenedor-modal-confirmar-eliminar-cliente">
                            <ConfirmarEliminarCliente onClick={abrirConfirmarEliminarCliente} onClickDelete={eliminarCliente} data={datosClienteEliminar()}/>
                        </div>
                    )}
                    {ModalEditarCliente && (
                        <div className="contenedor-form-editar-cliente">
                            <FormEditarCliente datos={datosClienteEliminar()} solicitudPUT={actualizarCliente} onClick={() => setModalEditarCliente(false)}/>
                        </div>
                    )}
                    {ModalAgregarCliente && (
                        <div className="contenedor-form-agregar-cliente">
                            <FormAgregarCliente solicitudPOST={agregarCliente} onClick={() => setModalAgregarCliente(false)}/>
                        </div>
                    )}
                                {/* Manejo de mensajes al final del componente */}
                            {loading && <p>Loading...</p>}
                            {loadingActualizar && <p>Actualizando cliente...</p>}
                            {loadingAgregar && <p>Agregando cliente...</p>}
                            {loadingEliminar && <p>Eliminando cliente...</p>}

                            {error && <p>{error.message}</p>}
                            {errorActualizar && <p>{errorActualizar}</p>}
                            {errorAgregar && <p>{errorAgregar}</p>}
                            {errorEliminar && <p>{errorEliminar}</p>}

                            {responseActualizar && <p>{responseActualizar}</p>}
                            {responseAgregar && <p>{responseAgregar}</p>}
                            {responseEliminar && <p>{responseEliminar}</p>}
                </div>
            </div>
        </>
    );
}

export default Clientes;
