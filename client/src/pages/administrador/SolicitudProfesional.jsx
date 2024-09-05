import React, { useEffect, useState } from "react";
import '../../assets/styles/inicioAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import useDelete from "../../services/delete";
import ConfirmarAgregarProfesionalModal from "../../components/super-administrador/ConfirmarAgregarProfesionalModal";
import ConfirmarEliminarCliente from "../../components/administrador/ConfirmarEliminarCliente";


function SolicitudProfesional() {
  //ID seleccionado
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);
  const [urlDelete, setUrlDelete] = useState(null);

  const [openConfirmarAgregarProfesionalModal, setOpenConfirmarAgregarProfesionalModal] = useState(false);
  const [openConfirmarEliminarProfesionalModal, setOpenConfirmarEliminarProfesionalModal] = useState(false);

  //Solicitudes HTTP
    const {loading, error, data, fetchData} = useAxios('http://localhost:3001/solicitud_profesional');
    const {loading: loadingEliminar, response, error: errorEliminar, eliminar} = useDelete(urlDelete);

    // Columnas de la tabla solicitudes profesionales
    const columnas = ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'imagen','created_at', 'Acciones'];

    useEffect(() => {
      if (idProfesionalSeleccionado) {
        console.log(idProfesionalSeleccionado)
      }
    }, [idProfesionalSeleccionado]);

    useEffect(() => {
      if (data) {
        console.log(data);
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

    return (
        <div className="container-menu-table">
            <MenuAdmin />
            <div className="container-table-solicitud-profesional">
              <div className="hola">
                <TablaAdmin  columns={columnas} data={data} title={'Solitudes de Profesionales'} tableId={'solicitud_profesional'} onClick={seleccionarIdBotonArchivar} onClickEdit={seleccionarId} />
              </div>
              {openConfirmarAgregarProfesionalModal && (
                <div className="contenedor-confirmar-eliminar-solicitud">
                  <ConfirmarAgregarProfesionalModal data={datosSolicitudSeleccionada()} onClick={agregarProfesional} onClickCancelar={() => setOpenConfirmarAgregarProfesionalModal(false)}/>
                </div>
              )}
              {openConfirmarEliminarProfesionalModal && (
                <div className="modal-eliminar-solicitud-profesional">
                  <ConfirmarEliminarCliente data={datosSolicitudSeleccionada()} onClick={() => setOpenConfirmarEliminarProfesionalModal(false)} onClickDelete={archivarSolicitudProfesional}/>
                </div>
              )}
              {errorEliminar ? <p>{errorEliminar}</p> : ''}
              {response ? <p>{response}</p> : ''}
            </div>
        </div>
    );
}

export default SolicitudProfesional;
