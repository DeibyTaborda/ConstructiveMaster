import React, { useContext, useEffect } from "react";
import '../../assets/styles/confirmDelete.css';
import ButtonEliminar from "./ButtonEliminar";
import ButtonEditar from "./ButtonEditar";
import { MdDelete } from "react-icons/md";
import useDelete from "../../services/delete";
import SubcategoryContext from "../../context/SubcategoryContext";

function ConfirmDelete({ id, onClick, onClickEdit }) {
  const { selectedSubcategory } = useContext(SubcategoryContext);
  const { loading, error, response, eliminar } = useDelete(`http://localhost:3001/categorias/${selectedSubcategory.tableId}/${selectedSubcategory.categoryId}`);

  const handleDelete = async () => {
    await eliminar();
    onClickEdit(); // Notify parent to refresh data
    onClick(); // Close the modal
  };

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
    if (response) {
      console.log("Response:", response);
    }
  }, [error, response]);

  return (
    <div className="container-confirm-delete" id={id}>
      <h2 className="title-delete">Eliminar</h2>
      <p className="category-delete">{selectedSubcategory.nameCategory}</p>
      <p className="question-delete">{`¿Quieres eliminar la ${selectedSubcategory.tableId} ${selectedSubcategory.nameCategory}?`}</p>
      <MdDelete size={100} className="icon-confirm-delete"/>
      <div className="botons-confirm">
        <ButtonEditar descripcion={'Eliminar'} onClick={handleDelete} />
        <ButtonEliminar description={'Cancelar'} onClick={onClick} />
      </div>
    </div>
  );
}

export default ConfirmDelete;
