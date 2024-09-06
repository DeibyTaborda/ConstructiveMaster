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
import { UsuarioProveedor } from "../context/UsuarioContexto";
import { TablasProveedor } from "../context/TablasBdContext";
import Profesionales from "../pages/administrador/Profesionales";
import Trabajos from "../pages/administrador/Trabajos";

function Aplication(){
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    return(
        <>
        <SubcategoryContext.Provider value={{selectedSubcategory, setSelectedSubcategory}}>
            <UsuarioProveedor>
                <TablasProveedor>
                    <Routes>
                        <Route path="/login" element={<InicioSesion/>}/>
                        <Route path="/registro" element={<Registro/>}/>
                        <Route path="/unete" element={<Unete/>}/>

                        <Route path="/solicitud_profesional" element={<SolicitudProfesional/>}/>
                        <Route path="/clientes" element={<Clientes/>}/>
                        <Route path="/categorias" element={<Categorias/>}/>
                        <Route path="/panel_de_control" element={<PanelDeControl/>} />
                        <Route path="/datos/personales" element={<DatosPersonalesAdmin/>}/>
                        <Route path="/profesionales" element={<Profesionales/>}/>
                        <Route path="/trabajos" element={<Trabajos/>} />
                    </Routes> 
                </TablasProveedor>
            </UsuarioProveedor>
        </SubcategoryContext.Provider>
        </>
    );
}

export default Aplication;