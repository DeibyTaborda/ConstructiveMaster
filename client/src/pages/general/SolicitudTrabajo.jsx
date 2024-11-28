import React, {useEffect, useState, useRef} from "react";
import '../../assets/styles/solicitudTrabajo.css';
import Menu from "../../components/general/Menu";
 import FormContratarProfesional from "../../components/general/FormularioContratarProfesional";
 import BarraDeBusqueda from "../../components/general/BarraDeBusqueda";
import useAxios from "../../services/api";
import CartaProfesional from "../../components/Profesionales/CartaProfesional";
import TarjetaSubcategoria from "../../components/general/TarjetaSubcategoria";
import usePostRequestJson from "../../services/usePostRequestJson";
import CartaProfesionaCuadrada from "../../components/Profesionales/CartaProfesionalCuadrada";
import Footer from "../../components/general/footer";
import TarjetaError from "../../components/general/TarjetaError";
import PaginaDeError from "../../components/general/PaginaDeError";
import { IoMdClose } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";

function SolicitudTrabajo() {
    // Estado para manejar la barra de busqueda
    const [busqueda, setBusqueda] = useState('todos');
    const [prevProfesionalId, setPrevProfesionalId] = useState([]);
    const [datosProfesional, setDatosProfesional] = useState(null); 
    const [idProfesionalContratar, setIdProfesionalContratar] = useState(null);
    const [idSubcategoriaSeleccionada, setIdSubcategoriaSeleccionada] = useState(null);
    const [isOpenSeccionProfesionales, setIsOpenSeccionProfesionales] = useState(false);
    const [isOpenSeccionSubcategorias, setIsOpenSeccionSubcategorias] = useState(false);
    const [isOpenModalProfesional,setIsOpenModalProfesional] = useState(false); 
    const [datosItemSeleccionado, setDatosItemSeleccionado] = useState(null);
    const [confirmarProfesionalProporcionado, setConfirmarProfesionalProporcionado] = useState(false);
    const [buscarNuevoProfesional, setBuscarNuevoProfesional] = useState(false);
    const [mostrarError, setMostrarError] = useState(false);
    const [errores, setErrores] = useState('');
    const [mostrarRespuestaExitosa, setMostrarRespuestaExitosa] = useState(false);
    const [respuestaExitosa, setRespuestaExitosa] = useState('');

    //Hook para realizar la solicitud HTTP
    const {loading, error, errorCode, response, data, fetchData} = useAxios('http://localhost:3001/buscar-profesionales', {busqueda});
    const {loading: loadingSubcategorias, error: errorSubcategorias, response: responseSubcategorias, data: dataSubcategorias, fetchData: fetchDataSubcategorias} = useAxios('http://localhost:3001/subcategorias', {busqueda});
    const {loading: loadingBuscarProfesional, error: errorBuscarProfesional, response: responseBuscarProfesional, postRequestJson} = usePostRequestJson('http://localhost:3001/buscar-profesional-contratar');
    const {loading: loadingCrearTrabajo, error: errorCrearTrabajo, response: responseCrearTrabajo, postRequestJson : postRequestJsonCrearTrabajo} = usePostRequestJson('http://localhost:3001/solicitud/trabajo');

    const navigate = useNavigate();
    
    const mostrarMensajeDeError = (mensajeError) => {
        setErrores(mensajeError);
        setMostrarError(true);

        setTimeout(() => {
            setMostrarError(false);
        }, 3000);
    };

    const mostrarMensajeDeRespuestaExitosa = (mensajeError) => {
        setRespuestaExitosa(mensajeError);
        setMostrarRespuestaExitosa(true);

        setTimeout(() => {
            setMostrarRespuestaExitosa(false);
        }, 3000);
    };


    // Función par seleccionar el item
    const seleccionarItem = async(item) => {
        if (item === 'profesional') {
            fetchData();
            setIsOpenSeccionProfesionales(!isOpenSeccionProfesionales);
            setIsOpenSeccionSubcategorias(false);
        } else if (item === 'especialidad') {
            fetchDataSubcategorias();
            setIsOpenSeccionSubcategorias(!isOpenSeccionSubcategorias);
            setIsOpenSeccionProfesionales(false);
        } else {
            setIsOpenSeccionProfesionales(false);
            setIsOpenSeccionProfesionales(false);
        }
    }

    // Función para cerrar el contenedor de profesionales
    const cerrarContenedores = () => {
        if (isOpenSeccionProfesionales) {
            setIsOpenSeccionProfesionales(false);
        } else if (isOpenSeccionSubcategorias) {
            setIsOpenSeccionSubcategorias(false);
        }
    }

    // Funciones para obtener el id del profesional y de la subcategoría
    const obtenerIdProfesional = (id) => {
        if (!id) {
            return;
        }
        setIdSubcategoriaSeleccionada('');
        setIdProfesionalContratar(id);
        cerrarContenedores();
    };
    
    const obtenerIdSubcategoria = (id) => {
        if (!id) {
            return;
        }
        setIdProfesionalContratar('');
        setIdSubcategoriaSeleccionada(id);
        cerrarContenedores();
    }

    //Funciones capturar los datos del profesional seleccionado y la especialidad seleccionada
    const encontrarDatosSeleccionados = (data, id) => {
        if (Array.isArray(data) && data.length > 0) {
          return data?.find(item => item.id === id);
        } else {
          mostrarMensajeDeError('No se encontraron los datos solicitados. Por favor, inténtalo de nuevo.');
          return;
        }
      };
     
    const enviarDatosItemSeleccionado = () => {
        if (idProfesionalContratar) {
            const datosProfesional = encontrarDatosSeleccionados(data, idProfesionalContratar);
            return setDatosItemSeleccionado(datosProfesional);
        } else if (idSubcategoriaSeleccionada) {
            const datosEspecialidad = encontrarDatosSeleccionados(dataSubcategorias, idSubcategoriaSeleccionada);
            return setDatosItemSeleccionado(datosEspecialidad);
        }
    }    

    /*Hook para cuando el id de un item llegue a uno de los estados se ejecute una función que permite obtener 
    todoe los datos de ese item y enviarlos al Estado item seleccionado para que luego pase los datos al formulairo*/
    useEffect(() => {
        enviarDatosItemSeleccionado();
    }, [idProfesionalContratar, idSubcategoriaSeleccionada]);

    /* Función que se ejecutará para manejar la respuesta del servidor cuando el profesional halla ingresado una especialidad. 
    El sistema enviará un profesional relacionado con la especialidad que el usuario seleccionó y se le mostrará en un model.*/
    const abrirModalProfesional = async (responseBuscarProfesional) => {
        try {
            if (responseBuscarProfesional && responseBuscarProfesional.profesional.length > 0) {
                const profesionalOtorgado = responseBuscarProfesional.profesional[0];
        
                if (!prevProfesionalId.includes(profesionalOtorgado.id)) {
                    setPrevProfesionalId(prevExcluidoId => [...prevExcluidoId, profesionalOtorgado.id]);
                    setDatosProfesional(profesionalOtorgado);
                }
                setIsOpenModalProfesional(true);
            } else {
            
                console.log("No hay más profesionales disponibles, volviendo a intentar...");
                setTimeout(() => {
                    postRequestJson({ excluidos: prevProfesionalId }); 
                }, 1000);
            }
        } catch (error) {
            setPrevProfesionalId([]);
            mostrarMensajeDeError('No existe más profesionales, por favor realiza la busqueda nuevamente');
        }
    };
    
    
    
    useEffect(() => {
        if (responseBuscarProfesional) {
            abrirModalProfesional(responseBuscarProfesional);
        }
    }, [responseBuscarProfesional]);

    const confirmarProfesional = () => {
        if (localStorage.getItem('token') !== null) {
            setConfirmarProfesionalProporcionado(true);
            setIsOpenModalProfesional(false);
        } else {
            navigate('/login');
        }
    }

    const cancelar = () => setBuscarNuevoProfesional(false);

    const elegirOtroProfesional = () => {
        setBuscarNuevoProfesional(true);
        setIsOpenModalProfesional(false);
    }

    useEffect(() => {
        if (busqueda) {
            fetchData();
            fetchDataSubcategorias();
        }
    }, [busqueda]);

  
    const buscarProfesional = (busqueda) => {
        setBusqueda(busqueda);
    }

    useEffect(() => {
        if (responseCrearTrabajo) {
            mostrarMensajeDeRespuestaExitosa(responseCrearTrabajo);
        }
    }, [responseCrearTrabajo]);

    if (error) return <PaginaDeError errorCode={errorCode}/>
    
    return(
        <>
            <Menu/>
            <div className="contenedor-formulario-solicitud-trabajo">
                {mostrarRespuestaExitosa && (
                    <p className="mensaje-respuesta-exitosa">{respuestaExitosa}</p>
                )}
                <FormContratarProfesional 
                    seleccionarItem={seleccionarItem} 
                    datosItemSeleccionado={datosItemSeleccionado}
                    solicitudPOST={postRequestJson}
                    excluidoId={prevProfesionalId ? prevProfesionalId : null}
                    solicitudPOST2={postRequestJsonCrearTrabajo}
                    buscarNuevoProfesional={buscarNuevoProfesional ? buscarNuevoProfesional : null}
                    IdprofesionalProporcionado={confirmarProfesionalProporcionado && datosProfesional ? datosProfesional.id : null }
                    latop={elegirOtroProfesional}
                    cancel={cancelar}
                />

                    {(isOpenSeccionProfesionales || isOpenSeccionSubcategorias) && (
                    <div>
                        <div>
                            <div className="contenedor-profesionales-seleccionar">
                                    <BarraDeBusqueda 
                                        name='busqueda_profesional'
                                        placeholder='Buscar profesional'
                                        solicitudGET={buscarProfesional}
                                    />
                                    <IoMdClose className="boton-cerrar-seccion" onClick={() => cerrarContenedores()}/>

                                <div className="subcontenedor-profesionales-seleccionar">
                                    {isOpenSeccionProfesionales && data && data.map((profesional, index) => (
                                        <div key={index} className="contenedor-carta-profesional-solicitud-trabajo">
                                            <CartaProfesional 
                                                imagen={profesional.imagen}
                                                nombre={profesional.nombre}
                                                especialidad={profesional.especialidad}
                                                disponibilidad={profesional.estado}
                                                onClick={() => obtenerIdProfesional(profesional.id)}
                                            />
                                        </div>
                                    ))}
                            
                                    {isOpenSeccionSubcategorias && dataSubcategorias && dataSubcategorias.map((subcategoria, index) => (
                                        <div  key={index} className="contenedor-carta-profesional-solicitud-trabajo">
                                            <TarjetaSubcategoria
                                                imagen={subcategoria.img_subcategoria}
                                                subcategoria={subcategoria.subcategoria}
                                                onClick={() => obtenerIdSubcategoria(subcategoria.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isOpenModalProfesional && responseBuscarProfesional && responseBuscarProfesional.profesional && (
                    <div className="contenedor-profesionales-seleccionar">
                        {responseBuscarProfesional.profesional.map((profesional) => (
                            <div key={profesional.id} className="contenedor-carta-profesional-a-seleccionar">
                                <CartaProfesionaCuadrada
                                    imagen={profesional.imagen}
                                    nombre={profesional.nombre}
                                    especialidad={profesional.especialidad}
                                    onClick={confirmarProfesional}
                                    buscarOtroProfesional={elegirOtroProfesional}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer/>

            {mostrarError && (
                <TarjetaError mensajeError={errores}/>
            )}
        </>
    );
}

export default SolicitudTrabajo;
















































// import React, {useEffect, useState, useRef} from "react";
// import '../../assets/styles/solicitudTrabajo.css';
// import Menu from "../../components/general/Menu";
// import FormContratarProfesional from "../../components/general/FormularioContratarProfesional";
// import BarraDeBusqueda from "../../components/general/BarraDeBusqueda";
// import useAxios from "../../services/api";
// import CartaProfesional from "../../components/Profesionales/CartaProfesional";
// import TarjetaSubcategoria from "../../components/general/TarjetaSubcategoria";
// import usePostRequestJson from "../../services/usePostRequestJson";
// import CartaProfesionaCuadrada from "../../components/Profesionales/CartaProfesionalCuadrada";

// function SolicitudTrabajo() {
//     // Estado para manejar la barra de busqueda
//     const [busqueda, setBusqueda] = useState('todos');
//     const [prevProfesionalId, setPrevProfesionalId] = useState(null);
//     const [datosProfesional, setDatosProfesional] = useState(null);
//     const [idProfesionalContratar, setIdProfesionalContratar] = useState(null);
//     const [idSubcategoriaSeleccionada, setIdSubcategoriaSeleccionada] = useState(null);
//     const [isOpenSeccionProfesionales, setIsOpenSeccionProfesionales] = useState(false);
//     const [isOpenSeccionSubcategorias, setIsOpenSeccionSubcategorias] = useState(false);
//     const [isOpenModalProfesional,setIsOpenModalProfesional] = useState(false); 
//     const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
//     const [confirmarProfesionalProporcionado, setConfirmarProfesionalProporcionado] = useState(false);
//     const [buscarNuevoProfesional, setBuscarNuevoProfesional] = useState(false);

//     //Hook para realizar la solicitud HTTP
//     const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/buscar-profesionales', {busqueda});
//     const {loading: loadingSubcategorias, error: errorSubcategorias, response: responseSubcategorias, data: dataSubcategorias, fetchData: fetchDataSubcategorias} = useAxios('http://localhost:3001/subcategorias', {busqueda});
//     const {loading: loadingBuscarProfesional, error: errorBuscarProfesional, response: responseBuscarProfesional, postRequestJson} = usePostRequestJson('http://localhost:3001/buscar-profesional-contratar');
//     const {loading: loadingCrearTrabajo, error: errorCrearTrabajo, response: responseCrearTrabajo, postRequestJson : postRequestJsonCrearTrabajo} = usePostRequestJson('http://localhost:3001/solicitud/trabajo');

//     // Función par seleccionar el item
//     const seleccionarItem = async(item) => {
//         if (item === 'profesional') {
//             fetchData();
//             setIsOpenSeccionProfesionales(!isOpenSeccionProfesionales);
//             setIsOpenSeccionSubcategorias(false);
//         } else if (item === 'especialidad') {
//             fetchDataSubcategorias();
//             setIsOpenSeccionSubcategorias(!isOpenSeccionSubcategorias);
//             setIsOpenSeccionProfesionales(false);
//         } else {
//             setIsOpenSeccionProfesionales(false);
//             setIsOpenSeccionProfesionales(false);
//         }
//     }

//     // Funciones para obtener el id del profesional y de la subcategoría
//     const obtenerIdProfesional = (id) => {
//         if (!id) {
//             return;
//         }
    
//         setIdSubcategoriaSeleccionada('');
//         setIdProfesionalContratar(id);
//         setIsOpenSeccionProfesionales(false);
//         console.log('id del profesional:', id);
//     };
    

//     const obtenerIdSubcategoria = (id) => {
//         if (!id) {
//             return;
//         }
//         setIdProfesionalContratar('');
//         setIdSubcategoriaSeleccionada(id);
//         setIsOpenSeccionSubcategorias(false);
//     }

//     // Función para cerrar el contenedor de profesionales
//     const cerrarContenedores = () => {
//         if (isOpenSeccionProfesionales) {
//             setIsOpenSeccionProfesionales(false);
//         } else if (isOpenSeccionSubcategorias) {
//             setIsOpenSeccionSubcategorias(false);
//         }
//     }
    
//     // Funciones capturar los datos del profesional seleccionado y la especialidad seleccionada
//     const encontrarDatosSeleccionados = (data, id) => {
//         if (Array.isArray(data) && data.length > 0) {
//           return data?.find(item => item.id === id);
//         } else {
//           console.error('Datos inválidos: data no es un arreglo o está vacío');
//           return null;
//         }
//       };
     
//     const enviarDatosItemSeleccionado = () => {
//         if (idProfesionalContratar) {
//             return encontrarDatosSeleccionados(data, idProfesionalContratar);
//         } else if (idSubcategoriaSeleccionada) {
//             return encontrarDatosSeleccionados(dataSubcategorias, idSubcategoriaSeleccionada);
//         }
//     }    

//     // const elegirProfesionalOBuscarOtro = () => {
//     //     setConfirmarProfesionalProporcionado(!confirmarProfesionalProporcionado);
//     //     setBuscarNuevoProfesional(!buscarNuevoProfesional);
//     // };
    
//     // Hook para cuando el id de un item llegue a uno de los estados se ejecute una función que permite obtener todoe los datos de ese item
//     useEffect(() => {
//         const datos = enviarDatosItemSeleccionado();
//         setProfesionalSeleccionado(datos);
//         console.log('Estos son los datillos: ' , datos);
//     }, [idProfesionalContratar, idSubcategoriaSeleccionada])

//     const buscarProfesionalContratar = (responseBuscarProfesional) => {
//         try {
//             console.log('Respuesta del controlado para buscar un profesional: ', responseBuscarProfesional);
//             setPrevProfesionalId(responseBuscarProfesional.id);
//             setDatosProfesional(responseBuscarProfesional); 
//             setIsOpenModalProfesional(true);
//         } catch (error) {
//             console.log('No se puedieron actualizar los datos correctamente')
//         }

//     }

//     const cerrarModalConfirmacion = () => setIsOpenModalProfesional(false);

//     const confirmarProfesional = (datosProfesional, id) => {
//         setConfirmarProfesionalProporcionado(true)
//         setDatosProfesional(datosProfesional);
//         cerrarModalConfirmacion();
//     }

//     const buscarOtroProfesional = () => {
//         setBuscarNuevoProfesional(true);
//         setPrevProfesionalId(datosProfesional.id); // Asegúrate de excluir el profesional actual
//         // Puedes incluir la lógica para solicitar un nuevo profesional aquí si es necesario
//         setIdProfesionalContratar(null); // Limpiar el ID del profesional para solicitar uno nuevo
//         cerrarModalConfirmacion();
//     }


//     useEffect(() => {
//         if (responseBuscarProfesional && Array.isArray(responseBuscarProfesional.profesional) && responseBuscarProfesional.profesional.length > 0) {
//           buscarProfesionalContratar(responseBuscarProfesional.profesional[0]);
//           console.log('Así se accede al array', responseBuscarProfesional.profesional[0]);
//         } else {
//           console.error('responseBuscarProfesional o profesional está vacío o es null');
//         }
//       }, [responseBuscarProfesional]);
      

//     useEffect(() => {
//         if (busqueda) {
//             fetchData();
//             fetchDataSubcategorias();
//             console.log('esta es la búsqueda realizada: ', busqueda);
//         }
//     }, [busqueda]);


//     useEffect(() => {
//         if (responseBuscarProfesional && prevProfesionalId) {
//             const datosProfesionalProporcionada = encontrarDatosSeleccionados(responseBuscarProfesional, prevProfesionalId);
//             setDatosProfesional(datosProfesionalProporcionada);
//             console.log(datosProfesionalProporcionada);
//         }
//     }, [prevProfesionalId, responseBuscarProfesional]);
    

//     const buscarProfesional = (busqueda) => {
//         setBusqueda(busqueda);
//     }
    
//     useEffect(() => {
//         console.log('Este es el id del profesional que no se incluira', prevProfesionalId)
//     }, [prevProfesionalId]);


//     return(
//         <>
//             <Menu/>
//             <div className="contenedor-formulario-solicitud-trabajo">
//             <FormContratarProfesional 
//                 seleccionarItem={seleccionarItem} 
//                 datosItemSeleccionado={profesionalSeleccionado}
//                 solicitudPOST={postRequestJson}
//                 excluidoId={prevProfesionalId ? prevProfesionalId : null}
//                 solicitudPOST2={postRequestJsonCrearTrabajo}
//                 buscarNuevoProfesional={buscarNuevoProfesional}
//                 IdprofesionalProporcionado={confirmarProfesionalProporcionado && datosProfesional ? datosProfesional.id : null }
//             />

//                 {(isOpenSeccionProfesionales || isOpenSeccionSubcategorias) && (
//                 <div>
//                     <div>
//                         <div className="contenedor-profesionales-seleccionar">
//                                 <BarraDeBusqueda 
//                                     name='busqueda_profesional'
//                                     placeholder='Buscar profesional'
//                                     solicitudGET={buscarProfesional}
//                                 />
//                                 <button onClick={() => cerrarContenedores()}>
//                                     cerrar
//                                 </button>



//                             <div className="subcontenedor-profesionales-seleccionar">
//                                 {isOpenSeccionProfesionales && data && data.map((profesional, index) => (
//                                     <div key={index} className="contenedor-carta-profesional-solicitud-trabajo">
//                                         <CartaProfesional 
//                                             imagen={profesional.imagen}
//                                             nombre={profesional.nombre}
//                                             especialidad={profesional.especialidad}
//                                             disponibilidad={profesional.estado}
//                                             onClick={() => obtenerIdProfesional(profesional.id)}
//                                         />
//                                     </div>
//                                 ))}
                           
//                                 {isOpenSeccionSubcategorias && dataSubcategorias && dataSubcategorias.map((subcategoria, index) => (
//                                     <div  key={index} className="contenedor-carta-profesional-solicitud-trabajo">
//                                     <TarjetaSubcategoria
//                                         subcategoria={subcategoria.subcategoria}
//                                         onClick={() => obtenerIdSubcategoria(subcategoria.id)}
//                                     />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {isOpenModalProfesional && responseBuscarProfesional && responseBuscarProfesional.profesional && (
//                 <div className="contenedor-profesionales-seleccionar">
//                     {responseBuscarProfesional.profesional.map((profesional) => (
//                         <CartaProfesionaCuadrada
//                             key={profesional.id} 
//                             nombre={profesional.nombre}
//                             especialidad={profesional.especialidad}
//                             onClick={() => confirmarProfesional(profesional, idProfesionalContratar)}
//                             buscarOtroProfesional={() => buscarOtroProfesional()}
//                         />
//                     ))}
//                 </div>
//             )}

//             </div>
//         </>
//     );
// }

// export default SolicitudTrabajo;