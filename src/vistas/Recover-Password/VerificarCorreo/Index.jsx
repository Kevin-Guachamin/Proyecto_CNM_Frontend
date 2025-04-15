import React from 'react'
import Header from '../../../components/Header';
import VerificarCorreo from './VerificarCorreo';

function Index() {




    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                <Header />
            </div>

            <VerificarCorreo />


        </div>
    )
}

export default Index