import React, { useEffect } from "react";
import Menu from "../../components/general/Menu";
import '../../assets/styles/inicio.css';
import usarEfectoEscritura from "../../hooks/useEfectoEscritura";
import { Navigate, useNavigate } from "react-router-dom";
import useAxios from "../../services/api";
import CartaProfesional from "../../components/general/CartaProfesional";
import TarjetaSubcategoria from "../../components/general/TarjetaSubcategoria";
import Footer from "../../components/general/footer";

function Inicio() {
    const navigate = useNavigate();
    const textoMontrado = usarEfectoEscritura('Bienvenido a ConstructiveMaster');
    const {loading, response, error, data} = useAxios('http://localhost:3001/profesionales/disponibles');
    const {loading: loadingSubcategorias, response: responseSubcategorias, error: errorSubcategorias, data: dataSubcategorias} = useAxios('http://localhost:3001/subcategorias');

    const profesionalSeleccionado = (profesional) => {
        const profesionalParseado = JSON.stringify(profesional);
        localStorage.setItem('profesional_consultado', profesionalParseado);
        navigate('/profesional-consultado');
    }

    const idSubcategoria = (id) => {
        const idParseado = JSON.stringify(id);
        localStorage.setItem('id_subcategoria', idParseado);
        navigate('profesionales-subcategoria');
    }

    return(
        <>
            <Menu/>
                <section className="section-bienvenida-inicio">
                    <img src="bienvenida.png" alt="Imagen de bienvenida" className="imagen-bienvenida"/>
                    <div>
                        <h2>{textoMontrado}</h2>
                        <p>Encuentra a los mejores profesionales del área de la construcción para cada necesidad.</p>
                        <p>!Rápido y fácil!.</p>
                        <button className="link-contratar-profesional" onClick={() => navigate('/profesionales/lista')}>Buscar profesional</button>
                    </div>
                </section>
                <section className="section-cartas-profesionales-inicio">
                    <h2 className="titulo-cartas-profesional-inicio">Profesionales</h2>
                    <p>Encuetra y busca profesionales expertos para cada necesidad. ¡Tenemos el profesional que tanto necesitas!</p>
                    <div className="contenedor-cartas-profesionales-inicio">
                        {data && data.map(profesional => (
                            <CartaProfesional profesional={profesional} key={profesional.id} onClick={() => profesionalSeleccionado(profesional)}/>
                        ))}
                    </div>
                    <button onClick={() => navigate('/profesionales/lista')}>Buscar más profesionales</button>
                </section>
                <section className="section-cartas-subcategorias-inicio">
                    <h2 className="titulo-cartas-subcateogorias-inicio">Especialidades</h2>
                    <p>¡Escoge una de las especilidades y empieza a buscar profesionales!</p>
                    <div className="contenedor-carta-subcategoria-inicio">
                        {dataSubcategorias && dataSubcategorias.map(subcategoria => (
                            <TarjetaSubcategoria 
                                imagen={subcategoria.imagen} 
                                alt={subcategoria.subcategoria}
                                subcategoria={subcategoria.subcategoria}
                                key={subcategoria.id}
                                onClick={() => idSubcategoria(subcategoria.id)}
                            />
                        ))}
                    </div>
                </section>
                <Footer/>
        </> 
    );
}

export default Inicio;