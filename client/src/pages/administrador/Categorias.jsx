import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Importa axios en lugar de useAxios
import ReactDOM from 'react-dom';
import '../../assets/styles/categorias.css';
import MenuAdmin from '../../components/administrador/MenuAdmin';
import FormularioCategorias from '../../components/administrador/FormularioCategorias';
import CategoryCard from '../../components/administrador/CategoryCard';
import TablaAdmin from '../../components/administrador/TablaAdmin';
import ConfirmDelete from '../../components/administrador/ConfirmDelete';
import useAxios from '../../services/api';
import FormEditarCategoria from '../../components/administrador/FormEditarCategorias';
import SubcategoryContext from "../../context/SubcategoryContext";
import RutaRestringida from '../../components/general/RutaRestringida';

function Categorias() {
  const [datos, setDatos] = useState({ categories: [], subcategories: [] });
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { loading, error, data, errorCode, fetchData } = useAxios('http://localhost:3001/categorias');

  const { setSelectedSubcategory, selectedSubcategory } = useContext(SubcategoryContext);

  const formTitle = 'Subcategorías';
  const titleCategorias = 'Categorías';
  const camposSubcategorias = [
    { label: 'Nombre', name: 'subcategoria', tipo: 'text' },
    { label: 'Imagen', name: 'imagenSubcategoria', tipo: 'file' }
  ];

  const camposCategorias = [
    { label: 'Categoría', name: 'categoria', tipo: 'text' },
    { label: 'Imagen', name: 'imagenCategoria', tipo: 'file' },
  ];

  const columsCategories = ['id', 'categoria', 'img_categoria', 'estado', 'created_at', 'Acciones'];
  const columsSubcategories = ['id', 'id_categoria','subcategoria', 'img_subcategoria','estado', 'created_at', 'Acciones'];

  useEffect(() => {
    if (data) {
      setDatos(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedSubcategory) {
      fetchData();
    }
  }, [selectedSubcategory]);

  const openConfirmDelete = () => setIsOpenDelete(true);

  const categoryDelete = () => {
    fetchData();
    setIsOpenDelete(false);
  };

  const openPortalEdit = () => {
    setIsOpenEdit(true);
  }

  const closePortalEdit = () => {
    setIsOpenEdit(false);
  }

  const update = () => fetchData();

  const acciones = (id, data, tableId) => {
    const selectedCategoryId = data.find((row) => row.id === id);
    const selectedCategory = selectedCategoryId[tableId];
    setSelectedSubcategory({
      tableId,
      categoryId: id,
      nameCategory: selectedCategory,
    });
  }

  if (errorCode === 403 || localStorage.getItem('usuario') === null) return <RutaRestringida/>

  return (
    <div className="container-categorias">
      <MenuAdmin id="menu-admin-categorias" />
      <div className="form-categorias-subcategorias">
        <div className="container-form-categorys">
          <FormularioCategorias
            id="formulario-subcategoria"
            campos={camposSubcategorias}
            title={formTitle}
            onClick={update}
            foreingKeysCategoria={datos.categories}
          />
          <FormularioCategorias
            id="formulario-categoria"
            campos={camposCategorias}
            title={titleCategorias}
            onClick={update}
          />
        </div>

        <div className="container-table-categories">
          <div className="tables-categories-subcategories">
            <TablaAdmin
              columns={columsCategories}
              data={datos.categories}
              title="Categorías"
              tableId="categoria"
              onClick={openConfirmDelete}
              onClickEdit={openPortalEdit}
              acciones={acciones}
            />
          </div>
          <div className="container-categories-subcategories">
            {datos.categories.map((categoria) => (
              <CategoryCard
                key={categoria.id}
                img={categoria.img_categoria ? `http://localhost:3001/${categoria.img_categoria}` : 'iconoImagen.png'}
                nameCategory={categoria.categoria}
              />
            ))}
          </div>

          <div className="tables-categories-subcategories">
            <TablaAdmin
              columns={columsSubcategories}
              data={datos.subcategories}
              title="Subcategorías"
              tableId="subcategoria"
              onClick={openConfirmDelete}
              onClickEdit={openPortalEdit}
              acciones={acciones}
            />
          </div>
          <div className="container-categories-subcategories">
            {datos.subcategories.map((subcategoria) => (
              <CategoryCard
                key={subcategoria.id}
                img={subcategoria.img_subcategoria ? `http://localhost:3001/${subcategoria.img_subcategoria}` : 'iconoImagen.png'}
                nameCategory={subcategoria.subcategoria}
              />
            ))}
          </div>
        </div>

        {isOpenDelete &&
          ReactDOM.createPortal(
            <div id="confirm-delete">
              <ConfirmDelete
                onClick={() => setIsOpenDelete(false)}
                onClickEdit={categoryDelete}
              />
            </div>,
            document.body
          )}
        {isOpenEdit &&
          ReactDOM.createPortal(
            <div className='container-category-edit'>
              <FormEditarCategoria onClick={closePortalEdit} 
                onUpdate={update}
                foreingKeysCategorias={data.categories}
              />
            </div>, 
            document.body
          )
        }
      </div>
    </div>
  );
}

export default Categorias;
