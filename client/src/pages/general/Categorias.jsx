import React, { useEffect } from "react";
import '../../assets/styles/categoriasUsuario.css'
import Menu from "../../components/general/Menu";
import CartaCategoria from "../../components/general/CartaCategoria";
import PaginaDeError from "../../components/general/PaginaDeError";
import useAxios from "../../services/api";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/general/footer";

function Categorias() {
    const navigate = useNavigate();
    const {loading, error, response, errorCode,data, fetchData} = useAxios('http://localhost:3001/categorias-ejecucion-administracion');

    const insertarIdEnLocalstorage = (id) => {
        localStorage.setItem('id_categoria', id);
        navigate('/subcategorias')
    }

    if (error) return <PaginaDeError errorCode={errorCode}/>

    return(
        <>
            <Menu/>
            <section className="section-categorias" >
                {data && data.map(categoria => (
                    <CartaCategoria
                        key={categoria.id}
                        imagen={categoria.img_categoria}
                        categoria={categoria.categoria}
                        alt={categoria.categoria}
                        onClick={() => insertarIdEnLocalstorage(categoria.id)}
                    />
                ))}
            </section>
            <Footer/>
        </>

    );
}

export default Categorias;