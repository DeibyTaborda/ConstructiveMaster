import React, {useEffect, useState } from "react";
import MenuAdmin from "../../components/administrador/MenuAdmin.jsx";
import TablaAdmin from "../../components/administrador/TablaAdmin.jsx";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad.jsx";
import useAxios from "../../services/api";
import usePostRequest from "../../services/usePostRequest";
import { usePutRequest } from "../../services/usePutRequest.js";
import useDelete from "../../services/delete";
import usePostRequestJson from "../../services/usePostRequestJson.js";
import ConfirmarAgregarProfesionalModal from "../../components/super-administrador/ConfirmarAgregarProfesionalModal.jsx";
import FormEditarTrabajo from "../../components/administrador/FormEditarTrabajo.jsx";

function Trabajos() {
    const [idTrabajoSeleccionado, setIdTrabajoSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);
    const [estado, setEstado] = useState({
        estado: 'pendiente'
    });
    const [accionesTabla, setAccionestTabla] = useState('Acciones');
    const [columnas, setColumnas] = useState(['id', 'nombre_cliente', 'nombre_profesional', 'fecha', 'hora', 'direccion', 'descripcion', 'valor', 'fecha_inicio', 'fecha_fin', 'estado']);
    const {loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest} = usePutRequest();
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequestJson} = usePostRequestJson('http://localhost:3001/trabajos/admin');
    const {loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar} = useDelete(`http://localhost:3001/clientes/`);

    const handleChange = async (event) => {
        const estadoSeleccionado = event.target.value;
        setEstado({ estado: estadoSeleccionado }); // Actualizas correctamente
        await postRequestJson({ estado: estadoSeleccionado }); // Usas el nuevo estado
    };
    
    useEffect(() => {
        if (estado) {
            postRequestJson(estado); // Pasas el estado directamente
        }
    }, [estado]);
    
    useEffect(() => {
        if (responseAgregar) {
            const response = responseAgregar.filter(profesional => profesional.estado !== 'cancelado' && profesional.estado !== 'confirmado');
            
            if (response.length > 0) {
                if (!columnas.includes('Acciones')) {
                    setColumnas([...columnas, 'Acciones']);
                }
            } else {
                if (columnas.includes('Acciones')) {
                    setColumnas(columnas.filter(col => col !== 'Acciones'));
                }
            }
            
            setProfesionales(responseAgregar);
        }
    }, [responseAgregar]);


    useEffect(() => {
        if (errorAgregar) {
            console.log(errorAgregar);
        }
    }, [errorAgregar])

    useEffect(() => {
        if (idTrabajoSeleccionado) {
            console.log(idTrabajoSeleccionado)
        }
    }, [idTrabajoSeleccionado])

    useEffect(() => {
        if (errorActualizar) {
            setErrores(errorActualizar);
            setRespuestasExitosas('');
        };
    }, [errorActualizar]);

    useEffect(() => {
        if (responseActualizar) {
            setRespuestasExitosas(responseActualizar);
            setErrores('');
        }
    }, [responseActualizar])

    const seleccionarIdConfirmar = (id) => {
        setIdTrabajoSeleccionado(id);
    }

    const seleccionarIdCancelar = (id) => {
        setIdTrabajoSeleccionado(id);
    }

    const editarEstadoTrabajo = async() => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, {estado: 'confirmado'});
        await postRequestJson(estado);
    }

    const cancelarTrabajo = async() => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, {estado: 'cancelado'});
        await postRequestJson(estado);
    }

    const editarTrabajo = async(data) => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, profesionales);
        await postRequestJson(estado);
    }

    const datosTrabajoSeleccionado = profesionales.find(trabajo => trabajo.id === idTrabajoSeleccionado);

    return (
        <>
             <div className="container-menu-table-clientes">
                <MenuAdmin/>
                <div className="container-table-clientes">
                    <div className="subcontenedor-tabla-clientes">
                    <select name="estado"  onChange={handleChange}>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                        <TablaAdmin data={profesionales} columns={columnas} title={'Trabajos'} tableId={'trabajos'} onClickEdit={seleccionarIdConfirmar} onClick={seleccionarIdCancelar}/>
                    </div>
                    <TarjetaAgregarEntidad cadena={'Añadir nuevo cliente'}/>
                    <ConfirmarAgregarProfesionalModal onClick={editarEstadoTrabajo}/>
                    <ConfirmarAgregarProfesionalModal onClick={cancelarTrabajo}/>
                    <FormEditarTrabajo datos={datosTrabajoSeleccionado} solicitudPUT={editarTrabajo}/>
                    {typeof errores === 'object' && errores !== null ? Object.values(errores)
                        .map((error, index) => (
                            <p key={index}>{error}</p>
                        )) : (
                            <p>{errores}</p>
                    )}
                    {respuestasExitosas ? <p>{respuestasExitosas}</p> : ''}
                    
                </div>
            </div>
        </>
    );
}

export default Trabajos;