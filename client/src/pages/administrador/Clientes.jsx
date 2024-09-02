import React, { useEffect, useState } from "react";
import '../../assets/styles/clientesAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin"; 
import axios from "axios";
import useAxios from "../../services/api";
import ConfirmarEliminarCliente from "../../components/administrador/ConfirmarEliminarCliente";
import useDelete from "../../services/delete";
import FormEditarCliente from "../../components/administrador/FormEditarCliente";
import {usePutRequest} from '../../services/usePutRequest.js';

function Clientes(){
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(null);
    const [ModalEditarCliente, setModalEditarCliente] = useState(false);
    const {data, loading, error, fetchData} = useAxios('http://localhost:3001/clientes');
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingEliminar, error: errorEliminar, response, eliminar} = useDelete(`http://localhost:3001/clientes/${idClienteSeleccionado}`);

    const [datos, setDatos] = useState(data);
    const [ModalEliminarCliente, setModalEliminarCliente] = useState(false);

    useEffect(() => {
        setDatos(data);
    }, [data]);

    useEffect(() => {
        if (idClienteSeleccionado) {
            console.log(idClienteSeleccionado);
        }
    }, [idClienteSeleccionado]);

    useEffect(() => {
        if (response) {
            console.log(response);
        } else if (errorEliminar){
            console.log(errorEliminar);
        }
    }, [response, errorEliminar])

    const title = 'Clientes'; 

    if (loading) return <p>Loading ....</p>
    if (error) return <p>{error?.message}</p>

    const columnas = ['id', 'nombre', 'correo', 'contrasena', 'telefono', 'direccion', 'imagen', 'Acciones']; 

    const abrirConfirmarEliminarCliente = () => setModalEliminarCliente(false);

    const seleccionarIdCliente = (id) => { 
        setIdClienteSeleccionado(id);
        setModalEliminarCliente(true);
    }

    const seleccionarIdClienteForm = (id) => {
        setIdClienteSeleccionado(id);
        setModalEditarCliente(true);
    }

    const eliminarCliente = async() => {
        await eliminar();
        fetchData();
        setModalEliminarCliente(false);
    }

    const actualizarCliente = async(data) => {
        await sendPutRequest(`http://localhost:3001/clientes/${idClienteSeleccionado}`, data);
        fetchData();
        setModalEditarCliente(false);
    }

    const datosClienteEliminar = () => {
        const clienteEncontrado = data.find((cliente) => cliente.id === idClienteSeleccionado);
        return clienteEncontrado;
    }



    return(
        <>
        <div className="container-menu-table-clientes">
            <MenuAdmin/>
            <div className="container-table-clientes">
                <TablaAdmin data={data} columns={columnas} title={title} tableId={'clientes'} onClick={seleccionarIdCliente} onClickEdit={seleccionarIdClienteForm}/>
                {ModalEliminarCliente && (
                    <ConfirmarEliminarCliente onClick={abrirConfirmarEliminarCliente} onClickDelete={eliminarCliente} data={datosClienteEliminar()}/>
                )}
                {ModalEditarCliente && (
                    <FormEditarCliente datos={datosClienteEliminar()} solicitudPUT={actualizarCliente}/>
                )}
                {errorActualizar ? <p>{errorActualizar}</p> : ''}
                {responseActualizar ? <p>{responseActualizar}</p> : ''}
            </div>
        </div>
        <p>{error ? error.message : ''}</p>
<p>{response ? response.message : ''}</p>
        </>
    );
}

export default Clientes;