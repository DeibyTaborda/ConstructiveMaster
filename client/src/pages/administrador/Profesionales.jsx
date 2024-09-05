import React, { useEffect, useState } from "react";
import '../../assets/styles/profesionales.css';
import MenuAdmin from "../../components/administrador/MenuAdmin";
import TablaAdmin from "../../components/administrador/TablaAdmin";
import useAxios from "../../services/api";
import TarjetaAgregarEntidad from "../../components/administrador/TarjetaAgregarEntidad";
import FormAgregarProfesional from "../../components/super-administrador/FormAgregarProfesional";
import usePostRequest from "../../services/usePostRequest";

function Profesionales() {
    const [errores, setErrores] = useState(null);
    const [respuestas, setRespuestas] = useState(null);
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/profesionales');
    const {loading: loadingAgregar, error: errorAgregar, response: responseAgregar, postRequest} = usePostRequest('http://localhost:3001/profesionales');

    const columnas = ['id', 'nombre', 'apellido', 'especialidad', 'correo', 'telefono', 'curriculum', 'contrasena', 'imagen', 'Acciones'];

    const crearProfesional = async(formData) => {
        setErrores('');
        setRespuestas('');
        await postRequest(formData);
        await fetchData();
    }

    useEffect(() => {
        if (errorAgregar) {
            setErrores(errorAgregar);
            setRespuestas(''); // Limpiar respuesta en caso de error
        } else if (responseAgregar) {
            setRespuestas(responseAgregar);
            setErrores(''); // Limpiar errores en caso de respuesta exitosa
        }
    }, [errorAgregar, responseAgregar]);
    

    return(
        <>
            <div className="container-menu-table">
                <MenuAdmin />
                <div className="container-table-solicitud-profesional">
                    <div className="hola">
                        <TablaAdmin  columns={columnas}  title={'Profesionales'} data={data}/>                 
                    </div>
                    <TarjetaAgregarEntidad cadena={'Agregar profesional'}/>
                    <div>
                        <FormAgregarProfesional onClickCrear={crearProfesional}/>
                        {respuestas && <p>{respuestas}</p>}
                        {errores && typeof errores === 'string' ? (
                            <p>{errores}</p>
                        ) : (
                            errores && Object.values(errores).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profesionales; 