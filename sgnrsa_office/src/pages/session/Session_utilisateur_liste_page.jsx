import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SlideMenu } from "primereact/slidemenu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Loading from "../../components/app/Loading";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { InputSwitch } from 'primereact/inputswitch';
// import Detailutilisateur from "../../components/notification/Detailutilisateur";
// import { useIntl } from "react-intl";
import { userSelector } from "../../store/selectors/userSelector";
// import IDS_ROLES from "../../constants/IDS_ROLES";
import NotFound from "../home/NotFound";
import { administration_routes_items } from "../../routes/admin/administration_routes";
import Detailutilisateur from "./Detailutilisateur";

const UtilisateurSwitch = ({ sessionutilisateur, change_status }) => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    if (sessionutilisateur?.IS_ACTIVE) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [sessionutilisateur])
  return (
    <InputSwitch checked={checked} onChange={(e) => {
      e.preventDefault()
      e.stopPropagation()
      setChecked(e.value)
      change_status(null, sessionutilisateur?.ID_UTILISATEUR_TOKEN)
    }} />
  )
}

const UtilisateurSwitchNotRwite = ({ sessionutilisateur }) => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    if (sessionutilisateur?.IS_ACTIVE) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [sessionutilisateur])
  return (
    <InputSwitch checked={checked} />
  )
}


/**
 * fonction pour lister les sessions des utilisateurs
 * @author leonard <leonard@mdiabox.bi>
 * @date 24/02/2024
 */

