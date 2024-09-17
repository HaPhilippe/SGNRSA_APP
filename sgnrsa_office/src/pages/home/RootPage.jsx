import { Link, Outlet } from "react-router-dom";
import { Skeleton } from 'primereact/skeleton';
import DashboardSkeletons from "../../components/skeletons/DashboardSkeletons";
import HomeSkeletons from "../../components/skeletons/HomeSkeletons";
import AsideSkeletons from "../../components/skeletons/AsideSkeletons";



import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { CustomerService } from "./service/CustomerService";




import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from './service/ProductService';
import fetchApi from "../../helpers/fetchApi";





export default function RootPage() {

    const [products, setProducts] = useState(null);
    
    const [statuses] = useState(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']);

    useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const getSeverity = (value) => {
        switch (value) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = newData;

        setProducts(_products);
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };





    const [customers, setCustomers] = useState([]);

    console.log(customers, 'customers');

    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => setCustomers(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <img alt={rapport.SUJET} src={`https://primefaces.org/cdn/primereact/images/avatar/${rapport.RAPPORT}`} width="32" style={{ verticalAlign: 'middle' }} className="ml-2" />
                <span className="vertical-align-middle ml-2 font-bold line-height-3">{data.SUJET}</span>
            </React.Fragment>
        );
    };

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan={5}>
                    <div className="flex justify-content-end font-bold w-full">Total : {calculateCustomerTotal(rapport.total)}</div>
                </td>
            </React.Fragment>
        );
    };

    const countryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={rowData.country.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} /> */}
                <span>{rowData.RAPPORT}</span>
            </div>
        );
    };

    const etudiantBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                 <span>{rowData.etudiant.personne.NOM} </span>
                 <span> {rowData.etudiant.personne.PRENOM}</span>
            </div>
        );
    }

    // const statusBodyTemplate = (rowData) => {
    //     return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    // };

    const calculateCustomerTotal = (name) => {
        let total = 0;

        if (rapport) {
            for (let rappo of rapport) {
                if (rappo.RAPPORT === name) {
                    total++;
                }
            }
        }

        return total;
    };

    // const getSeverity = (status) => {
    //     switch (status) {
    //         case 'unqualified':
    //             return 'danger';

    //         case 'qualified':
    //             return 'success';

    //         case 'new':
    //             return 'info';

    //         case 'negotiation':
    //             return 'warning';

    //         case 'renewal':
    //             return null;
    //     }
    // };

    
    const [rapport,setRapport] = useState([]);

    console.log(rapport,'rapport');
    
    // useEffect(() => {
    //      async function name() {
    //            const res = await fetchApi(`/rh/stage/fetchstage?`);
    //            setRapport(res.result.data)
    //             console.log(rapport,'res');
    //     }
    //     name()
        
    // },[products])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetchApi(`/rh/stage/fetchstage?`);
    
            setRapport(response.result.data);
          } catch (error) {
            console.error('Erreur lors de la récupérations des données', error);
          }
        };
        fetchData();
      }, [])

    return (
        <>
            <div className="px-4 py-3 main_content">
                <h1 className="mb-3">Accueiel</h1>

                <div>
                    <h4>List prsonnalisée !</h4>
                </div>
                <div className="content">
                    {/* <div className="d-flex">
                                      <div className="div flex-fill">
                                                <DashboardSkeletons />
                                                <HomeSkeletons />
                                      </div>
                                      <AsideSkeletons />
                            </div> */}


                    {/* <div className="card p-fluid mb-4">
                        <DataTable value={products} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="code" header="Code" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: '20%' }}></Column>
                            <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '20%' }}></Column>
                            <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        </DataTable>
                    </div> */}








                    <div className="card">
                        <DataTable value={rapport} rowGroupMode="subheader" groupRowsBy="representative.SUJET"
                            sortMode="single" sortField="representative.SUJET" sortOrder={1}
                            expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                            rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="etudiant" header="Nom et Prenom" body={etudiantBodyTemplate} style={{ width: '20%' }}></Column>
                            <Column field="country" header="Faculte" body={countryBodyTemplate} style={{ width: '20%' }}></Column>
                            <Column field="company" header="Departement" style={{ width: '20%' }}></Column>
                            {/* <Column field="status" header="Status" body={statusBodyTemplate} style={{ width: '20%' }}></Column> */}
                            <Column field="date" header="Date de Depot" style={{ width: '20%' }}></Column>
                        </DataTable>
                    </div>




                </div>
            </div>
            <Outlet />
        </>


    )
}