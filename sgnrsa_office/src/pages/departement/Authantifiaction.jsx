import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
// import { Grid } from 'primereact/grid';
import 'primereact/resources/themes/saga-blue/theme.css'; // Thème
import 'primereact/resources/primereact.css'; // CSS de PrimeReact
import 'primeicons/primeicons.css'; // Icônes

export default function Authantifiaction() {
    return (
        <div className="p-grid p-align-center p-justify-center" style={{ minHeight: '100vh' }}>
            <div className="p-col-12 p-md-6">
                <Card title="Formulaire de contact" className="p-shadow-2">
                    <div className="p-field">
                        <label htmlFor="name">Nom</label>
                        <InputText id="name" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="email" />
                    </div>
                    <Button label="Soumettre" icon="pi pi-check" />
                </Card>
            </div>
        </div>
    );
};

