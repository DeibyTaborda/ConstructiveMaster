import React from "react";
import '../../assets/styles/submitButton.css';

function SubmitButton({id}){
    return(
        <>
            <input type="submit" className="boton-submit" id={id}/>
        </>
    );
}

export default SubmitButton;