import React, { useEffect, useState } from "react";
import '../../assets/styles/inicioAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import useDelete from "../../services/delete";
import { TiDeleteOutline } from "react-icons/ti";
import ConfirmarAccionEntidad from "../../components/administrador/ConfirmarAccionEntidad";
import { MdOutlineQuestionMark } from "react-icons/md"
import PaginaDeError from "../../components/general/PaginaDeError";
import ConfirmarAdmisionProfesional from "../../components/administrador/ConfiramacionAdmisionProfesional";
import { useAccionExitosa } from "../../hooks/useAccionExitosa";
import RutaRestringida from "../../components/general/RutaRestringida";

function SolicitudProfesional() {
  // Estados para gestionar las solicitudes y las modales
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
  const [solicitudesTrabajo, setSolicitudesTrabajos] = useState([]);
  const [urlDelete, setUrlDelete] = useState(null);
  const [columnas] = useState(['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'imagen', 'created_at', 'Acciones']);

  const [openConfirmarAgregarProfesionalModal, setOpenConfirmarAgregarProfesionalModal] = useState(false);
  const [openConfirmarEliminarProfesionalModal, setOpenConfirmarEliminarProfesionalModal] = useState(false);

  // Solicitudes HTTP
  const { loading, error, data, errorCode, fetchData } = useAxios('http://localhost:3001/solicitud_profesional');
  const { loading: loadingEliminar, response, error: errorEliminar, eliminar } = useDelete(urlDelete);

  const [respuestaExitosa, setRespuestaExitosa] = useState('');
  const [errores, setErrores] = useState('');
  const { accionRealizada, realizarAccion } = useAccionExitosa(2000);

  useEffect(() => {
    if (data) {
      setSolicitudesTrabajos(data);
    }
  }, [data]);

  useEffect(() => {
    // Reiniciar errores y respuestas exitosas antes de manejar las respuestas
    setErrores('');
    setRespuestaExitosa('');

      if (error || errorEliminar) {
      setRespuestaExitosa('');
      setErrores(error || errorEliminar);
    }
  
    if (response) {
      setErrores('');
      setRespuestaExitosa(response);
    }
  }, [error, errorEliminar, response]);
  
  

  useEffect(() => {
    if (openConfirmarAgregarProfesionalModal) {
      setUrlDelete(`http://localhost:3001/solicitud_profesional/${idProfesionalSeleccionado}`);
    } else if (openConfirmarEliminarProfesionalModal) {
      setUrlDelete(`http://localhost:3001/solicitud_profesional/${idProfesionalSeleccionado}/${datosSolicitudSeleccionada().nombre}`);
    }
  }, [openConfirmarAgregarProfesionalModal, openConfirmarEliminarProfesionalModal]);

  const seleccionarId = (id) => {
    setOpenConfirmarAgregarProfesionalModal(true);
    setIdProfesionalSeleccionado(id);
  };

  const agregarProfesional = async () => {
    await eliminar();
    await fetchData();
    setOpenConfirmarAgregarProfesionalModal(false);
    realizarAccion();
  };

  const datosSolicitudSeleccionada = () => {
    return data.find((solicitud) => solicitud.id === idProfesionalSeleccionado);
  };

  const obtenerNombreCompleto = () => {
    const { nombre, apellido } = datosSolicitudSeleccionada();
    return `${nombre} ${apellido}`;
  };

  const seleccionarIdBotonArchivar = (id) => {
    setIdProfesionalSeleccionado(id);
    setOpenConfirmarEliminarProfesionalModal(true);
  };

  const archivarSolicitudProfesional = async () => {
    await eliminar();
    await fetchData();
    setOpenConfirmarEliminarProfesionalModal(false);
    realizarAccion();
  };

  

  if (!solicitudesTrabajo || localStorage.getItem('usuario') === null) return <PaginaDeError />;
  if (errorCode === 403) return <RutaRestringida/>;

  return (
    <div className="contenedor-general-tablas">
      <MenuAdmin />
      <div className="subcontenedor-tablas">
        <div className="contenedor-tablas-admin">
          <TablaAdmin
            columns={columnas}
            data={data}
            title={'Solicitudes de Profesionales'}
            tableId={'solicitud_profesional'}
            onClick={seleccionarIdBotonArchivar}
            onClickEdit={seleccionarId}
          />
        </div>
        {data && data.length === 0 && (
          <div className="contenedor-sin-solicitudes-de-profesionales">
            <img src="solicitudes.png" alt="solicitudes" />
            <p>No hay solicitudes de profesionales</p>
          </div>
        )}
        {openConfirmarAgregarProfesionalModal && (
          <div className="contenedor-modales-position-fixed">
            <ConfirmarAdmisionProfesional
              titulo="Incorporar a"
              referencia={obtenerNombreCompleto()}
              mensaje="¿Estás seguro de que deseas incorporar al profesional?"
              onClick={agregarProfesional}
              onClickCancelar={() => setOpenConfirmarAgregarProfesionalModal(false)}
              Icono={MdOutlineQuestionMark}
              boton1="Aceptar"
              boton2="Cancelar"
            />
          </div>
        )}

        {openConfirmarEliminarProfesionalModal && (
          <div className="contenedor-modales-position-fixed">
            <ConfirmarAccionEntidad
              titulo="Rechazar Solicitud de"
              referencia={obtenerNombreCompleto()}
              mensaje="¿Estás seguro de que deseas rechazar esta solicitud?"
              Icono={TiDeleteOutline}
              onClickCancelar={() => setOpenConfirmarEliminarProfesionalModal(false)}
              onClick={archivarSolicitudProfesional}
              boton1="Rechazar"
              boton2="Cancelar"
            />
          </div>
        )}

        {/* Mostrar solo un mensaje a la vez */}
        {accionRealizada && (errores ? <p className="error-eliminar">{errores}</p> : <p className="repuesta-exitosa">{respuestaExitosa}</p>)}
      </div>
    </div>
  );
}

export default SolicitudProfesional;
