import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';
import MenuAdmin from "../../components/administrador/MenuAdmin.jsx";
import TablaAdmin from "../../components/administrador/TablaAdmin.jsx";
import FormularioEditarContrato from "../../components/administrador/FormularioEditarContrato.jsx";
import RutaRestringida from "../../components/general/RutaRestringida.jsx";
import useAxios from "../../services/api";
import { usePutRequest } from "../../services/usePutRequest.js";

function Contratos() {
    // Estados para gestionar trabajos
    const [idContratoSeleccionado, setIdContratoSeleccionado] = useState(null);
    const [isOpenFormulario, setIsOpenFormulario] = useState(false);
    const [contratos, setContratos] = useState([]);
    const [errores, setErrores] = useState(null);
    const [respuestasExitosas, setRespuestasExitosas] = useState(null);
    const [estado_pago, setEstadoPago] = useState('todos');
    const [columnas, setColumnas] = useState([
        'id', 'fecha_firma', 'fecha_inicio', 'fecha_fin', 'valor_total', 'forma_pago', 'id_trabajo', 'estado_pago', 'Acciones'
    ]);

    const estilos = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        zIndex: 100
    };

    // Hooks personalizados para peticiones
    const { loading: loadingActualizar, error: errorActualizar, response: responseActualizar, sendPutRequest } = usePutRequest();
    const { loading: loadingObtener, error: errorObtener, response: responseObtener, data, errorCode, fetchData } = useAxios('http://localhost:3001/contratos', {estado_pago});


    // Manejo de cambio en el estado del trabajo
    const handleChange = async (e) => {
        const {value} = e.target;
        setEstadoPago(value);
    };

    // Efectos para manejar actualizaciones en estado y respuestas
    useEffect(() => {
        if (estado_pago) {
            fetchData()
        } 
    }, [estado_pago]);


    useEffect(() => {
        if (data) {
            setContratos(data)
        }
    }, [data]);

    useEffect(() => {
        if (errorObtener) {
            setErrores(errorObtener);
            setRespuestasExitosas('');
        }
    }, [errorObtener]);

    useEffect(() => {
        if (idContratoSeleccionado) console.log(idContratoSeleccionado);
    }, [idContratoSeleccionado]);

    useEffect(() => {
        if (errorActualizar) {
            setErrores(errorActualizar);
            setRespuestasExitosas('');
        }
    }, [errorActualizar]);

    useEffect(() => {
        if (responseActualizar) {
            setRespuestasExitosas(responseActualizar);
            setErrores('');
            setTimeout(() => {
                setRespuestasExitosas('');
            }, 2000)
        }
    }, [responseActualizar]);

    const obtenerId = (id) => {
        setIdContratoSeleccionado(id);
        setIsOpenFormulario(!isOpenFormulario);
    }

    const datosContratoSelecionado = () => {
        const contrato = contratos.find(contrato => contrato.id === idContratoSeleccionado);
        return contrato;
    }

    const actulizarContrato = (data) => {
        sendPutRequest(`http://localhost:3001/contratos/${idContratoSeleccionado}`, data);
        setIsOpenFormulario(false);
        fetchData();
    }

    if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

    // Render del componente
    return (
        <div className="contenedor-general-tablas">
            <MenuAdmin />
            <div className="subcontenedor-tablas">
                <div className="contenedor-tablas-admin">
                    {/* Selector para cambiar el estado del trabajo */}
                    <select name="estado_id" onChange={handleChange}>
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>

                    {/* Tabla con los trabajos */}
                    <TablaAdmin
                        columns={columnas}
                        data={contratos}
                        title={'Contratos'}
                        tableId={'contratos'}
                        onClickEdit={obtenerId}
                    />
                </div>
                {isOpenFormulario && (
                    <div className="contenedor-form-editar-contrato" style={estilos}>
                        <FormularioEditarContrato
                            data={datosContratoSelecionado()}
                            solicitudPut={actulizarContrato}
                            cerrarFormulario={() => setIsOpenFormulario(false)}
                        />
                    </div>
                )}

                {/* Mostrar errores o respuestas exitosas */}
                {typeof errores === 'object' && errores !== null ? (
                    Object.values(errores).map((error, index) => <p key={index}>{error}</p>)
                ) : (
                    <p>{errores}</p>
                )}
                {respuestasExitosas && <p className="mensaje-exitoso">{respuestasExitosas}</p>}
            </div>
        </div>
    );
}

export default Contratos;
