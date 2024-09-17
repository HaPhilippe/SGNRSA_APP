import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { breadCrumbItemsSelector } from "../../store/selectors/appSelectors"

export default function BreadCrumb() {
          const breadCrumbItems = useSelector(breadCrumbItemsSelector)
          return (
                    <div className="d-flex align-items-center text-muted mx-4" id="breadcrumb">
                              {breadCrumbItems.length > 0 ?
                              <>
                              <Link to={"/"} className="text-decoration-none text-muted px-2 breadCrumbItem rounded py-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house mb-1" viewBox="0 0 16 16">
                                                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                                        </svg>
                              </Link>
                               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-chevron-right " viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                              </svg>
                              </> : null}
                              {breadCrumbItems.map((item, index) => {
                                        return (
                                                  <div className="d-flex align-items-center mx-1" key={index}>
                                                            <Link to={item.path} className={`text-decoration-none text-muted px-2 breadCrumbItem rounded py-1 ${index == breadCrumbItems.length - 1 ? 'active pointer-events-none' : ""}`} >
                                                                      {item.name}
                                                            </Link>
                                                            {index < breadCrumbItems.length-1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right mt-1" viewBox="0 0 16 16">
                                                                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                            </svg> : null}
                                                  </div>
                                        )
                              })}
                    </div>
          )
}






// import { useSelector } from "react-redux"
// import { Link } from "react-router-dom"
// import { breadCrumbItemsSelector } from "../../store/selectors/appSelectors"

// export default function BreadCrumb() {
//           const breadCrumbItems = useSelector(breadCrumbItemsSelector)
//           return (
//                     <div className="d-flex align-items-center text-muted ml-2" id="breadcrumb">
//                               {breadCrumbItems.length > 0 ?
//                               <>
//                               <Link to={"/"} className="text-decoration-none px-2 breadCrumbItem rounded py-1 link-light">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house mb-1" viewBox="0 0 16 16">
//                                                   <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
//                                         </svg>
//                               </Link>
//                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="black" className="bi bi-chevron-right " viewBox="0 0 16 16">
//                                         <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
//                               </svg>
//                               </> : null}
//                               {breadCrumbItems.map((item, index) => {
//                                         return (
//                                                   <div className="d-flex align-items-center mx-1" key={index}>
//                                                             <Link to={item.path} className={`text-decoration-none link-light px-2 breadCrumbItem rounded py-1 ${index == breadCrumbItems.length - 1 ? 'active pointer-events-none' : ""}`} >
//                                                                       {item.name}
//                                                             </Link>
//                                                             {index < breadCrumbItems.length-1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-chevron-right mt-1" viewBox="0 0 16 16">
//                                                                       <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
//                                                             </svg> : null}
//                                                   </div>
//                                         )
//                               })}
//                     </div>
//           )
// }