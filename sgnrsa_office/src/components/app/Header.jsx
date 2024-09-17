import "../../styles/app1/header.css"
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import moment from 'moment'
import Image from '../../../public/images/AFPM.jpg'
import { Badge } from 'primereact/badge';
import BreadCrumb from "./BreadCrumb";
import { useRef, useState, useEffect } from "react";
import { SlideMenu } from 'primereact/slidemenu';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { setUserAction } from "../../store/actions/userActions";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import AppSideBar from "./SideBar";
import { Sidebar } from "primereact/sidebar";
import removeUserDataAndCaches from "../../utils/removeUserDataAndCaches";
moment.updateLocale('fr', {
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Séptembre', 'Octoble', 'Novembre', 'Décembre']
})


const AppDateTime = () => {
    const [time, setTime] = useState(Date.now());
    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    return (
      <div className="text-light date-time">
        {moment(time).format("dddd DD MMM YYYY HH:mm:ss")}
      </div>
    )
  }

export default function Header() {
    const menu = useRef(null);
    const user = useSelector(userSelector)
    const dispacth = useDispatch()
    const navigate = useNavigate()
    const [asideVisible, setAsideVisible] = useState(false);

    const handleAccept = async () => {
        removeUserDataAndCaches(user.ID_UTILISATEUR, user.REFRESH_TOKEN)
        dispacth(setUserAction(null))
        localStorage.setItem('user', null)
        navigate('/login')
    }
    const handleLogout = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmDialog({
            //   headerStyle: { backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' },
            headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
            headerClassName: "text-black",
            header: "Deconnexion",
            style: { width: '30vw' },
            message: (
                <div className="d-flex flex-column align-items-center">
                    <>
                        <div className="font-bold text-center my-2">
                        </div>
                        <div className="text-center">
                            Voulez -vous vraiment se deconnecter?
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
    const items = [
        {
            template: () => {
                return (
                    <>
                        <div className="d-flex align-items-center w-100 px-2">
                            <div className="avatar">
                                <img src={user.IMAGE || Image} alt="" className="" />
                            </div>
                            <div className="usernames ml-2">
                                <div className="font-bold white-space-nowrap">{user.NOM} {user.PRENOM}</div>
                                <div className="texte-muted text-sm white-space-nowrap">{user.EMAIL}</div>
                            </div>
                        </div>
                        <hr className="mb-0 mt-2" />
                    </>
                )
            }
        },
        // {
        //     template: (deleteItem, options) => {
        //         return (
        //             <Link to={`/messages`} className="p-menuitem-link">
        //                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text mt-1" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
        //                     <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
        //                     <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
        //                 </svg>
        //                 <span className="p-menuitem-text">Messages</span>
        //             </Link>
        //         )
        //     }
        // },
        // {
        //     template: (deleteItem, options) => {
        //         return (
        //             <>
        //                 <Link to={`/notifications`} className="p-menuitem-link">
        //                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
        //                         <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
        //                     </svg>
        //                     <span className="p-menuitem-text">Notifications</span>
        //                 </Link>
        //                 <hr className="mb-0 mt-2" />
        //             </>
        //         )
        //     }
        // },
        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`/user/profile`} className="p-menuitem-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                        </svg>
                        <span className="p-menuitem-text">Modifier le profil</span>
                    </Link>
                )
            }
        },
        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`/auth/password`} className="p-menuitem-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                        </svg>
                        <span className="p-menuitem-text">Changer le mot de passe</span>
                    </Link>
                )
            }
        },
        // {
        //     template: (deleteItem, options) => {
        //         return (
        //             <>
        //                 <Link to={`/user/settings`} className="p-menuitem-link">
        //                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
        //                         <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
        //                         <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        //                     </svg>
        //                     <span className="p-menuitem-text">Paramètres</span>
        //                 </Link>
        //                 <hr className="my-0" />
        //             </>
        //         )
        //     }
        // },
        {
            template: (deleteItem, options) => {
                return (
                    <Link to={`#`} className="p-menuitem-link" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg>
                        <span className="p-menuitem-text">Se déconnecter</span>
                    </Link>
                )
            }
        },
    ];

    return (
        <>
            <Sidebar visible={asideVisible} onHide={() => setAsideVisible(false)} header={null} showCloseIcon={false} className="appMobileAside">
                <AppSideBar isMobile={true} setAsideVisible={setAsideVisible} />
            </Sidebar>

            {/* <header className="d-flex align-items-center justify-content-between px-4"> */}

            <header className="align-items-center justify-content-between px-4 header" style={{ backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' }}>
                {/* <div className="d-flex align-items-center">
                <AppDateTime />
                <BreadCrumb />
            </div> */}


                <div className="d-flex align-items-center flex-1">
                    <Button size="small" severity="secondary" outlined style={{ color: "black", width: 40, height: 40, border: "none" }} rounded className="p-2 mr-2" id="mobileSidebarOpener" onClick={e => {
                        e.preventDefault()
                        setAsideVisible(true)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </Button>
                    {/* <SearchBar /> */}
                    {/* <AppDateTime /> */}
                    {/* {
            user.ID_PROFIL !== PROFILS.CORPORATE ? <SearchBar /> : <AppDateTime />
          } */}
                    <BreadCrumb />
                </div>

                <div className="flex align-items-center py-2">
                    {/* <Button rounded text aria-label="Messages" size="small" className="mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                    </svg>
                </Button> */}
                    <Button rounded text aria-label="Notifications" size="small" className="mx-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                        </svg>
                        <Badge size={'normal'} value="8" severity="danger" style={{
                            position: 'absolute',
                            top: 0,
                        }}></Badge>
                    </Button>
                    <SlideMenu ref={menu} model={items} popup viewportHeight={200} menuWidth={300} style={{ width: 300 }} className="mt-2" onHide={() => {
                    }} />
                    <Button text className="p-0 avatar mx-2" onClick={e => {
                        menu.current.toggle(e)
                    }}>
                        <img src={user?.IMAGE || Image} alt="" className="" />
                    </Button>
                </div>
            </header>
        </>

    )
}