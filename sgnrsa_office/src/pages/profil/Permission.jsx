
import { Image } from "primereact/image";
import moment from "moment";
import UserImage from "/images/user.png";
import { useCallback, useEffect, useState } from "react";
import fetchApi from "../../helpers/fetchApi";

export default function Permission({ permission }) {
  const [profile_role, setProfile_role] = useState([])
  const [loadingpermis, setLoadingpermis] = useState(true);
  // console.log(permission)
  // const fetchRole = useCallback(async () => {
  //     try {
  //         const res = await fetchApi(`/admin/profil/roles/${permission}`)

  //           setProfile_role(res.result)
  //     } catch (error) {
  //         console.log(error)
  //     }
  // }, [permission])

  // useEffect(() => {
  //     fetchRole()
  // }, [permission])


  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi(`/administration/profile/find/${permission}`);
        const uti = res.result;

        const resRoles = await fetchApi(`/administration/profile/findrole`);
        const allRoles = resRoles.result;

        if (uti.profil_roles.length === 0) {
          // Aucune insertion pour cet ID_PROFIL, initialisation des valeurs par défaut
          const newRoles = allRoles.map((role) => ({
            ...role,
            CAN_READ: 1,
            CAN_WRITE: 1,
          }));
          setProfile_role(newRoles)

        } else {
          const newRoles = allRoles.map((role) => {
            const foundProfileRole = uti.profil_roles.find((profileRole) => profileRole.ID_ROLE === role.ID_ROLE);

            if (foundProfileRole) {
              return {
                ...role,
                CAN_READ: foundProfileRole.CAN_READ,
                CAN_WRITE: foundProfileRole.CAN_WRITE,
              };
            } else {
              return {
                ...role,
                CAN_READ: 0,
                CAN_WRITE: 0,
              };
            }
          });
          setProfile_role(newRoles)
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoadingpermis(false);
      }
    })();
  }, []);


  if (loadingpermis) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 w-100 mt-2">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (

    <>
      {profile_role.length === 0 ? (<div className="text-center mt-3">Aucune permission</div>) :
        <table className="table align-middle bg-white">
          <thead className="bg-light">
            <tr>
              <th>Rôle</th>
              <th>Lecture </th>
              <th>Ecriture </th>
            </tr>
          </thead>
          <tbody>
            {profile_role.map((rol, index) => {
              return (
                <tr key={index}>
                  <td>
                    <p className="">{rol?.ROLE}</p>
                  </td>
                  <td>
                    <p className="">{rol?.CAN_READ == 1 ?
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        class="bi bi-check-lg"
                        viewBox="0 0 16 16"
                        style={{ color: "blue" }}
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                      :
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        class="bi bi-x"
                        viewBox="0 0 16 16"
                        style={{ color: "red" }}

                      >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                      </svg>
                    }</p>
                  </td>
                  <td>
                    <p className="">{rol?.CAN_WRITE == 1 ?
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        class="bi bi-check-lg"
                        viewBox="0 0 16 16"
                        style={{ color: "blue" }}
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>

                      :
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        class="bi bi-x"
                        viewBox="0 0 16 16"
                        style={{ color: "red" }}

                      >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                      </svg>

                    }</p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>}


    </>

  )
}


