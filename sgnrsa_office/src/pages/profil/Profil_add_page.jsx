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
import { useNavigate } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";

const initialForm = {
  DESCRIPTION: "",
};

export default function Profil_add_page() {
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [roles, setRoles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [loadingprofile, setLoadingprofile] = useState(true);

  const { hasError, getError, setErrors, checkFieldData, isValidate, getErrors, setError, } = useFormErrorsHandle(data, {
    DESCRIPTION: {
      required: true,
      length: [1, 50],
      alpha: true
    }

  }, {
    DESCRIPTION: {
      required: "Ce champ est obligatoire",
      length: "La description ne doit pas depasser max(50 caracteres)",
      alpha: "La description est invalide"
    }
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isValidate()) {
        setIsSubmitting(true)
        const form = new FormData()
        form.append("DESCRIPTION", data.DESCRIPTION);
        form.append('roles', JSON.stringify(roles))
        const res = await fetchApi("/administration/profile/create", {
          method: "POST",
          body: form,
        });

        dispacth(
          setToastAction({
            severity: "success",
            summary: "Profil enregistré",
            detail: "Le profil a été enregistré avec succès",
            life: 3000,
          })
        );
        navigate('/profil')
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
    dispacth(
      setBreadCrumbItemsAction([
        administration_routes_items.profil,
        administration_routes_items.add_profil,
      ])
    );
    return () => {
      dispacth(setBreadCrumbItemsAction([]));
    };
  }, []);



  const toggleReadPermission = rol => {
    const newRoles = roles.map(r => {
      if (r.ID_ROLE == rol.ID_ROLE) {
        const CAN_READ = r.CAN_READ == 0 ? 1 : 0
        return {
          ...r,
          CAN_READ
        }
      } else {
        return r
      }
    })
    setRoles(newRoles)
  }
  const toggleWritePermission = rol => {
    const newRoles = roles.map(r => {
      if (r.ID_ROLE == rol.ID_ROLE) {
        const CAN_WRITE = r.CAN_WRITE == 0 ? 1 : 0
        return {
          ...r,
          CAN_WRITE
        }
      } else {
        return r
      }
    })
    setRoles(newRoles)
  }


  // fonction pour les qui affichent les roles
  const fetchRole = useCallback(async () => {
    try {
      const res = await fetchApi(`/administration/profile/findrole`)
      const newRole = res.result.map(r => ({
        ...r,
        CAN_READ: 1,
        CAN_WRITE: 1

      })
      )
      setRoles(newRole)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingprofile(false);
    }
  }, [])

  useEffect(() => {
    fetchRole()
  }, [])


  const invalidClass = (name) => (hasError(name) ? "is-invalid" : "");
  return (
    <>
      {isSubmitting ? <Loading /> : null}
      <div className="px-4 py-3 main_content bg-white has_footer">
        <div className="">
          <h1 className="mb-3">Nouveau profil</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="DESCRIPTION" className="label mb-1">
                  Profil
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Ecrire le profil"
                  id="DESCRIPTION"
                  name="DESCRIPTION"
                  value={data.DESCRIPTION}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("DESCRIPTION") ? "p-invalid" : ""
                    }`}
                />
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 ">
            <label htmlFor="description" className="label mb-1" style={{ fontWeight: "bold" }}>
              Permission
            </label>
          </div>

          <div className="mt-3">
            <table className="table table-striped table-bordered">
              <thead className="bg-light">
                <tr>
                  <th>Role</th>
                  <th>Lecture</th>
                  <th>Ecriture</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((rol, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <p className="">{rol.ROLE}</p>
                      </td>
                      <td>
                        <div className="mb-2">
                          <Checkbox id={`rol_read_${rol.ID_ROLE}`} checked={rol.CAN_READ ? true : false} onChange={e => {
                            e.preventDefault()
                            toggleReadPermission(rol)
                          }}
                            className="ml-2"
                          />
                        </div>
                      </td>

                      <td>
                        <div className="mb-2">
                          <Checkbox id={`rol_write_${rol.ID_ROLE}`} checked={rol.CAN_WRITE ? true : false} onChange={e => {
                            e.preventDefault()
                            toggleWritePermission(rol)
                          }}
                            className="ml-2"
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
            <Button
              label="Reinitialiser"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setData(initialForm);
                setErrors({});
              }}
            />
            <Button
              label="Envoyer"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </>
  );
}
