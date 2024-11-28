import React, { useState, useContext, useEffect } from 'react';
import BarraPanelDeControl from '../../components/Profesionales/BarraPanelDeControl';
import TrabajosPendientes from '../../components/Profesionales/TrabajosPendientes';
import Actividad from '../../components/Profesionales/Actividad.jsx';
import '../../assets/styles/panelDeControlProfesional.css';
import useAxios from '../../services/api';
import MensajeExitoso from '../../components/general/MensajeExitoso2.jsx';
import DatosPersonalesAdmin from '../administrador/DatosPersonalesAdmin.jsx';
import CamposPersonalizados from '../../components/Profesionales/CamposPersonalizados.jsx'; 
import CambiarContrasena from '../general/CambiarContrasena.jsx';
import Contratos from '../../components/Profesionales/Contratos.jsx';
import RutaRestringida from '../../components/general/RutaRestringida.jsx';
import { TrabajosProfesionalContext } from "../../context/TrabajosProfesionalContext";
import { usePutRequest } from "../../services/usePutRequest.js";
import { useAccionExitosa } from '../../hooks/useAccionExitosa.js';


function PanelDeControlProfesional() {
  const [activeSection, setActiveSection] = useState('trabajos-pendientes');
  const { error: errorCambiarEstado, response: responseCambiarEstado, sendPutRequest } = usePutRequest();
  const { accionRealizada, realizarAccion } = useAccionExitosa(3000);
  const [idContrato, setIdContrato] = useState(null);
    
  const {trabajos} = useContext(TrabajosProfesionalContext); 

  const obtenerIdProfesional = () => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const profesional = JSON.parse(usuario);
      return profesional?.id || null; 
    }
    return null;
  };

  const [idProfesional, setIdProfesioanl] = useState(obtenerIdProfesional());
  const { errorCode } = useAxios('http://localhost:3001/panel-de-control-profesional');
  const { loading, error, response, data, fetchData } = useAxios('http://localhost:3001/trabajos-profesional', { idProfesional });
  const {data: dataContratos, fetchData: fetchDataContrato} = useAxios('http://localhost:3001/contratos/profesional');
  const { loading: loadingActividades, error: errorActividades, response: responseActividades, data: dataActividades, fetchData: fetchDataActividades } = useAxios('http://localhost:3001/actividades-profesional', { idProfesional });

  const cancelarTrabajo = async(id) => {
    await sendPutRequest(`http://localhost:3001/cancelar-trabajo/${id}`);
    await fetchData();
    await fetchDataActividades();
  }

  const confirmarTrabajo = async(id) => {
    await sendPutRequest(`http://localhost:3001/confirmar-trabajo/${id}`);
    await fetchData();
    await fetchDataActividades();
  }

  const trabajosPendientes = () => {
    try {
      return data
        .filter(trabajo => trabajo.estado === 'confirmado')
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } catch (error) {
      console.error('Error al filtrar y ordenar trabajos:', error);
      return [];
    }
  };
  

  const trabajosAConfirmar = () => {
    try {
      return data
        .filter(trabajo => trabajo.estado === 'pendiente')
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } catch (error) {
      console.error('Error al filtrar y ordenar trabajos:', error);
      return [];
    }
  }

  const todosLosTrabajos = () => {
    try {
      return data
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); 
    } catch (error) {
      console.error('Error al filtrar y ordenar trabajos:', error);
      return [];
    }
  }

  const obtenerIdContrato = (id) => {
    setIdContrato(id);
  }

  const quitarId = () => {
    setIdContrato('');
    fetchDataContrato();
  }

useEffect(() => {
  if (responseCambiarEstado) {
    realizarAccion();
  }
}, [responseCambiarEstado])


const confirmados = trabajosPendientes();
const porConfirmar = trabajosAConfirmar();
const todos = todosLosTrabajos();

  const renderSection = () => {
    switch (activeSection) {
      case 'trabajos-pendientes':
        return <TrabajosPendientes trabajos={confirmados} titulo='Trabajos Confirmados' solicitudPut={cancelarTrabajo}/>;
        case 'confirmar-trabajos':
        return <TrabajosPendientes trabajos={porConfirmar} titulo='Trabajos por confirmar' solicitudPut={cancelarTrabajo} confirmarTrabajo={confirmarTrabajo}/>;
      case 'todos-los-trabajos':
        return <TrabajosPendientes trabajos={todos} titulo='Todos los trabajos' solicitudPut={cancelarTrabajo} confirmarTrabajo={confirmarTrabajo}/>;
        case 'realizar-pagos':
          return <Contratos contratos={dataContratos} obtenerId={obtenerIdContrato} idContrato={idContrato} quitarId={quitarId}/>;
      case 'actividad':
        return <Actividad actividades={dataActividades}/>;
      case 'datos-personales':
        return <DatosPersonalesAdmin/>;
      case 'datos-perfil':
        return <CamposPersonalizados profesionalId={obtenerIdProfesional()}/>;
        case 'cambiar-contrasena':
          return <CambiarContrasena/>;
      default:
        return <h2>Trabajos Pendientes</h2>;
    }
  };

  if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

  return (
    <div className="contenedor-panel-de-control-profesional">
      <BarraPanelDeControl setActiveSection={setActiveSection} />
      <div className="contenedor-secciones-panel-profesional">
        {accionRealizada && (<MensajeExitoso mensaje={responseCambiarEstado} visible={accionRealizada}/>)}
        {renderSection()}
      </div>
    </div>
  );
}

export default PanelDeControlProfesional;
