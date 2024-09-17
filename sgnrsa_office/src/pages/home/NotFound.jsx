import { useEffect } from 'react'
import '../../styles/app/notFound.scss'
import { useSelector } from 'react-redux'
import { userSelector } from '../../store/selectors/userSelector'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export default function NotFound() {
    useEffect(() => {
        document.title = "AFPM | page non trouvé"
    }, [])
    const user = useSelector(userSelector)
    const navigate = useNavigate()
    return (
        <div className={`notfound-content d-flex flex-column align-items-center justify-content-center w-100 h-100 ${!user ? 'absolute' : ''}`}>
            <div className="notfound-icon">
                <div className="notfound-icon-content">
                    <div className="eyes">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <div className="mouth"></div>
                </div>
            </div>
            <div className="notfound-detail text-center">
                <h5>Hmm! <br /> Page non trouvée</h5>
            </div>
            {!user ? <div className="quick-links mt-2">
                <Link to={"/"} aria-label="Page d'acceuil" className="p-button p-component mr-2 p-button-sm p-button-info text-decoration-none">
                    <span className="p-button-label p-c">Page d'acceuil</span>
                </Link>
                <Link to={"/login"} aria-label="Page d'acceuil" className="p-button p-component p-button-sm p-button-info text-decoration-none">
                    <span className="p-button-label p-c">Se connecter</span>
                </Link>
            </div> : null}
        </div>
    )
}

{/* <div className="container">

<Card className="col-md-3 col-lg-3 col-xs-12 col-sm-12 item-folio">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio nihil vel error, voluptatibus excepturi atque modi assumenda corporis dicta dolorum perferendis ipsam asperiores aliquid ratione temporibus harum. Quasi, enim aliquam!
</Card>
<Card className="col-md-3 col-lg-3 col-xs-12 col-sm-12 item-folio">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio nihil vel error, voluptatibus excepturi atque modi assumenda corporis dicta dolorum perferendis ipsam asperiores aliquid ratione temporibus harum. Quasi, enim aliquam!
</Card>
 <Card className="col-md-3 col-lg-3 col-xs-12 col-sm-12 item-folio">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio nihil vel error, voluptatibus excepturi atque modi assumenda corporis dicta dolorum perferendis ipsam asperiores aliquid ratione temporibus harum. Quasi, enim aliquam!
</Card>

</div> */}