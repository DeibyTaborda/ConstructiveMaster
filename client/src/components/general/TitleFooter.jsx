import React from "react";
import '../../assets/styles/titlefooter.css';

function TitleFooter({title, className}){
    return(
        <h2 className={`title-footer ${className}`}>{title}</h2>
    );
}

export default TitleFooter;