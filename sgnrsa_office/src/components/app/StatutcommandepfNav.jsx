
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "primereact/badge";
// import useQuery from "../../hooks/useQuery";
import useQuery from "../../hooks/useQuery"
import fetchApi from "../../helpers/fetchApi";

export default function StatutcommandepfNav({commande}) {
    const [countCourse, setCountCourse] = useState([])
    const query = useQuery()
    const location = useLocation()
    useEffect(() => {
        (async () => {
            try {
                const res = await fetchApi(`/administration/stockpf/countstatut/${commande.St_CommandeID}`)
                const toDisplay = res.result.stutcommdes
                setCountCourse(toDisplay)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [query,location])

    return (
        <div className='nav-item'>
            <Link to={`/commandepf?statutpf=${commande.St_CommandeID}`} className="text-decoration-none rounded d-block text-black">
                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className="menu-icon">
                        </div>
                        <span className='menu-title'>{commande.Description}</span>
                    </div>
                    {countCourse > 0 ? <Badge value={countCourse} className='rounded-5' severity="danger"></Badge> : null}
                </div>
            </Link>
        </div>
    )
}