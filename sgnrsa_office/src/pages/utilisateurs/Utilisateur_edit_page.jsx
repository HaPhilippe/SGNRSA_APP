import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setBreadCrumbItemsAction,
  setToastAction,
} from "../../store/actions/appActions";
import { administration_routes_items } from "../../routes/admin/administration_routes";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import moment from "moment";
import fetchApi from "../../helpers/fetchApi";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import wait from "../../helpers/wait";
import Loading from "../../components/app/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { Image } from "primereact/image";

const initialForm = {
  NOM: "",
  PRENOM: "",
  USERNAME: "",
  ID_PROFIL: null,
  TELEPHONE: null,
  EMAIL: "",
  MATRICULE: "",
  // PASSWORD: ''
};

export default function Utilisateur_edit_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [showCalendar, setShowCalendar] = useState(false);
  const [profil, setProfil] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { ID_UTILISATEUR } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [loadingUtilisateur, setLoadingUtilisateur] = useState(true);

  const {hasError,getError,setErrors,checkFieldData,isValidate,setError,getErrors} = useFormErrorsHandle(data, {
    NOM: {
      required: true,
      alpha: true,
      length: [1, 50],
    },
    PRENOM: {
      required: true,
      alpha: true,
      length: [1, 50],
    },
    USERNAME: {
      required: true,
      username: true,
      length: [1, 50],
    },
    ID_PROFIL: {
      required: true,
    },
    TELEPHONE: {
      required: true,
      length: [8, 8],
      number: true
    },
    EMAIL: {
      required: true,
      length: [1, 245],
      email: true
    },
    MATRICULE: {
      required: true,
      length: [1, 50],
      alpha: true,
    },
  });
  const handleVisibility = (e) => {
    setShowCalendar(!showCalendar);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("NOM", data.NOM);
        form.append("PRENOM", data.PRENOM);
        form.append("TELEPHONE", data.TELEPHONE);
        form.append("EMAIL", data.EMAIL);
        form.append("MATRICULE", data.MATRICULE)
        if (data?.IMAGE) {
          form.append('IMAGE', data?.IMAGE)
        }
        form.append("USERNAME", data.USERNAME);
        form.append("ID_PROFIL", data.ID_PROFIL?.code ? data.ID_PROFIL?.code : '');

        const res = await fetchApi(`/administration/utilisateurs/update/${ID_UTILISATEUR}`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: "Utilisateur modifié",
            detail: "L'utilisateur a été modifié avec succès",
            life: 3000,
          })
        );
        navigate("/utilisateurs");
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

  //liste deroulante des profiles
  const fetchProfil = useCallback(async () => {
    try {
      const res = await fetchApi("/administration/utilisateurs/profile");
      setProfil(
        res.result.map((prof) => {
          return {
            name: prof.DESCRIPTION,
            code: prof.ID_PROFIL,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchProfil();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi(`/administration/utilisateurs/find/${ID_UTILISATEUR}`);
       
        const uti = res.result;
        setUtilisateur(uti);
        setData({
          NOM: uti.NOM,
          PRENOM: uti.PRENOM,
          USERNAME: uti.USERNAME,
          TELEPHONE: uti.TELEPHONE,
          EMAIL: uti.EMAIL,
          MATRICULE: uti.MATRICULE,
          ID_PROFIL: {
            name: uti.PROFIL.DESCRIPTION,
            code: uti.PROFIL.ID_PROFIL,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUtilisateur(false);
      }
    })();
  }, []);

  useEffect(() => {
    dispacth(
      setBreadCrumbItemsAction([
        administration_routes_items.utilisateurs,
        administration_routes_items.edit_utilisateurs,
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);

  useEffect(() => {
    if (data.IMAGE) {
      checkFieldData({ target: { name: "IMAGE" } })
    }
  }, [data.IMAGE])

  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  if (loadingUtilisateur) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 w-100">
        <div className="spinner-border" role="status" />
      </div>
    );
  }
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h4 className="mb-3">
            {utilisateur.NOM} {utilisateur.PRENOM}
          </h4>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="NOM" className="label mb-1">
                  Nom
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Ecrire le nom"
                  id="NOM"
                  name="NOM"
                  value={data.NOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("NOM") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("NOM") ? getError("NOM") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="PRENOM" className="label mb-1">
                  Prénom
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le prénom"
                  name="PRENOM"
                  id="PRENOM"
                  value={data.PRENOM}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("PRENOM") ? "p-invalid" : ""
                    }`}
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
                <label htmlFor="TELEPHONE" className="label mb-1">
                  Téléphone
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le numéro de téléphone"
                  name="TELEPHONE"
                  id="TELEPHONE"
                  value={data.TELEPHONE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("TELEPHONE") ? "p-invalid" : ""
                    }`}
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
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="MATRICULE" className="label mb-1">
                  Matricule
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le matricule"
                  name="MATRICULE"
                  id="MATRICULE"
                  value={data.MATRICULE}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("MATRICULE") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("MATRICULE") ? getError("MATRICULE") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="USERNAME" className="label mb-1">
                  Nom d'utilisateur
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le nom d'utilisateur"
                  name="USERNAME"
                  id="USERNAME"
                  value={data.USERNAME}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("USERNAME") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("USERNAME") ? getError("USERNAME") : ""}
                </div>
              </div>
            </div>
          </div>
     
          <div className="form-group mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="profile" className="label mb-1">Profil</label>
              </div>
              <div className="col-sm">
                <Dropdown
                  value={data.ID_PROFIL}
                  options={profil}
                  onChange={(e) => setValue("ID_PROFIL", e.value)}
                  optionLabel="name"
                  id="ID_PROFIL"
                  filter
                  filterBy="name"
                  placeholder="Sélectionner le profil"
                  emptyFilterMessage="Aucun element trouvee"
                  emptyMessage="Aucun element trouvee"
                  name="ID_PROFIL"
                  onHide={() => {
                    checkFieldData({ target: { name: "ID_PROFIL" } });
                  }}
                  className={`w-100 ${hasError("ID_PROFIL") ? "p-invalid" : ""}`}
                  showClear
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("ID_PROFIL") ? getError("ID_PROFIL") : ""}
                </div>

              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="EMAIL" className="label mb-1">
                  Adresse email
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire l'adresse e-mail"
                  name="EMAIL"
                  id="EMAIL"
                  value={data.EMAIL}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("EMAIL") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("EMAIL") ? getError("EMAIL") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4 ">
                <label htmlFor="Photo" className="label mb-1">
                  Photo du profile
                </label>
              </div>
              <div className="col-sm">
              <Image
                  src={utilisateur?.IMAGE}
                  alt="Image"
                  className="rounded"
                  imageClassName="rounded "
                  width="80"
                  height="80"
                  imageStyle={{ objectFit: "cover" }}
                  preview
                />
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
          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
            <Button
              label="Annuler"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                navigate("/users");
              }}
            />
            <Button
              label="Modifier"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              disabled={ isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
}
