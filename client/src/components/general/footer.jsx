import React from "react";
import '../../assets/styles/footer.css';
import { Link } from "react-router-dom";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok, FaFacebook, FaPhone } from "react-icons/fa";
import TitleFooter from "./TitleFooter";
import { MdEmail } from "react-icons/md";


function Footer(){
    return(
        <footer className="footer">
             <div>
                <TitleFooter title='Páginas' className='titulo-footer-margin'/>
                <ul className="menu-list-footer">
                    <li className="item-list"><Link className="item-menu-footer enlace">Inicio</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Sobre nosotros</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Profesionales</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Categorías</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Trabajos</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Únete</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Iniciar sesión</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace">Registrarse</Link></li>
                </ul>
            </div>
            <div className="container-red-social-list">
                <TitleFooter title='Redes sociales' className='titulo-footer-margin'/>
                <ul className="red-social">
                    <li className="item-list"><Link className="enlace"><AiFillInstagram className="icon-red-social"/></Link></li>
                    <li className="item-list"><Link className="enlace"><FaTiktok className="icon-red-social"/></Link></li>
                    <li className="item-list"><Link className="enlace"><FaFacebook className="icon-red-social"/></Link></li>
                </ul>
            </div>
            <div>
                <TitleFooter title='Contáctanos' className='titulo-footer-margin'/>
                <ul className="menu-list-footer">
                    <li className="item-list"><Link className="item-menu-footer enlace"><FaPhone  className="icon-contacto"/>Teléfono</Link></li>
                    <li className="item-list"><Link className="item-menu-footer enlace"><MdEmail  className="icon-contacto"/>Correo</Link></li> 
                </ul>
            </div>
        </footer>
    );
}

export default Footer;