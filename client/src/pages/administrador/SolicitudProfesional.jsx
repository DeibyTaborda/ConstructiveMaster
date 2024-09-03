import React, { useEffect, useState } from "react";
import '../../assets/styles/inicioAdmin.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import useDelete from "../../services/delete";
import ConfirmarAgregarProfesionalModal from "../../components/super-administrador/ConfirmarAgregarProfesionalModal";

function SolicitudProfesional() {
  //ID seleccionado
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState(null);

  const [openConfirmarAgregarProfesionalModal, setOpenConfirmarAgregarProfesionalModal] = useState(false);

  //Solicitudes HTTP
    const {loading, error, data, fetchData} = useAxios('http://localhost:3001/solicitud_profesional');
    const {loading: loadingEliminar, response, error: errorEliminar, eliminar} = useDelete(`http://localhost:3001/solicitud_profesional/${idProfesionalSeleccionado}`);

    // Columnas de la tabla solicitudes profesionales
    const columnas = ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'created_at', 'Acciones'];

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

    return (
        <div className="container-menu-table">
            <MenuAdmin />
            <div className="container-table-solicitud-profesional">
              <div className="hola">
                <TablaAdmin  columns={columnas} data={data} title={'Solitudes de Profesionales'} tableId={'solicitud_profesional'} onClickEdit={seleccionarId} />
              </div>
              {openConfirmarAgregarProfesionalModal && (
                <div>
                  <ConfirmarAgregarProfesionalModal data={datosSolicitudSeleccionada()} onClick={agregarProfesional}/>
                </div>
              )}
              {errorEliminar ? <p>{errorEliminar}</p> : ''}
              {response ? <p>{response}</p> : ''}
            </div>
        </div>
    );
}

export default SolicitudProfesional;
