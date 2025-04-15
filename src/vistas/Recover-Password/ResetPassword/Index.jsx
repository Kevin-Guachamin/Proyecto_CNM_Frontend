import React from 'react'
import Header from '../../../components/Header';
import ResetPassword from './ResetPassword';

function Index() {




    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                <Header />
            </div>

            <ResetPassword />


        </div>
    )
}

export default Index