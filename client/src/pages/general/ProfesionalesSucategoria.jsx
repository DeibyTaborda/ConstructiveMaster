import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/profesionalesSubcategoria.css';
import CartaProfesional from "../../components/Profesionales/CartaProfesional";
import { ProfesionalesContext } from "../../context/ProfesionalesContext";
import { SubcategoriasContext } from "../../context/SubcategoriasContext";
import Footer from "../../components/general/footer";
import Menu from "../../components/general/Menu";

function ProfesionalesSubcategoria() {
    const navigate = useNavigate();
    const { profesionales } = useContext(ProfesionalesContext);
    const {subcategorias} = useContext(SubcategoriasContext);

    const obtenerIdSubcategoria = () => {
        const idSubcategoria = localStorage.getItem('id_subcategoria');
        return idSubcategoria ? parseInt(idSubcategoria, 10) : null; 
    }

    const guardarProfesionalSeleccionado = (profesional) => {
        try {
            localStorage.setItem('profesionalAContratar', JSON.stringify(profesional));
            if (localStorage.getItem('token') !== null) {
                return navigate('/solicitud/trabajo');
            } else {
                navigate('/login');
            }
        } catch (error) {
            return;
        }
    };

    const idSubcategoria = obtenerIdSubcategoria();
    const profesionalesSubcategoria = idSubcategoria ? profesionales.filter(profesional => profesional.id_especialidad === idSubcategoria) : [];

    const NombreEspecialidad = () => {
        try {
            const subcategoria = subcategorias.find(subcategoria => subcategoria.id === idSubcategoria);
            return subcategoria.subcategoria;
        } catch (error) {
            return;
        }

    } 
    return (
        <>
        <Menu/>
            <h2 className="titulo-profesionales-subcategoria">{`Profesionales de ${NombreEspecialidad()}`}</h2>
                <section className="section-profesionales-subcategoria">
                {profesionalesSubcategoria.map(profesional => (
                    <div className="contenedor-tarjeta-profesional" key={profesional.id} >
                    <CartaProfesional 
                        imagen={profesional.imagen}
                        nombre={profesional.nombre}
                        especialidad={profesional.especialidad}
                        disponibilidad={profesional.estado}
                        onClick={() => guardarProfesionalSeleccionado(profesional)}
                    />
                    </div>
                ))}
            </section>
            <Footer/>
        </>
    );
}

export default ProfesionalesSubcategoria;
