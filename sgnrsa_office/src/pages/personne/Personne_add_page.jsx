
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
import { InputMask } from "primereact/inputmask";

const initialForm = {

  NOM: '',
  PRENOM: '',
  EMAIL: '',
  ADRESS: '',
  TELEPHONE: '',
  CNI: '',
  IMAGE: null
}

export default function Personne_add_page() {
  const dispacth = useDispatch()
  const [data, handleChange, setData, setValue] = useForm(initialForm)
  const [personne, setPersonne] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { hasError, getError, setErrors, getErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
    NOM: {
      required: true,
      length: [1, 30],
      alpha: true
    },
    PRENOM: {
      required: true,
      length: [1, 20],
      alpha: true
    },
    EMAIL: {
      required: true,
      length: [1, 50],
      alpha: true,
      email: true,
    },
    ADRESS: {
      required: true,
      length: [1, 100],
      alpha:true
    },
    TELEPHONE: {
      required: true,
      length: [1, 15],
      number: true,
    },
    IMAGE: {
      required: true,
      image: 4000000
    }
  }, {
    NOM: {
      required: "Ce champ est obligatoire",
      length: "Le nom d'utilisateur ne doit pas depasser max(30 caracteres)",
      alpha: "Le nom d'utilisateur est invalide"
    },
    PRENOM: {
      required: "Ce champ est obligatoire",
      length: "Le prenom ne doit etre depasser max(20 carateres)",
      alpha: "Le prenom est invalide"
    },
    EMAIL: {
      required: "Ce champ est obligatoire",
      length: "L'email ne doit pas depasser max(90 caracteres)",
      alpha: "L'email est invalide",
      email: "L'email n'existe pas",
    },
    ADRESS: {
      required: "Ce champ est obligatoire",
      length: "L'adresse  ne doit pas depasser max(100 caracteres)",
      alpha: "L'adresse est est valide",
    },
    TELEPHONE: {
      required: "Ce champ est obligatoire",
      length: "Le numero de telephone ne doit pas depasser max(15 chiffres)",
      number: "Le numero de telephone doit etre un nombre",
    },
    CNI: {
      required: "Ce champ est obligatoire",
      length: "La CNI ne doit pas depasser max(20 caracteres)",
      alpha: "La CNI est invalide"
    },
    IMAGE: {
      required: "Ce champ est obligatoire",
      image: "L'image ne doit pas depasser 4Mo "
    }
  })



  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM", data.NOM);
        form.append("PRENOM", data.PRENOM);
        form.append("EMAIL", data.EMAIL);
        form.append("ADRESS", data.ADRESS);
        form.append("TELEPHONE", data.TELEPHONE);
        form.append("CNI", data.CNI)
        if (data?.IMAGE) {
          form.append('IMAGE', data?.IMAGE)
        }

        const res = await fetchApi(`/rh/personne/create`, {
          method: 'POST',
          body: form
        })

        dispacth(
          setToastAction({
            severity: "success",
            summary: 'Personne enregistré',
            detail: "La personne a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/personne')
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



  useEffect(() => {
    dispacth(setBreadCrumbItemsAction([
      administration_routes_items.personne,
      administration_routes_items.add_personne
    ]))
    return () => {
      dispacth(setBreadCrumbItemsAction([]))
    }
  }, [])


  useEffect(() => {
    if (data.IMAGE) {
      checkFieldData({ target: { name: "IMAGE" } })
    }
  }, [data.IMAGE])

  const invalidClass = name => hasError(name) ? 'is-invalid' : ''
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h1 className="mb-3">Nouvelle personne</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>

          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">Nom</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le nom"
                  id="NOM"
                  name="NOM"
                  value={data.NOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("NOM") ? getError("NOM") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="PRENOM" className="label mb-1">Prénom</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le prénom"
                  id="PRENOM"
                  name="PRENOM"
                  value={data.PRENOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("PRENOM") ? "p-invalid" : ""}`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("PRENOM") ? getError("PRENOM") : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="EMAIL" className="label mb-1">Adresse email</label>
              </div>
              <div className="col-sm">
                <InputText type="email" placeholder="Ecrire l'adresse e-mail" name="EMAIL" id="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL') ? 'p-invalid' : ''}`} />
                <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                  {hasError('EMAIL') ? getError('EMAIL') : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="ADRESS" className="label mb-1">Adresse</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Quelle est votre adresse ?"
                  id="ADRESS"
                  name="ADRESS"
                  value={data.ADRESS}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("ADRESS") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ADRESS") ? getError("ADRESS") : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="TELEPHONE" className="label mb-1">Téléphone</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  // pattern="[0-9]
                  // {3}-[0-9]{3}-[0-9]{4}"
                  placeholder="Ecrire le numéro de téléphone"
                  id="TELEPHONE"
                  name="TELEPHONE"
                  value={data.TELEPHONE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("TELEPHONE") ? "p-invalid" : ""}`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("TELEPHONE") ? getError("TELEPHONE") : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="CNI" className="label mb-1">CNI</label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le CNI"
                  id="CNI"
                  name="CNI"
                  value={data.CNI}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("CNI") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("CNI") ? getError("CNI") : ""}
                </div>
              </div>
            </div>
          </div>


          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4 ">
                <label htmlFor="Photo" className="label mb-1">
                  Photo du personne
                </label>
              </div>
              <div className="col-sm">
                <FileUpload
                  chooseLabel="Choisir l'image"
                  cancelLabel="Annuler"
                  name="image"
                  uploadOptions={{
                    style: { display: "none" },
                  }}
                  // className="p-invalid"
                  accept="image/*"
                  maxFileSize={4000000}
                  invalidFileSizeMessageDetail='Image est trop lourd'
                  emptyTemplate={
                    <p className="m-0">Glisser et déposez l'image ici.</p>
                  }
                  onSelect={async (e) => {
                    const file = e.files[0];
                    setValue("IMAGE", file);
                  }}
                  onClear={() => {
                    setError("IMAGE", {});
                  }}
                  className={`${hasError("IMAGE") ? "p-invalid" : ""}`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("IMAGE") ? getError("IMAGE") : ""}
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