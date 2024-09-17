
import { useEffect, useState } from "react";
import Logo from '../../../public/images/user.png'
import "../../styles/app/sidebar.css"
import { Link, useFetcher, useLocation, useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import removeUserDataAndCaches from "../../utils/removeUserDataAndCaches";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { setUserAction } from "../../store/actions/userActions";
import { Button } from "primereact/button";
import AppDateTime from "./AppDateTime";



export default function SideBar({ isMobile, setAsideVisible }) {
    const navigate = useNavigate()
    const dispacth = useDispatch()
    const user = useSelector(userSelector)
    const [commandes, setCommandes] = useState([])
    const [commandepfs, setCommandepfs] = useState([])
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

    const toggleSubMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.target.classList.toggle("collapse-show")
        if (isSidebarMinimized) {
            setIsSidebarMinimized(false)
        }
    };
    const location = useLocation();


    useEffect(() => {
        const main = document.querySelector(".main")
        if (isSidebarMinimized) {
            if (main) {
                main.classList.add("minimized")
            }
            const allShown = document.querySelectorAll(".collapse.show")
            if (allShown.length > 0) {
                allShown.forEach(element => {
                    element.classList.remove("show")
                })
            }
            const allCollapsed = document.querySelectorAll(`.nav-item a[aria-expanded="true"]`)
            if (allCollapsed.length > 0) {
                allCollapsed.forEach(element => {
                    element.classList.remove("collapsed")
                    element.setAttribute("aria-expanded", false);
                })
            }
        } else {
            if (main) {
                main.classList.remove("minimized")
            }
        }
    }, [isSidebarMinimized])


    //     const toggleSubMenu = (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         e.target.classList.toggle("collapse-show");
    //         if(isSidebarMinimized) {
    //                   setIsSidebarMinimized(false)
    //         }
    //    };





    useEffect(() => {
        const prevActive = document.querySelector("nav .nav-item.active");
        if (prevActive) {
            prevActive.classList.remove("active");
        }
        const url = location.pathname;
        const entrireUrl = location.pathname + location.search;
        const splits = url.split("/");
        var activeLink;
        const commonNavItem = document.querySelector(`nav a[href='/${splits[1]}']`);
        const exactNavitem = document.querySelector(`nav a[href='${entrireUrl}']`);
        if (exactNavitem) {
            activeLink = exactNavitem;
        } else {
            activeLink = commonNavItem;
        }

        if (activeLink) {
            const parent = activeLink.parentElement;
            parent.classList.add("active");
            const navLinkParent = parent.parentElement;
            if (navLinkParent.classList.contains("collapse")) {
                navLinkParent.classList.add("show");
                const navLinkParentId = navLinkParent.getAttribute("id");
                const toCollapsedElement = document.querySelector(
                    `[aria-controls='${navLinkParentId}']`
                );
                if (toCollapsedElement) {
                    toCollapsedElement.classList.add("collapsed");
                    toCollapsedElement.setAttribute("aria-expanded", true);
                }
            }
        }
    }, [location, commandes, commandepfs]);



    const handleAccept = async () => {
        removeUserDataAndCaches(user.ID_UTILISATEUR, user.REFRESH_TOKEN)
        dispacth(setUserAction(null))
        localStorage.setItem('user', null)
        navigate("/login")

    }



    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmDialog({
            headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
            headerClassName: "text-black",
            header: "Déconnexion",
            message: (
                <div className="d-flex flex-column align-items-center">
                    <>
                        <div className="font-bold text-center my-2">
                        </div>
                        <div className="text-center">
                            Voulez-vous vraiment se déconnecter?
                        </div>
                    </>
                </div>
            ),
            acceptClassName: "p-button-danger",
            acceptLabel: "Oui",
            rejectLabel: "Non",
            accept: handleAccept,
        });
    };

    const showSidebar = () => {
        const Dsidebar = document.querySelector('.d-sidebar');
        const sidebar = document.querySelector('.sidebar');
        // sidebar.style.display = "block";
        // sidebar.style.marginRight='100%';
        // Dsidebar.addEventListener('click', () => {
        // console.log("show");
        // });

    }


    const [nodes, setNodes] = useState([]);




    return (
        <>
            <aside className={`sidebar  flex-column justify-content-between shadow z-1 ${isSidebarMinimized ? "minimized" : ""}`} >

                {/* <Link
                to={"/"}
                className="d-flex align-items-center px-3 py-2 text-decoration-none link-dark"
            >
                <div className="logo-container">
                    <img src={Logo} alt="" className="logo" />
                </div>
                <div className="mx-3">
                    <h4 className='mx-2 mb-0 text-success'>AFPM</h4>
                </div>
            </Link> */}

                <div className="d-flex justify-content-between align-items-center">
                    <Link
                        // to={user.ID_PROFIL !== PROFILS.CORPORATE ? "/" : null}
                        className="d-flex align-items-center px-3 py-2 text-decoration-none link-dark"
                    >
                        {isMobile ? null : <Button size="small" severity="secondary" outlined style={{ color: "black", width: 40, height: 40, border: "none" }} rounded className="p-2 mr-2" onClick={e => {
                            e.preventDefault()
                            setIsSidebarMinimized(b => !b)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" className="bi bi-list" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </Button>}
                        <div className="logo-container">
                            <img src={Logo} alt="" className="logo" />
                        </div>
                        <div className="ml-2">
                            <div className="d-flex align-items-center">
                                {/* <h5 className="mb-0 app-brandName">Wasili</h5> */}
                                <h5 className="mb-0 brandSubName ml-2">SGNRSA</h5>
                            </div>
                            <AppDateTime />
                        </div>
                    </Link>
                    {isMobile ? <Button size="small" severity="secondary" outlined style={{ color: "black", width: 40, height: 40, border: "none" }} rounded className="p-2 mr-2" onClick={e => {
                        e.preventDefault()
                        setAsideVisible(false)
                    }} icon="pi pi-times" /> : null}
                </div>

                <hr className="mx-3 my-2" style={{ borderTopColor: 'black' }} />

                <nav className={`px-2 flex-fill`}>
                    <div className='nav-item'>
                        <a onClick={toggleSubMenu} className="text-decoration-none rounded d-block" data-bs-toggle="collapse" href="#administration" role="button" aria-expanded="false" aria-controls="administration">
                            <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ fontWeight: "bold" }} width="20" height="20" fill="currentColor" className="bi bi-database" viewBox="0 0 16 16">
                                            <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z" />
                                        </svg>
                                    </div>
                                    <span className='menu-title' style={{ fontWeight: "bold" }}>Administration</span>
                                </div>
                                <div className="down_caret">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="sub-menus collapse" id="administration">
                        <div className='nav-item'>
                            <Link to={"utilisateurs"} className="text-decoration-none rounded d-block" href="/utilisateurs">
                                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className="menu-icon">
                                        </div>
                                        <span className='menu-title'>Utilisateurs</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='nav-item'>
                            <Link to={"profil"} className="text-decoration-none rounded d-block" href="/profil" role="button" aria-expanded="false" aria-controls="administration">
                                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className="menu-icon">
                                        </div>
                                        <span className='menu-title'>Profiles</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className='nav-item'>
                            <Link to={"Sessionutilisateurs"} className="text-decoration-none rounded d-block" href="/Sessionutilisateurs">
                                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className="menu-icon">
                                        </div>
                                        <span className='menu-title'>Sessions des utilisateurs</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Ressources humaines */}

                    <div className='nav-item'>
                        <a className="text-decoration-none rounded d-block" data-bs-toggle="collapse" href="#rh" id="rh" role="button" aria-expanded="false" aria-controls="collapseExample">
                            <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div className="menu-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid" viewBox="0 0 16 16">
                                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                        </svg>
                                    </div>
                                    <span className='menu-title' style={{ fontWeight: "bold" }}>Gestion des rapports</span>
                                </div>
                                <div className="down_caret">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg> 
                                </div>
                            </div>
                        </a>
                    </div>
                   
                    <div className="sub-menus collapse" id="rh">
                        <div className='nav-item'>

                            <div className='nav-item'>

                                <Link to={"personne"} className="text-decoration-none rounded d-block" href="/">
                                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className="menu-icon">
                                            </div>
                                            <span className='menu-title'>Personne</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
            
                    <div className="sub-menus collapse" id="rh">
                        <div className='nav-item'>

                            <div className='nav-item'>

                                <Link to={"departement"} className="text-decoration-none rounded d-block" href="/">
                                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className="menu-icon">
                                            </div>
                                            <span className='menu-title'>Departement</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="aside-footer px-2 py-3">
                    <hr />


                    <div className="nav-item">
                        <a
                            className="text-decoration-none rounded d-block "
                            href="#logout"
                            onClick={handleLogout}
                        >
                            <div className="d-flex align-items-center justify-content-between py-2 px-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="menu-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-box-arrow-left"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="menu-title">Déconnexion</span>
                                </div>
                            </div>
                        </a>
                    </div>



                </div>
            </aside>
            <div >

                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" onClick={showSidebar} fill="black" className="bi bi-justify mx-3 mt-2 d-sidebar" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                </svg>

            </div>
        </>

    )
}