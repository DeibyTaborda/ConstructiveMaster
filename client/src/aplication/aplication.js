import React, { useState } from "react";
import {Routes, Route} from 'react-router-dom';
import InicioSesion from "../pages/general/InicioSesion";
import Registro from "../pages/general/Registro";
import Unete from "../pages/general/Unete";
import SolicitudProfesional from "../pages/administrador/SolicitudProfesional";
import Clientes from "../pages/administrador/Clientes";
import Categorias from "../pages/administrador/Categorias";
import PanelDeControl from "../pages/administrador/PanelDeControl";
import DatosPersonalesAdmin from "../pages/administrador/DatosPersonalesAdmin";
import SubcategoryContext from "../context/SubcategoryContext";
import Profesionales from "../pages/administrador/Profesionales";
import Trabajos from "../pages/administrador/Trabajos";
import Contratos from "../pages/administrador/Contratos";
import PerfilesProfesionales from "../pages/general/PerfilesProfesionales";
import ProfesionalBuscado from "../pages/general/ProfesionalBuscado";
import SolicitudTrabajo from "../pages/general/SolicitudTrabajo";
import PanelDeUsuario from "../components/client/PanelDeUsuario";
import CambiarContrasena from "../pages/general/CambiarContrasena";
import Inicio from "../pages/general/Inicio";
import CategoriasUsuario from "../pages/general/Categorias";
import Subcategorias from "../pages/general/Subcategorias";
import ProfesionalesSubcategoria from "../pages/general/ProfesionalesSucategoria";
import PanelDeControlProfesional from "../pages/profesional/PanelDeControlProfesional";
import { ProfesionalesProvider } from "../context/ProfesionalesContext";
import {SubcategoriasProveedor} from '../context/SubcategoriasContext';
import {TrabajosProfesionalProvider} from '../context/TrabajosProfesionalContext';
import { UsuarioProveedor } from "../context/UsuarioContexto";
import { TablasProveedor } from "../context/TablasBdContext";

function Aplication(){
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    
    return(
        <>
        <SubcategoryContext.Provider value={{selectedSubcategory, setSelectedSubcategory}}>
            <UsuarioProveedor>
                <TablasProveedor>
                    <ProfesionalesProvider>
                        <SubcategoriasProveedor>
                            <TrabajosProfesionalProvider>
                                <Routes>
                                    {/* Rutas generales*/}
                                    <Route path="/" element={<Inicio/>} />
                                    <Route path="/login" element={<InicioSesion/>}/>
                                    <Route path="/registro" element={<Registro/>}/>
                                    <Route path="/unete" element={<Unete/>}/>
                                    <Route path="/cambiar-contrasena" element={<CambiarContrasena/>} />
                                    <Route path="/datos/personales" element={<DatosPersonalesAdmin/>}/>
                                    <Route path="/profesional-consultado" element={<ProfesionalBuscado/>} />
                                    <Route path="/profesionales/lista" element={<PerfilesProfesionales/>} />
                                    <Route path="/categorias-ejecucion-administracion" element={<CategoriasUsuario/>} />
                                    <Route path="/subcategorias" element={<Subcategorias/>} />
                                    <Route path="/solicitud/trabajo" element={<SolicitudTrabajo/>} />
                                    <Route path="/profesionales-subcategoria" element={<ProfesionalesSubcategoria/>} />
        
                                    {/* Rutas del administrador y superadministrador*/}
                                    <Route path="/solicitud_profesional" element={<SolicitudProfesional/>}/>
                                    <Route path="/clientes" element={<Clientes/>}/>
                                    <Route path="/categorias" element={<Categorias/>}/>
                                    <Route path="/panel_de_control" element={<PanelDeControl/>} />
                                    <Route path="/profesionales" element={<Profesionales/>}/>
                                    <Route path="/trabajos" element={<Trabajos/>} />
                                    <Route path="/contratos" element={<Contratos/>} />

                                    {/* Ruta del cliente */}
                                    <Route path="/panel-de-usuario" element={<PanelDeUsuario/>} />

                                    {/* Rutas del profesional */}
                                    <Route path="/panel-de-control-profesional" element={<PanelDeControlProfesional/>} />
                                    
                                </Routes> 
                            </TrabajosProfesionalProvider>
                        </SubcategoriasProveedor>
                    </ProfesionalesProvider>
                </TablasProveedor>
            </UsuarioProveedor>
        </SubcategoryContext.Provider>
        </>
    );
}

export default Aplication;