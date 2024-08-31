import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../../assets/styles/menu.css';
import { IoMdMenu } from "react-icons/io";
import { FaHome, FaHammer, FaUser  } from "react-icons/fa";
import { HiUserGroup, HiMiniKey } from "react-icons/hi2";
import { GrUserWorker } from "react-icons/gr";
import { TbCategoryFilled } from "react-icons/tb";
import { PiHandshakeFill } from "react-icons/pi";


function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header-general">
            <div className="logo-container">
                <img src="logo.png" alt="Logo" className="logo"/>
            </div>
            <nav className={`navegation-menu ${isOpen ? 'open' : ''}`}>
                <li className="menu-item"><Link className="link-menu"><FaHome className="icon-menu"/>Inicio</Link></li>
                <li className="menu-item"><Link className="link-menu"><HiUserGroup className="icon-menu"/>Acerca de nosotros</Link></li>
                <li className="menu-item"><Link className="link-menu"><GrUserWorker className="icon-menu"/>Profesionales</Link></li>
                <li className="menu-item"><Link className="link-menu"><TbCategoryFilled className="icon-menu"/>Categorías</Link></li>
                <li className="menu-item"><Link className="link-menu"><FaHammer className="icon-menu"/>Trabajos</Link></li>
                <li className="menu-item"><Link to='/unete' className="link-menu"><PiHandshakeFill className="icon-menu"/>Únete</Link></li>
                <li className="menu-item"><Link to='/login' className="link-menu"><HiMiniKey className="icon-menu"/>Iniciar sesión</Link></li>
                <li className="menu-item"><Link to='/registro' className="link-menu"><FaUser className="icon-menu"/>Registrate</Link></li>            
            </nav>
            <div className="logo-menu" onClick={toggleMenu}>
                <IoMdMenu size={25}/>
            </div>
        </header>
    );
}

export default Menu;
