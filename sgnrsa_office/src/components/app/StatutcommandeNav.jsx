
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "primereact/badge";
// import useQuery from "../../hooks/useQuery";
import useQuery from "../../hooks/useQuery"
import fetchApi from "../../helpers/fetchApi";

export default function StatutcommandeNav({commande}) {
    const [countCourse, setCountCourse] = useState([])
    const query = useQuery()
    const location = useLocation()
    useEffect(() => {
        (async () => {
            try {
                const res = await fetchApi(`/administration/stockmp/countcmdes_statuts/${commande.ID_STATUT_COMM}`)
                const toDisplay = res.result
                setCountCourse(toDisplay)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [query,location])

    return (
        <div className='nav-item'>
            <Link to={`/commande?statut=${commande.ID_STATUT_COMM}`} className="text-decoration-none rounded d-block text-black">
                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className="menu-icon">
                        </div>
                        <span className='menu-title'>{commande.DESCRIPTION}</span>
                    </div>
                    {countCourse > 0 ? <Badge value={countCourse} className='rounded-5' severity="danger"></Badge> : null}
                </div>
            </Link>
        </div>
    )
}