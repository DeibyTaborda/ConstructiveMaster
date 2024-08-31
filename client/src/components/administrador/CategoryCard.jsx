import React from "react";
import '../../assets/styles/categoryCard.css';
 
function CategoryCard({img, nameCategory}) {
    return(
        <>
            <div className="container-category-card">
                <div className="container-img-category">
                    <img className="img-category" src={img} alt={nameCategory} />
                </div>
                <p className="category-name">{nameCategory}</p>
            </div>
        </>
    );
}

export default CategoryCard;