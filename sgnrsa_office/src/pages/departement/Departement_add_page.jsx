
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../store/actions/appActions"
import { administration_routes_items } from "../../routes/admin/administration_routes"
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate } from "react-router-dom";


const initialForm = {
  
  NOM_DEPARTEMENT:'',
  DESCRIPTION: '',
  // ID_EMPLOYEUR: null
}

export default function Personne_add_page() {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [departement, setDepartement] = useState(null);
  const [employeur, setEmployeur] = useState([]);
  const [employeurD, setEmployeurD] = useState([]);
  const [poste, setPoste] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
   
    NOM_DEPARTEMENT: {
      required: true,
      length: [1, 50],
      alpha: true
    },
   
    DESCRIPTION: {
      required: true,
      length: [1, 250],
      alpha: true
    },
    // ID_EMPLOYEUR: {
    //   required: true
    // },

  }, {
  
   
    NOM_DEPARTEMENT: {
      required: "Ce champ est obligatoire",
      length: "Le nom du departement  ne doit pas depasser max(50 chiffres)",
      alpha: "Le nom du departemet non validé",
    },
    
    DESCRIPTION: {
      required: "Ce champ est obligatoire",
      length: "La description du departement ne doit pas depasser max(250 chiffres)",
      alpha: "La description departement est invalide"
    },
    // ID_EMPLOYEUR: {
    //   required: "Ce champ est obligatoire"
    // },
  })

// console.log(employeurD.code);
  const handleSubmit = async (e) => {

    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
          form.append("NOM_DEPARTEMENT", data.NOM_DEPARTEMENT),
          form.append("DESCRIPTION", data.DESCRIPTION),
          // form.append("ID_EMPLOYEUR", data.ID_EMPLOYEUR?.code ? data.ID_EMPLOYEUR?.code : '')
          
          form.append("ID_EMPLOYEUR",employeurD.code)
        const res = await fetchApi(`/rh/departement/create`, {
          method: 'POST',
          body: form
        })

        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Departement enregistré',
            detail: "Le departement a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/departement')
      }
      else {
        console.log(getErrors())
        setErrors(getErrors());
        dispacth(
          setToastAction({
            severity: "error",
            summary: 'La validation des données a échouée',
            detail: 'Veuillez corriger les erreurs mentionnées pour continuer',
            life: 3000,
          })
        );
        await wait(500)
        const header = document.querySelector('header')
        const nav = document.querySelector('nav')
        const firstErrorElement = document.querySelector(".p-invalid")
        if (firstErrorElement) {
          var headerHeight = 0
          if (header) headerHeight += header.offsetHeight
          if (nav) headerHeight += nav.offsetHeight
          const scrollPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }

      }
    }
    catch (error) {
      console.log(error)
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result);
        dispacth(setToastAction({
          severity: 'error',
          summary: 'Erreur du système',
          detail: 'Erreur du système, réessayez plus tard',
          life: 3000
        }));
        await wait(500)
        const header = document.querySelector('header')
        const nav = document.querySelector('nav')
        const firstErrorElement = document.querySelector(".p-invalid")
        if (firstErrorElement) {
          var headerHeight = 0
          if (header) headerHeight += header.offsetHeight
          if (nav) headerHeight += nav.offsetHeight
          const scrollPosition = firstErrorElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      } else {
        dispacth(setToastAction({
          severity: 'error',
          summary: 'Erreur du système',
          detail: 'Erreur du système, réessayez plus tard',
          life: 3000
        }));
      }

    } finally {
      setIsSubmitting(false)
    }
  }


  // Liste deroularantes des employeur
  const fetchEmployeur = useCallback(async () => {
    try {
      const res = await fetchApi(`/rh/employeur/fetchemployeur?emloyeur=5&`)
      // setEmployeur(res.result.data.map(emplo => {
      //   return {
      //     name: emplo.NOM_EMPLOYEUR,
      //     code: emplo.ID_EMPLOYEUR
      //   }
      // }))

      const emploi= res.result.data.map(emplo => {
        return {
          name: emplo.NOM_EMPLOYEUR,
          code: emplo.ID_EMPLOYEUR
        }
      })
      setEmployeur(emploi)
      
      const employeurDefault=emploi.slice(0,1).find(em=>em.code)
      setEmployeurD(employeurDefault);
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchEmployeur()
  }, [])

const selectDefaultEmployeur=(selectValueofEmployeur)=>{
  setEmployeurD(selectValueofEmployeur);
};
  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
      administration_routes_items.departement,
      administration_routes_items.add_departement
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])

  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h1 className="mb-3">Nouveau departement</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="	DESIGNATION" className="label mb-1">Departement</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le nom de département"
                  id="NOM_DEPARTEMENT"
                  name="NOM_DEPARTEMENT"
                  value={data.NOM_DEPARTEMENT}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("NOM_DEPARTEMENT") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("NOM_DEPARTEMENT") ? getError("NOM_DEPARTEMENT") : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="DESCRIPTION" className="label mb-1">Description</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire la description"
                  id="DESCRIPTION"
                  name="DESCRIPTION"
                  value={data.DESCRIPTION}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("DESCRIPTION") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="ID_EMPLOYEUR" className="label mb-1">Employeur</label>
              </div>
              <div className="col-sm">
                <Dropdown
                  // value={data.ID_EMPLOYEUR}
                  value={employeurD}
                  options={employeur}
                  // onChange={(e) => setValue("ID_EMPLOYEUR", e.value)}
                  onChange={(e)=>selectDefaultEmployeur(e.value)}
                  optionLabel="name"
                  id="ID_EMPLOYEUR"
                  filter
                  filterBy="name"
                  placeholder="Sélectionner le nom d'un employeur"
                  emptyFilterMessage="Aucun element trouvee"
                  emptyMessage="Aucun element trouvee"
                  name="ID_EMPLOYEUR"
                  onHide={() => {
                    checkFieldData({ target: { name: "ID_EMPLOYEUR" } });
                  }}
                  className={`w-100 ${hasError("ID_EMPLOYEUR") ? "p-invalid" : ""}`}
                  showClear
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("ID_EMPLOYEUR") ? getError("ID_EMPLOYEUR") : ""}
                </div>

              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">
            <Button label="Reinitialiser" type="reset" outlined className="mt-3" size="small" onClick={e => {
              e.preventDefault()
              setData(initialForm)
              setErrors({})
            }} />
            <Button label="Envoyer" type="submit" className="mt-3 ml-3" size="small" disabled={isSubmitting} />
          </div>
        </form>
      </div>
    </>
  )
}