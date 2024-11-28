import React from "react";
import '../../assets/styles/menuAdmin.css';
import { Link } from "react-router-dom";
import { AiTwotoneFolderOpen, AiOutlineFolderAdd } from "react-icons/ai";
import { GrUserWorker, GrTools} from "react-icons/gr";
import { FaUsers, FaFileContract  } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosHome } from "react-icons/io";

function MenuAdmin({id}){

    return(
        <header className="header-admin" id={id}>
            <nav className="nav-admin">
                <ul className="list-items-nav">
                    <li className="items-menu-admin"><Link to='/panel_de_control' className="link-menu-admin"><IoIosHome className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to='/solicitud_profesional' className="link-menu-admin"><AiTwotoneFolderOpen className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to='/profesionales' className="link-menu-admin"><GrUserWorker className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to='/clientes' className="link-menu-admin"><FaUsers className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to='/trabajos' className="link-menu-admin"><AiOutlineFolderAdd className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to="/contratos" className="link-menu-admin"><FaFileContract className="icon-menu-admin"/></Link></li>
                    <li className="items-menu-admin"><Link to='/categorias' className="link-menu-admin"><BiSolidCategory className="icon-menu-admin"/></Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default MenuAdmin;