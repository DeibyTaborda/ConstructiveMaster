import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';
import MenuAdmin from "../../components/administrador/MenuAdmin.jsx";
import TablaAdmin from "../../components/administrador/TablaAdmin.jsx";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad.jsx";
import ConfirmarAgregarProfesionalModal from "../../components/super-administrador/ConfirmarAgregarProfesionalModal.jsx";
import FormEditarTrabajo from "../../components/administrador/FormEditarTrabajo.jsx";
import useAxios from "../../services/api";
import usePostRequest from "../../services/usePostRequest";
import { usePutRequest } from "../../services/usePutRequest.js";
import useDelete from "../../services/delete";
import usePostRequestJson from "../../services/usePostRequestJson.js";
import FormAgregarTrabajo from "../../components/super-administrador/FormAgregarTrabajo.jsx";

function Trabajos() {
    // Estados para gestionar trabajos
    const [idTrabajoSeleccionado, setIdTrabajoSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);
    const [estado, setEstado] = useState({ estado: 'pendiente' });
    const [columnas, setColumnas] = useState([
        'id', 'nombre_cliente', 'nombre_profesional', 'fecha', 'hora', 'direccion', 'descripcion', 'valor', 'fecha_inicio', 'fecha_fin', 'estado'
    ]);

    // Estados para ocultar y mostrar componentes
    const [isOpenFormEditar, setOpenFormEditar] = useState(false);
    const [isOpenConfirmarTrabajo, setOpenConfirmarTrabajo] = useState(false);
    const [isOpenCancelarTrabajo, setIsOpenCancelarTrabajo] = useState(false);
    const [isOpenFormAgregarTrabajo, setIsOpenFormAgregarTrabajo] = useState(false);

    // Hooks personalizados para peticiones
    const { loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest } = usePutRequest();
    const { loading: loadingObtener, error: errorObtener, response: responseObtener, postRequestJson : postRequestJsonObtener } = usePostRequestJson('http://localhost:3001/trabajos/admin');
    const { loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequestJson: postRequestJsonAgregar } = usePostRequestJson('http://localhost:3001/trabajos');
    const { loading: loadingEliminar, error: errorEliminar, response: responseEliminar, eliminar } = useDelete('http://localhost:3001/clientes/');

    // Manejo de cambio en el estado del trabajo
    const handleChange = async (event) => {
        const estadoSeleccionado = event.target.value;
        setEstado({ estado: estadoSeleccionado });
        console.log('Estado antes de enviar:', estado); 
        await postRequestJsonObtener({ estado: estadoSeleccionado });
    };

    // Efectos para manejar actualizaciones en estado y respuestas
    useEffect(() => {
        if (estado) {
            console.log('Llamando a postRequestJsonObtener con estado:', estado);
            postRequestJsonObtener(estado);
        }
    }, [estado]);
    

    useEffect(() => {
        if (responseObtener) {
            const response = responseObtener.filter(profesional => profesional.estado !== 'cancelado' && profesional.estado !== 'confirmado');
            if (response.length > 0 && !columnas.includes('Acciones')) {
                setColumnas([...columnas, 'Acciones']);
            } else if (response.length === 0 && columnas.includes('Acciones')) {
                setColumnas(columnas.filter(col => col !== 'Acciones'));
            }
            console.log(responseObtener)
            setProfesionales(responseObtener);
        }
    }, [responseObtener]);

    useEffect(() => {
        if (errorObtener) console.log(errorObtener);
    }, [errorObtener]);

    useEffect(() => {
        if (idTrabajoSeleccionado) console.log(idTrabajoSeleccionado);
    }, [idTrabajoSeleccionado]);

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
        if (errorAgregar) {
            setErrores(errorAgregar);
            setRespuestasExitosas('');
        }
    }, [errorAgregar])

    useEffect(() => {
        if (responseAgregar) {
            setRespuestasExitosas(responseAgregar);
            setErrores('');
        }
    }, [responseAgregar])

    // Funciones para seleccionar, editar y crear trabajos y abrir Modales
    const seleccionarIdConfirmar = (id) => {
        setIdTrabajoSeleccionado(id);
        setOpenConfirmarTrabajo(!isOpenConfirmarTrabajo);
    }
    const seleccionarIdCancelar = (id) => {
        setIdTrabajoSeleccionado(id);
        setIsOpenCancelarTrabajo(!isOpenCancelarTrabajo);
    }

    const editarEstadoTrabajo = async () => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, { estado: 'confirmado' });
        await postRequestJsonObtener(estado);
    };

    const cancelarTrabajo = async () => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, { estado: 'cancelado' });
        await postRequestJsonObtener(estado);
    };

    const editarTrabajo = async (data) => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, profesionales);
        await postRequestJsonObtener(estado);
    };

    const agregarTrabajo = async(data) => {
        await postRequestJsonAgregar(data);
        await postRequestJsonObtener(estado);
    }

    // Datos del trabajo seleccionado
    const datosTrabajoSeleccionado = profesionales.find(trabajo => trabajo.id === idTrabajoSeleccionado);

    // Funciones para ocultar modales y formulario editar
    const cerrarModalConfirmarTrabajo = () => setOpenConfirmarTrabajo(false);
    const cerrarModalCancelarTrabajo = () => setIsOpenCancelarTrabajo(false);
    const cerrarFormEditarTrabajo = () => setOpenFormEditar(false);
    const cerrarFormAgregarTrabajo = () => setIsOpenFormAgregarTrabajo(false);

    // Función para renderizar el formulario de editar trabajo
    const abrirFormEditarTrabajo = () => setOpenFormEditar(!isOpenFormEditar);
    const abrirFormAgregarTrabajo = () => setIsOpenFormAgregarTrabajo(!isOpenFormAgregarTrabajo);

    // Render del componente
    return (
        <div className="container-menu-table-clientes">
            <MenuAdmin />
            <div className="container-table-clientes">
                <div className="subcontenedor-tabla-clientes">
                    {/* Selector para cambiar el estado del trabajo */}
                    <select name="estado" onChange={handleChange}>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>

                    {/* Tabla con los trabajos */}
                    <TablaAdmin
                        data={profesionales}
                        columns={columnas}
                        title="Trabajos"
                        tableId="trabajos"
                        onClickEdit={seleccionarIdConfirmar}
                        onClick={seleccionarIdCancelar}
                    />
                </div>

                {/* Componentes para agregar, confirmar o cancelar trabajo */}
                <TarjetaAgregarEntidad cadena="Añadir nuevo cliente" onClick={abrirFormAgregarTrabajo}/>
                {isOpenConfirmarTrabajo && (
                    <div className="contenedor-con-opacidad">
                        <ConfirmarAgregarProfesionalModal onClick={editarEstadoTrabajo} onClickCancelar={cerrarModalConfirmarTrabajo}/>
                    </div>
                )}
                {isOpenCancelarTrabajo && (
                    <div className="contenedor-con-opacidad">
                        <ConfirmarAgregarProfesionalModal onClick={cancelarTrabajo} onClickCancelar={cerrarModalCancelarTrabajo} />
                    </div>
                )}
                {isOpenFormAgregarTrabajo && (
                    <div className="contenedor-con-opacidad">
                        <FormAgregarTrabajo solicitudPOST={agregarTrabajo} onClick={cerrarFormAgregarTrabajo}/>
                    </div>
                )}
                {isOpenFormEditar && (
                    <div className="contenedor-con-opacidad">
                        <FormEditarTrabajo datos={datosTrabajoSeleccionado} solicitudPUT={editarTrabajo} onClick={cerrarFormEditarTrabajo}/>
                    </div>
                )}

                {/* Mostrar errores o respuestas exitosas */}
                {typeof errores === 'object' && errores !== null ? (
                    Object.values(errores).map((error, index) => <p key={index}>{error}</p>)
                ) : (
                    <p>{errores}</p>
                )}
                {respuestasExitosas && <p>{respuestasExitosas}</p>}
            </div>
        </div>
    );
}

export default Trabajos;
