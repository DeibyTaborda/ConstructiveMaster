import React from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/barraPanelControl.css';
import { IoLogOut } from "react-icons/io5";

function BarraPanelControl({abrirGestionarCuenta, abrirActividad, abrirNotificaciones, abrirPrivacidad, abrirCrearTrabajo, abrirTrabajos, cerrarSesion}) {
    const navigate = useNavigate();

    return (
        <div className="contenedor-barra-panel-de-control">
            <h2>Panel de control</h2>
            <ul className="lista-items-barra-panel-de-control">
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={() => navigate('/profesionales/lista')}>Buscar profesionales</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirTrabajos}>Trabajos</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirActividad}>Actividad</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirNotificaciones}>Notificaciones</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirGestionarCuenta}>Gestionar Cuenta</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirPrivacidad}>Privacidad</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Crear nuevo trabajo</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={cerrarSesion}><IoLogOut size={20}/></button>
                </li>
                {/* <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Contratos</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Gestión de profesionales</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Facturación y Pagos</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Calendario y Recordatorios</button>
                </li>
                <li className="item-barra-panel-de-control">
                    <button className="boton-barra-panel-de-control" onClick={abrirCrearTrabajo}>Soporte y ayuda</button>
                </li> */}
            </ul>
        </div>
    );
}

export default BarraPanelControl;
