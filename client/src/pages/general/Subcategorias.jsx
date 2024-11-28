import React, { useContext } from 'react';
import '../../assets/styles/subcategorias.css';
import CartaSubcategoria from '../../components/general/CartaSubcategoria';
import { SubcategoriasContext } from '../../context/SubcategoriasContext';
import Menu from '../../components/general/Menu';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/general/footer';

function Subcategorias() {
    const navigate = useNavigate();
    const { subcategorias } = useContext(SubcategoriasContext);

    const obtenerIdCategoria = () => {
        const idCategoria = localStorage.getItem('id_categoria');
        return idCategoria ? parseInt(idCategoria, 10) : null; 
    }

    const almacenarIdSubcategoria = (id) => {
        localStorage.setItem('id_subcategoria', id);
        navigate('/profesionales-subcategoria');
    }

    const idCategoria = obtenerIdCategoria();
    const subcategoriasFiltradas = idCategoria ? subcategorias.filter(subcategoria => subcategoria.id_categoria === idCategoria) : [];

    return (
        <>
            <Menu/>
            <h2 className='titulo-subcategorias'>Especialidades</h2>
            <section className="section-subcategorias-de-ejecucion">
                {subcategoriasFiltradas.map(subcategoria => (
                    <CartaSubcategoria
                        key={subcategoria.id}
                        subcategoria={subcategoria.subcategoria}
                        imagen={subcategoria.img_subcategoria}
                        onClick={() => almacenarIdSubcategoria(subcategoria.id)}
                    />
                ))}
            </section>
            <Footer/>
        </>

    );
}

export default Subcategorias;
