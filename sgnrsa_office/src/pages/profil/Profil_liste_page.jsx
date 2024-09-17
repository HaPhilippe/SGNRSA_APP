import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { administration_routes_items } from "../../routes/admin/administration_routes";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import fetchApi from "../../helpers/fetchApi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SlideMenu } from "primereact/slidemenu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Loading from "../../components/app/Loading";
import Permission from "./Permission";
import { Dialog } from "primereact/dialog";
import { userSelector } from "../../store/selectors/userSelector";


export default function Profil_liste_page() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [date, setDate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [profil, setProfil] = useState([]);
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  const [selectedItems, setSelectedItems] = useState(null);
  const menu = useRef(null);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);
  const [globalLoading, setGloabalLoading] = useState(false);
  const [permissions, setPermissions] = useState(false);
  const [persmissiondata, setPersmissiondata] = useState(null);
  const user = useSelector(userSelector)
// console.log(user);
  const navigate = useNavigate();

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
      setSelectedItems(profil);
    } else {
      setSelectAll(false);
      setSelectedItems([]);
    }
  };


  const fetchProfil = useCallback(async () => {
    try {
      setLoading(true);
      const baseurl = `/administration/profile/fetch?`;
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
      const res = await fetchApi(url);
      setProfil(res.result.data)
      setTotalRecords(res.result.totalRecords);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [lazyState]);

  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([administration_routes_items.profil]));
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);
  useEffect(() => {
    fetchProfil();
  }, [lazyState]);
  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />
      {globalLoading && <Loading />}
      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Profil</h1>
          <Button
            label="Nouveau"
            icon="pi pi-plus"
            size="small"
            onClick={() => {
              navigate("/profil/add");
            }}
          />
        </div>
        <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
          <div className="d-flex  align-items-center">
            <div className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="Recherche"
                className="p-inputtext-sm"
                style={{ minWidth: 300 }}
                onInput={(e) =>
                  setlazyState((s) => ({ ...s, search: e.target.value }))
                }
              />
            </div>
          
          </div>
        
        </div>
        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={profil}
              tableStyle={{ minWidth: "50rem" }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun profil trouvé"
              // paginatorLeft={paginatorLeft}
              // paginatorRight={paginatorRight}
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
                field="ID_PROFIL"
                frozen
                header="#"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.ID_PROFIL}
                    </span>
                  );
                }}
              />
              <Column
                field="DESCRIPTION"
                frozen
                header="Profil"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.DESCRIPTION}
                    </span>
                  );
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
                            to={`/profil/edit/${inViewMenuItem?.ID_PROFIL}`}
                            className="p-menuitem-link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                              style={{ marginRight: "0.5rem" }}
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                            <span className="p-menuitem-text">Modifier</span>
                          </Link>
                        );
                      },
                    },
                    {
                      template: (deleteItem, options) => {
                        return (
                          <Link
                            to={`#`}
                            className="p-menuitem-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setPermissions(true);
                            }}
                          >
                             <svg 
                             style={{ marginRight: "0.5rem" }}
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill="currentColor" 
                            class="bi bi-meta" 
                            viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.614-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.136 0 .27.018Z" />
                            </svg>
                            <span className="p-menuitem-text">
                            Permission
                            </span>
                          </Link>
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
                        viewportHeight={100}
                        menuWidth={200}
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
                          setPersmissiondata(item);
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
              headerStyle={{ backgroundColor: '#ecc5c5', backgroundSize: 'cover' }}
              headerClassName="text-black"
              header ={ `Les roles et droits du profile ${persmissiondata?.DESCRIPTION}`}
              visible={permissions}
              style={{ width: "60vw" }}
              onHide={() => setPermissions(false)}
            >
              {!persmissiondata ? null : (
                <Permission
                  permission={persmissiondata?.ID_PROFIL}
                  
                />
              )}
            </Dialog>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
