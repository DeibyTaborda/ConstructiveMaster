import React, { useContext, useEffect } from "react";
import "../../assets/styles/panelDeControl.css";
import BarraNavegacionAdmin from "../../components/super-administrador/BarraNavegacionAdmin";
import CardTabla from "../../components/administrador/CardTabla";
import useAxios from "../../services/api";
import FormAddImgTabla from "../../components/super-administrador/FormAddImgTabla";
import { TablasBdContext } from "../../context/TablasBdContext";
import { UsuarioContexto } from "../../context/UsuarioContexto";

function PanelDeControl() {
const {tablasBD, actualizarTablasBD} = useContext(TablasBdContext);
const {usuario} = useContext(UsuarioContexto);

  const { loading, error, data, fetchData } = useAxios("http://localhost:3001/panel_de_control");
   

  useEffect(() => {
    if (data) {
      actualizarTablasBD(data.data);
    }
  }, [data]);

  if (error) return <p>No tienes permiso para acceder a esta ruta</p>
  if (!data) return <p>Error 404</p>

  return (
    <>
      <BarraNavegacionAdmin />
      {data?.datauser && (
            <h2 className="bienvenida-admin-super-admin-tablas">
              Bienvenido {usuario.nombre} a ConstructiveMaster
            </h2>
      )}
 
      {tablasBD && (
        <div className="container-cards-img-tabla">
          {Object.keys(tablasBD).map((key) => (
            <CardTabla
              key={tablasBD[key].id}
              nombreTabla={tablasBD[key].nombre_tabla}
              urlTabla={tablasBD[key].url_tabla}
              imagenTabla={`http://localhost:3001/${tablasBD[key].imagen_tabla}`}
              id={tablasBD[key].id}
              fetchData={fetchData}
              datos={tablasBD}
            />
          ))}
        </div>
      )}
      {/* <FormAddImgTabla fetchData={fetchData} /> */}
    </>
  );
}

export default PanelDeControl;

