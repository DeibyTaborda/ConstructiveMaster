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

function SolicitudProfesional() {
  //Estados para gestionar solicitudes de profesionales
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
  const [solicitudesTrabajo, setSolicitudesTrabajos] = useState([]);
  const [urlDelete, setUrlDelete] = useState(null);
  const [columnas, setColumnas] = useState( ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'imagen','created_at', 'Acciones'])

  // Estados para cerrar los modales de confirmación para archivar y aceptar un profesional
  const [openConfirmarAgregarProfesionalModal, setOpenConfirmarAgregarProfesionalModal] = useState(false);
  const [openConfirmarEliminarProfesionalModal, setOpenConfirmarEliminarProfesionalModal] = useState(false);

  //Solicitudes HTTP
    const {loading, error, data, fetchData} = useAxios('http://localhost:3001/solicitud_profesional');
    const {loading: loadingEliminar, response, error: errorEliminar, eliminar} = useDelete(urlDelete);

    useEffect(() => {
      if (data) {
        setSolicitudesTrabajos(data);
      }
    }, [data]);

    useEffect(() => {
      if(openConfirmarAgregarProfesionalModal) {
        setUrlDelete(`http://localhost:3001/solicitud_profesional/${idProfesionalSeleccionado}`);
      } else if (openConfirmarEliminarProfesionalModal) {
        setUrlDelete(`http://localhost:3001/solicitud_profesional/${idProfesionalSeleccionado}/${datosSolicitudSeleccionada().nombre}`);
      }
    }, [openConfirmarAgregarProfesionalModal, openConfirmarEliminarProfesionalModal]);

    const seleccionarId = (id) => {
      setOpenConfirmarAgregarProfesionalModal(true);
      setIdProfesionalSeleccionado(id);
    }

    const agregarProfesional = async() => {
      await eliminar();
      await fetchData();
      setOpenConfirmarAgregarProfesionalModal(false);
    }

    const datosSolicitudSeleccionada = () => {
      return data.find((solicitud) => solicitud.id === idProfesionalSeleccionado);
    }

    const obtenerNombreCompleto = () => {
      const {nombre, apellido} = datosSolicitudSeleccionada();
      return `${nombre} ${apellido}`
    }

    const seleccionarIdBotonArchivar = (id) => {
      setIdProfesionalSeleccionado(id);
      setOpenConfirmarEliminarProfesionalModal(true);
      console.log(idProfesionalSeleccionado);
    }

    const archivarSolicitudProfesional = async() => {
      await eliminar();
      await fetchData();
      setOpenConfirmarEliminarProfesionalModal(false);
    }

    if (!solicitudesTrabajo) return <PaginaDeError/>

    return (
        <div className="contenedor-general-tablas">
            <MenuAdmin />
            <div className="subcontenedor-tablas">
              <div className="contenedor-tablas-admin">
                <TablaAdmin  columns={columnas} data={data} title={'Solitudes de Profesionales'} tableId={'solicitud_profesional'} onClick={seleccionarIdBotonArchivar} onClickEdit={seleccionarId} />
              </div> 
              {openConfirmarAgregarProfesionalModal && (
                <div className="contenedor-modales-position-fixed">
                  <ConfirmarAccionEntidad 
                  titulo='Incorporar a'
                  referencia={obtenerNombreCompleto()}
                  mensaje={'¿Estás seguro de que deseas incorparar el profesional?'}
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
                  mensaje={'¿Estás seguro de que deseas rechazar esta solicitud?'}
                  Icono={TiDeleteOutline}
                  onClickCancelar={() => setOpenConfirmarEliminarProfesionalModal(false)}
                  onClick={archivarSolicitudProfesional}
                  boton1="Rechazar"
                  boton2="Cancelar"
                 />
                </div>
              )}
              {errorEliminar ? <p>{errorEliminar}</p> : ''}
              {response ? <p>{response}</p> : ''}
            </div>
        </div>
    );
}

export default SolicitudProfesional;
