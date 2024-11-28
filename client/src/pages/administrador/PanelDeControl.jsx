import React, { useContext, useEffect } from "react";
import "../../assets/styles/panelDeControl.css";
import BarraNavegacionAdmin from "../../components/super-administrador/BarraNavegacionAdmin";
import CardTabla from "../../components/administrador/CardTabla";
import useAxios from "../../services/api";
import RutaRestringida from "../../components/general/RutaRestringida";
import { TablasBdContext } from "../../context/TablasBdContext";
import { UsuarioContexto } from "../../context/UsuarioContexto";
import useEfectoEscritura from '../../hooks/useEfectoEscritura';

function PanelDeControl() {
const {tablasBD, actualizarTablasBD} = useContext(TablasBdContext);
const {usuario} = useContext(UsuarioContexto);

  const { loading, error, data, errorCode, fetchData } = useAxios("http://localhost:3001/panel_de_control");

  function EfectoEscritura({ texto, velocidad }) {
    const textoMostrado = useEfectoEscritura(texto, velocidad);
  
    return <p>{textoMostrado}</p>;
  }

  useEffect(() => {
    if (data) {
      actualizarTablasBD(data.data);
    }
  }, [data]); 

  if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>
  if (!data) return <p>Error 404</p>

  return (
    <>
      <BarraNavegacionAdmin />
      {data?.datauser && (
            <h2 className="bienvenida-admin-super-admin-tablas">
              <EfectoEscritura texto={`Base de datos de ${usuario.nombre} `} velocidad={50}/>
            </h2>
      )}
 
      {tablasBD && (
        <div className="container-cards-img-tabla">
          {Object.keys(tablasBD).map((key) => (
            <CardTabla
              key={tablasBD[key].id}
              nombreTabla={tablasBD[key].nombre_tabla}
              urlTabla={tablasBD[key].url_tabla}
              imagenTabla={`http://localhost:3001/${tablasBD[key].imagen_tabla || 'uploads/imagenes/iconoImagen.png'}`}
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

