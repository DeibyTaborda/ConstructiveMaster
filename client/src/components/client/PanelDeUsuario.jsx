import React, { useEffect, useState } from "react";
import '../../assets/styles/panelDeUsuario.css';
import BarraPanelControl from "./BarraPanelControl";
import DatosPersonalesAdmin from "../../pages/administrador/DatosPersonalesAdmin";
import TablaAdmin from "../administrador/TablaAdmin";
import useAxios from "../../services/api";
import TarjetaActividad from "./TarjetaActividad";
import FormRecuperContrasena from "../general/FormCambiarContrasena";
import RutaRestringida from "../general/RutaRestringida.jsx";
import CartaActividad from "../general/CartaActividad";
import PaginaDeError from "../general/PaginaDeError";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { usePutRequest } from "../../services/usePutRequest.js";


function PanelDeUsuario() {
    const GESTION_PERFIL = 'gestion_perfil';
    const ACTIVIDAD = 'actividad';
    const TRABAJOS = 'trabajos';
    const [actividades, setActividades] = useState([]);
    const [estadoConsultaActividad, setEstadoConsultaActividad] = useState('todas');
    const [seccion, setSeccion] = useState(TRABAJOS);
    const navigate = useNavigate();
    const {logout} = useLogout();

    const {errorCode} = useAxios('http://localhost:3001/panel-de-usuario');
    const {loading: loadingActualizar, response: responseActualizar, error: errorActualizar, sendPutRequest} =  usePutRequest();
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/trabajos/usuario', {estadoConsultaActividad});
    const {loading: loadingActividades, error: errorActividades, response: responseActividades, data: dataActividades, fetchData: fetchDataActividades} = useAxios('http://localhost:3001/actividad');

    const handleOnchange = (e) => {
        const {value} = e.target;
        setEstadoConsultaActividad(value);
    }

    const estadoActividad = (data, estado) => {
        if (!data) {
            return;  
        }
    
        if (estado === 'todas') {
            setActividades(data);
        } else {

            const actividadesConsultadas = data.filter(actividad => actividad.estado === estado);
            setActividades(actividadesConsultadas);
        }
    };

    const actualizarEstadoTrabajo = async (id) => {
        await sendPutRequest(`http://localhost:3001/cancelar-trabajo/${id}`);
        await fetchData();
    
        setEstadoConsultaActividad('pendiente');
        
        // Filtrar las actividades con el estado "pendiente"
        const actividadesFiltradas = data.filter(actividad => actividad.estado === 'pendiente');
        setActividades(actividadesFiltradas);
    };

    const abrirSeccion = (componente) => {
        setSeccion(componente === seccion ? null : componente);
    };

    const tituloTrabajo = () => {
        if (estadoConsultaActividad !== 'todas' && estadoConsultaActividad !==  'en_progreso') {
            return `Trabajos ${estadoConsultaActividad}s`;
        } else if (estadoConsultaActividad === 'todas') {
            return 'Trabajos';
        } else if (estadoConsultaActividad === 'en_progreso') {
            return 'Trabajos en progreso';
        } else {
            return;
        }
    }

    useEffect(() => {
       estadoActividad(data, estadoConsultaActividad);
    }, [estadoConsultaActividad, data])

    useEffect(() => {
        setActividades(data);
    }, [])

    useEffect(() => {
        if (seccion === 'actividad') {
            fetchDataActividades();
        }
    }, [seccion]);

    if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

    return (
        <div className="contenedor-panel-de-usuario">
            <div className="barra-panel-control">
                <BarraPanelControl
                    abrirGestionarCuenta={() => abrirSeccion(GESTION_PERFIL)}
                    abrirTrabajos={() => abrirSeccion(TRABAJOS)}
                    abrirActividad={() => abrirSeccion(ACTIVIDAD)}
                    abrirPrivacidad={() => navigate('/cambiar-contrasena')}
                    abrirCrearTrabajo={() => navigate('/solicitud/trabajo')}
                    cerrarSesion={logout}
                />
            </div> 
            {seccion === GESTION_PERFIL && (
                <div className="datos-personales-admin">
                    <DatosPersonalesAdmin/>
                </div>
            )}
            {seccion === TRABAJOS && (
                <div className="datos-personales-admin">
                    <form className="formulario-select">
                        <label htmlFor="actividad" className="etiqueta-select">Selecciona un estado:</label>
                        <select 
                            name="actividad" 
                            id="actividad" 
                            value={estadoConsultaActividad}
                            onChange={handleOnchange} 
                            className="select-actividad"
                        >
                            <option value="todas">Todas</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="rechazado">Rechazado</option>
                            <option value="en_progreso">En progreso</option>
                        </select>
                    </form>
                      <h2>{tituloTrabajo()}</h2>
                    {seccion === TRABAJOS && actividades && actividades.map((actividad, index) => (
                        <TarjetaActividad
                            key={index}
                            data={actividad}
                            actuliazarEstadoTrabajo={actualizarEstadoTrabajo}
                        />
                    ))}
                </div>
            )}
            {seccion === ACTIVIDAD && (
                <div className="datos-personales-admin">
                    <h2>Actividad</h2>
                    {typeof dataActividades === 'object' !== null && dataActividades.reverse().map((actividad, index) => (
                        <CartaActividad 
                            key={index}
                            accion={actividad.accion}
                            descripcion={actividad.detalles}
                            fecha={actividad.created_at}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PanelDeUsuario;