export default function Session_utilisateur_liste_page() {
  
  const [selectedCity, setSelectedCity] = useState(null);
  const [date, setDate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [sessionutilisateur, setSessionutilisateur] = useState([]);
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const [selectedItems, setSelectedItems] = useState(null);
  const menu = useRef(null);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);
  const [globalLoading, setGloabalLoading] = useState(false);
  const [sessionutilisateurstatut, setUtilisateurstatut] = useState(null);
  const [utilisateurselect, setUtilisateurselect] = useState(null);
  const [utilisateurdata, setUtilisateurdata] = useState([]);
  const [detail, setDetail] = useState(false);
  const [displayNotificationBasic, setDisplaynotificationBasic] = useState(false);
  const [onenotification, setOnenotification] = useState(null);
  const navigate = useNavigate();
  const [userSearch, setUserSearch] = useState("")
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const user = useSelector(userSelector)


  //etat pour les filtres les sessions des utilisateur activee /desactivee
  const [statut_data, setStatut] = useState([{
    code: 2,
    name: "Tous"
  }, {
    code: 1,
    name: "Active"
  }, {
    code: 0,
    name: "Desactive"
  }]);



  const statutSelected = async (statut) => {
    setUtilisateurstatut(statut);
  };

  const utilisateurSelected = async (utilisateur) => {
    setUtilisateurselect(utilisateur);
  };

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    search: "",
    filters: {
      name: { value: "", matchMode: "contains" },
      "country.name": { value: "", matchMode: "contains" },
      company: { value: "", matchMode: "contains" },
      "representative.name": { value: "", matchMode: "contains" },
    },
  });

  const dispacth = useDispatch();
  const handleVisibility = (e) => {
    setIsVisible(!isVisible);
  };
  const onPage = (event) => {
    setlazyState(event);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onFilter = (event) => {
    event["first"] = 0;
    setlazyState(event);
  };

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelectedItems(value);
    setSelectAll(value.length === totalRecords);
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      setSelectAll(true);
      setSelectedItems(sessionutilisateur);
    } else {
      setSelectAll(false);
      setSelectedItems([]);
    }
  };


  //fonction pour lister les utilisateurs dans un dropdown la filtre d'un session

  const fetchallutilisateur = useCallback(async () => {
    try {
      setIsLoadingUsers(true)
      var url = `/administration/sessionsusers/fetchallusers?`
      if (userSearch.trim() != "") {
        url += `search=${userSearch}`
      }
      const res = await fetchApi(url);
      setUtilisateurdata(
        res.result.data.map((util) => {
          return {
            name: [util.NOM + ' ' + util.PRENOM],
            code: util.ID_UTILISATEUR,
          };
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingUsers(false)
    }
  }, [userSearch]);
  useEffect(() => {
    fetchallutilisateur();
  }, [userSearch]);

  //fonction pour faire une suppression d'une session d'un utilisateur

  const deleteItems = async (ID_UTILISATEUR_TOKEN) => {
    try {
      setGloabalLoading(true);
      const form = new FormData();
      form.append("ids", JSON.stringify(ID_UTILISATEUR_TOKEN));
      const res = await fetchApi("/administration/sessionsusers/deleteusers", {
        method: "POST",
        body: form,
      });
      navigate("/utilisateursession");
      dispacth(
        setToastAction({
          severity: "success",
          summary: "Session d'un utilisateur supprimée",
          detail: "La session d'un utilisateur a été supprimée avec succès",
          life: 3000,
        })
      );
      fetchsessionutilisateur();
      setSelectAll(false);
      setSelectedItems(null);
    } catch (error) {
      console.log(error);
      dispacth(
        setToastAction({
          severity: "error",
          summary: "Erreur du système",
          detail: "Erreur du système, réessayez plus tard",
          life: 3000,
        })
      );
    } finally {
      setGloabalLoading(false);
    }
  };

  //evenement pour la suppression d'une session d'un utilisateur
  const handleDeletePress = (e, ID_UTILISATEUR_TOKEN) => {
    e.preventDefault();
    e.stopPropagation();
    confirmDialog({
      // headerStyle: { backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' },
      // headerClassName: "text-white",
      headerStyle: { backgroundColor: '#ecc5c5', backgroundSize: 'cover' },
      headerClassName: "text-black",
      header: "Supprimer",
      message: (
        <div className="d-flex flex-column align-items-center">
          {inViewMenuItem ? (
            <>
              <div className="font-bold text-center my-2">
                {inViewMenuItem?.NOM}
              </div>
              <div className="text-center">
                Voulez-vous vraiment supprimer ?
              </div>
            </>
          ) : (
            <>
              <div className="text-muted">
                {selectedItems ? selectedItems.length : "0"} selectionné
                {selectedItems?.length > 1 && "s"}
              </div>
              <div className="text-center">
                Voulez-vous vraiment supprimer les éléments selectionnés ?
              </div>
            </>
          )}
        </div>
      ),
      acceptClassName: "p-button-danger",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        deleteItems(ID_UTILISATEUR_TOKEN);
      },
    });
  };


  //fonction pour la desactivation et l'activation d'un statut d'une session du chauffeur

  const change_status = async (e, ID_UTILISATEUR_TOKEN) => {
    try {
      setGloabalLoading(true);
      await fetchApi(
        `/administration/sessionsusers/change_statuts/${ID_UTILISATEUR_TOKEN}`,
        {
          method: "PUT",
        }
      );
      fetchsessionutilisateur();
    } catch (error) {
      console.log(error);
    } finally {
      setGloabalLoading(false);
      menu.current.hide(e);
    }
  };

  //fonction pour lister les session d'un utilisateur
  const fetchsessionutilisateur = useCallback(async () => {
    try {
      setLoading(true);
      const baseurl = `/administration/sessionsusers/fetchallsession?`;
      var url = baseurl;
      for (let key in lazyState) {
        const value = lazyState[key];
        if (value) {
          if (typeof value == "object") {
            url += `${key}=${JSON.stringify(value)}&`;
          } else {
            url += `${key}=${value}&`;
          }
        }
      }
      if (sessionutilisateurstatut) {
        url += `Utilisateurstatut=${sessionutilisateurstatut.code}&`;
      }

      if (utilisateurselect) {
        url += `utilisateur=${utilisateurselect.code}&`;
      }

      const res = await fetchApi(url);
      setSessionutilisateur(res.result.data);
      setTotalRecords(res.result.totalRecords);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [lazyState, sessionutilisateurstatut, utilisateurselect]);


  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([administration_routes_items.Sessionutilisateurs]));
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);


  useEffect(() => {
    document.title = "Sessions des utilisateurs",
      fetchsessionutilisateur();
  }, [lazyState, sessionutilisateurstatut, utilisateurselect]);

  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />
      {globalLoading && <Loading />}
      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Sessions des utilisateurs</h1>
        </div>

        <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
          <div className="d-flex  align-items-center">
            <div className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="Rechercher"
                className="p-inputtext-sm"
                style={{ minWidth: 170 }}
                onInput={(e) =>
                  setlazyState((s) => ({ ...s, search: e.target.value }))
                }
              />
            </div>
            <div className="p-input-icon-left ml-3">

              <Dropdown
                value={utilisateurselect}
                onChange={(e) => utilisateurSelected(e.value)}
                options={utilisateurdata}
                filter
                filterBy="name"
                optionLabel="name"
                placeholder="Utilisateurs"
                className="w-full md:w-14rem mx-2 no-p"
                showClear
                onFilter={e => {
                  setUserSearch(e.originalEvent.target.value)
                }}
                filterIcon={isLoadingUsers ? "pi pi-spin pi-spinner" : undefined}
              />

            </div>
            <div className="p-input-icon-left ml-1">
              <Dropdown
                value={sessionutilisateurstatut}
                onChange={(e) => statutSelected(e.value)}
                options={statut_data}
                filter
                filterBy="name"
                optionLabel="name"
                placeholder="Statut"
                className="w-full md:w-10rem mx-3 no-p"
                showClear
              />
            </div>

          </div>

          <div className="selection-actions d-flex align-items-center">
            <div className="text-muted mx-3">
              {selectedItems ? selectedItems.length : "0"} selectionné
              {selectedItems?.length > 1 && "s"}
            </div>
            <a
              href="#"
              className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length == 0) &&
                "opacity-50 pointer-events-none"
                }`}
              style={{}}
              onClick={(e) =>
                handleDeletePress(
                  e,
                  selectedItems.map((item) => item.ID_UTILISATEUR_TOKEN)
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                style={{ marginRight: "0.3rem" }}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span className="p-menuitem-text">Supprimer</span>
            </a>
          </div>


        </div>


        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={sessionutilisateur}
              tableStyle={{ minWidth: "50rem", fontSize: 14 }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun utilisateurs trouvé"
              first={lazyState.first}
              rows={lazyState.rows}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              onFilter={onFilter}
              filters={lazyState.filters}
              loading={loading}
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              selectAll={selectAll}
              onSelectAllChange={onSelectAllChange}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
            // size="normal"
            >
              <Column
                selectionMode="multiple"
                frozen
                headerStyle={{ width: "3rem" }}
              />

              <Column
                field="IMAGE"
                header="Utilisateurs"
                frozen
                sortable
                body={(item) => {
                  const css = `
                            .round-indicator .p-image-preview-indicator {
                            border-radius: 50%
                            }`;
                  return (
                    <>
                      <div className="d-flex round-indicator">
                        <Image
                          src={item.utilisateur.IMAGE}
                          alt="Image"
                          className="rounded-5"
                          imageClassName="rounded-5 object-fit-cover"
                          imageStyle={{ width: "50px", height: "50px" }}
                          style={{ width: "50px", height: "50px" }}
                          preview
                        />
                        <div className="ml-2">
                          <div className="font-bold">
                            {item.utilisateur.NOM} {item.utilisateur.PRENOM}
                          </div>
                          <div className="text-muted">{item.utilisateur.TELEPHONE}</div>
                        </div>
                      </div>
                      <style>{css}</style>
                    </>
                  );
                }}
              />

              <Column
                field="mobile"
                header="Mobile"
                sortable
                body={(item) => {
                  return <span>{item.mobile ? item.mobile : "-"}</span>;
                }}
              />

              <Column
                field="osName"
                header="Systeme d'exploitation"
                sortable
                body={(item) => {
                  return <span>{item.osName ? item.osName : "-"}</span>;
                }}
              />
              <Column
                field="osVersion"
                header="osVersion"
                sortable
                body={(item) => {
                  return <>{item ? <span>{item.osVersion ? item.osVersion : '-'}</span> : "-"}</>
                }}
              />
              <Column
                field="browserName"
                header="Navigateur"
                sortable
                body={(item) => {
                  return <span>{item.browserName ? item.browserName : '-'}</span>;
                }}
              />
              <Column
                field="IS_ACTIVE"
                header="Statut"
                frozen
                sortable
                body={(item) => {
                  return (

                    <>
                      <UtilisateurSwitch sessionutilisateur={item} change_status={change_status} />
                    </>
                  );
                }}
              />

              <Column
                field="DATE_INSERTION"
                header="Date"
                sortable
                body={(item) => {
                  return moment(item.DATE_INSERTION).format("DD/MM/YYYY HH:ss");
                }}
              />
                <Column
                  field=""
                  header=""
                  alignFrozen="right"
                  frozen
                  body={(item) => {
                    const items = [

                      {
                        template: (deleteItem, options) => {


                          return (
                            <Link
                              to={`#`}
                              className="p-menuitem-link"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                // setOnenotification(item);
                                setDetail(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-list"
                                viewBox="0 0 16 16"
                                style={{ marginRight: "0.5rem" }}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                                />
                              </svg>
                              <span className="p-menuitem-text">Plus de detail</span>
                            </Link>
                          );
                        },
                      },

                      {
                        template: (deleteItem, options) => {
                          return (
                            <a
                              href="#"
                              className="p-menuitem-link text-danger"
                              onClick={(e) =>
                                handleDeletePress(e, [
                                  inViewMenuItem.ID_UTILISATEUR_TOKEN,
                                ])
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                                style={{ marginRight: "0.5rem" }}
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                              </svg>
                              <span className="p-menuitem-text text-danger">
                                Supprimer
                              </span>
                            </a>
                          );
                        },
                      },
                      {
                        template: (deleteItem, options) => {
                          return inViewMenuItem?.IS_ACTIVE ? (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                change_status(e, inViewMenuItem?.ID_UTILISATEUR_TOKEN);
                              }}
                              className="p-menuitem-link"
                            >
                              <span className="p-menuitem-text ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16"
                                  style={{ marginRight: "0.5rem", transform: "scale(1.3)" }}>
                                  <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z" />
                                </svg>
                                Desactive
                              </span>
                            </a>
                          ) : (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                change_status(e, inViewMenuItem?.ID_UTILISATEUR_TOKEN);
                              }}
                              className="p-menuitem-link"
                            >
                              <span className="p-menuitem-text ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16" style={{ marginRight: "0.5rem", transform: "scale(1.3)" }}>
                                  <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                                </svg>
                                Active
                              </span>
                            </a>
                          );
                        },
                      },
                    ];
                    return (
                      <>
                        <SlideMenu
                          ref={menu}
                          model={items}
                          popup
                          viewportHeight={150}
                          menuWidth={180}
                          onHide={() => {
                            setInViewMenuItem(null);
                          }}
                        />
                        <Button
                          rounded
                          severity="secondary"
                          text
                          aria-label="Menu"
                          size="small"
                          className="mx-1"
                          onClick={(event) => {
                            setInViewMenuItem(item);
                            setOnenotification(item);
                            menu.current.toggle(event);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-three-dots"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                          </svg>
                        </Button>
                      </>
                    );
                  }}

                /> 
                

            </DataTable>


            <Dialog
              // headerStyle={{ backgroundImage: `url("/images/wasilibackground-04.jpg")`, backgroundSize: 'cover' }}
              // headerClassName="text-white"
              headerStyle={{ backgroundColor: '#ecc5c5', backgroundSize: 'cover' }}
              headerClassName="text-black"
              header={`Détail de ${onenotification?.utilisateur.NOM} ${onenotification?.utilisateur.PRENOM} 
              (${onenotification?.browserName} ,${onenotification?.osVersion})`}
              visible={detail}
              style={{ width: "70vw" }}
              onHide={() => setDetail(false)}
            >
              {!onenotification ? null : <Detailutilisateur detailutilisateur={onenotification} />}
            </Dialog>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}


