import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';
import '../../assets/styles/formTrabajos.css';
import MenuAdmin from "../../components/administrador/MenuAdmin.jsx";
import TablaAdmin from "../../components/administrador/TablaAdmin.jsx";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad.jsx";
import FormEditarTrabajo from "../../components/administrador/FormEditarTrabajo.jsx";
import useDelete from "../../services/delete";
import usePostRequestJson from "../../services/usePostRequestJson.js";
import FormAgregarTrabajo from "../../components/super-administrador/FormAgregarTrabajo.jsx";
import ConfirmarAccionEntidad from "../../components/administrador/ConfirmarAccionEntidad.jsx";
import RutaRestringida from "../../components/general/RutaRestringida.jsx";
import useAxios from "../../services/api.js";
import { FaCheckCircle } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { usePutRequest } from "../../services/usePutRequest.js";

function Trabajos() {
    // Estados para gestionar trabajos
    const [idTrabajoSeleccionado, setIdTrabajoSeleccionado] = useState(null);
    const [profesionales, setProfesionales] = useState([]);
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);
    const [respuestaExitosaAgregar, setRespuestaExitosaAgregar] = useState(null);
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
    const {errorCode} = useAxios('http://localhost:3001/trabajos');

    // Manejo de cambio en el estado del trabajo
    const handleChange = async (event) => {
        const estadoSeleccionado = event.target.value;
        setEstado({ estado: estadoSeleccionado });
        await postRequestJsonObtener({ estado: estadoSeleccionado });
    };

    // Efectos para manejar actualizaciones en estado y respuestas
    useEffect(() => {
        if (estado) {
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
            setProfesionales(responseObtener);
        }
    }, [responseObtener]);

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
            setRespuestaExitosaAgregar(responseAgregar);
            setErrores('');
        }
    }, [responseAgregar])

    useEffect(() => {
        if (respuestasExitosas) {
          const timer = setTimeout(() => {
            setRespuestasExitosas(null); // Oculta el mensaje después de 2 segundos
          }, 2000);
          
          // Limpia el temporizador cuando el componente se desmonte o el mensaje cambie
          return () => clearTimeout(timer);
        }
      }, [respuestasExitosas]);

      useEffect(() => {
        if (respuestaExitosaAgregar) {
          const timer = setTimeout(() => {
            setRespuestaExitosaAgregar(null); // Oculta el mensaje después de 2 segundos
          }, 2000);
          
          // Limpia el temporizador cuando el componente se desmonte o el mensaje cambie
          return () => clearTimeout(timer);
        }
      }, [respuestaExitosaAgregar]);

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
        setOpenConfirmarTrabajo(false);
    };

    const cancelarTrabajo = async () => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, { estado: 'cancelado' });
        await postRequestJsonObtener(estado);
        setIsOpenCancelarTrabajo(false);
    };

    const editarTrabajo = async (data) => {
        await sendPutRequest(`http://localhost:3001/trabajos/${idTrabajoSeleccionado}`, profesionales);
        await postRequestJsonObtener(estado);
    };

    const agregarTrabajo = async(data) => {
        await postRequestJsonAgregar(data);
        await postRequestJsonObtener(estado);
        cerrarFormAgregarTrabajo();
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

    if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

    return (
        <div className="contenedor-general-tablas">
            <MenuAdmin />
            <div className="subcontenedor-tablas">
                <div className="contenedor-tablas-admin">
                    {/* Selector para cambiar el estado del trabajo */}
                    <select name="estado" onChange={handleChange} id="camilito" >
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
                <TarjetaAgregarEntidad cadena="Añadir nuevo trabajo" onClick={abrirFormAgregarTrabajo}/>
                {isOpenConfirmarTrabajo && (
                    <div className="contenedor-modales-position-fixed">
                        {/* <ConfirmarAgregarProfesionalModal onClick={editarEstadoTrabajo} onClickCancelar={cerrarModalConfirmarTrabajo}/> */}
                        <ConfirmarAccionEntidad
                            titulo="Confirmar trabajo"
                            referencia={datosTrabajoSeleccionado?.id}
                            mensaje='¿Estás seguro de que deseas confirmar el trabajo?'
                            Icono={FaCheckCircle}
                            onClick={editarEstadoTrabajo}
                            onClickCancelar={cerrarModalConfirmarTrabajo}
                            boton1="Confirmar"
                            boton2="Cancelar"
                        />
                    </div>
                )}
                {isOpenCancelarTrabajo && (
                    <div className="contenedor-modales-position-fixed">
                        <ConfirmarAccionEntidad
                            titulo="Cancelar trabajo"
                            referencia={datosTrabajoSeleccionado?.id}
                            mensaje='¿Estás seguro de que deseas cancelar el trabajo?'
                            Icono={TiDeleteOutline}
                            onClick={cancelarTrabajo}
                            onClickCancelar={cerrarModalCancelarTrabajo}
                            boton1="Suspender"
                            boton2="Cancelar"
                        />
                    </div>
                )}
                {isOpenFormAgregarTrabajo && (
                    <div className="contenedor-modales-position-fixed">
                        <FormAgregarTrabajo solicitudPOST={agregarTrabajo} onClick={cerrarFormAgregarTrabajo}/>
                    </div>
                )}
                {isOpenFormEditar && (
                    <div className="contenedor-modales-position-fixed">
                        <FormEditarTrabajo 
                        datos={datosTrabajoSeleccionado} 
                        solicitudPUT={editarTrabajo} 
                        onClick={cerrarFormEditarTrabajo}/>
                    </div>
                )}

                {/* Mostrar errores o respuestas exitosas */}
                {typeof errores === 'object' && errores !== null ? (
                    Object.values(errores).map((error, index) => <p key={index}>{error}</p>)
                ) : (
                    <p>{errores}</p>
                )}
                {respuestasExitosas && <p className="mensaje-exitoso">{respuestasExitosas}</p>}
                {respuestaExitosaAgregar && <p className="mensaje-exitoso">{respuestaExitosaAgregar}</p>}
            </div>
        </div>
    );
}

export default Trabajos;
