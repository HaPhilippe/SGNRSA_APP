
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './App.css'

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import { AutoComplete } from "primereact/autocomplete";
import SideBar from './components/app/SideBar';
import './styles/app/style.css';
// import "../public/assets/css/main.css"
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'primeicons/primeicons.css';
import Header from './components/app/Header';
import RoutesProvider from './routes/RoutesProvider';
import "/node_modules/primeflex/primeflex.css"
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { toastSelector } from './store/selectors/appSelectors';
import { setToastAction } from './store/actions/appActions';
import { userSelector } from './store/selectors/userSelector';
import WelcomeRoutesProvider from './routes/WelcomeRoutesProvider';
import { setUserAction } from './store/actions/userActions';
import Loading from './components/app/Loading';
// import NewRequerantPage from './pages/requerants/NewRequerantPage';
// import IDS_PROFIL from './constants/IDS_PROFIL';
// import RequerantRoutesProvider from './routes/RequerantRoutesProvider';


// import WebHeader from './components/website/WebHeader';

// import WebHeaderRequerant from './components/website/WebHeaderRequerant';

function App() {
          const toast = useRef(null);
          const appToast = useSelector(toastSelector)
          const dispatch = useDispatch()
          const user = useSelector(userSelector)
          const [loading, setLoading] = useState(true)

          useLayoutEffect(() => {
                    try {
                              dispatch(setUserAction(JSON.parse(localStorage.getItem('user'))))
                              setLoading(false)
                    } catch (error) {
                              console.log(error)
                    }
          }, [])
          useEffect(() => {
                    if(appToast && toast.current) {
                              toast.current.show(appToast);
                    }
          }, [appToast, toast.current])
          if(loading) {
                    return <Loading />
          }
          if(!user) {
                    return (
                              <>
                              <Toast ref={toast} position='top-right' onHide={() => {
                                        dispatch(setToastAction(null))
                              }} />
                              {/* <WebHeader /> */}
                              <WelcomeRoutesProvider />
                              </>
                    )
          }
        //   if(user.ID_PROFIL == IDS_PROFIL.REQUERANT) {
        //             return (
        //                 <>
        //                       <WebHeaderRequerant/>
        //                       <RequerantRoutesProvider />
        //                 </>
        //             )
        //   }
          return (
                    // <div className="d-flex body__wrapper">
                    //           <SideBar />
                    //           <Toast ref={toast} position='top-center' onHide={() => {
                    //                     dispatch(setToastAction(null))
                    //           }} />
                    //           <div className="main w-100" style={{ maxWidth: "calc(100% - 300px)"}}>
                    //                     <Header />
                    //                     <RoutesProvider />
                    //           </div>
                    // </div>

                    <>
                    <Toast ref={toast} position='top-center' onHide={() => {
                        dispatch(setToastAction(null))
                    }} />
                  <div className="d-flex w-100">
                    <div id="desktop-sidebar" style={{ zIndex: 2 }}>
                      <SideBar />
                    </div>
                      <div className="main flex-1" /**style={{ maxWidth: "calc(100% - 70px)" }}**/>
                          <Header />
                          <RoutesProvider />
                      </div>
                  </div>
                  </>
          )
}

export default App


















