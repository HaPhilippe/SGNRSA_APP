// // import "../../styles/app/welcome/login.css"
// // import mubleco from '/images/user.png'
// import icon from '/images/user.png'
// import { InputText } from 'primereact/inputtext';
// import { useForm } from "../../hooks/useForm";
// import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
// import { Button } from "primereact/button";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// // import { setToastAction } from "../../store/actions/appActions";
// import Loading from "../../components/app/Loading";
// import fetchApi from "../../helpers/fetchApi";
// import { setUserAction } from "../../store/actions/userActions";
// import { useNavigate } from "react-router";
// import getDeviceInfo from "../../utils/getDeviceInfo";

// // import { welcome_routes_items } from "../../routes/welcome/welcome_routes";
// import {
//     setBreadCrumbItemsAction,
//     setToastAction,
// } from "../../store/actions/appActions";


// export default function LoginPage() {
//     const [data, handleChange] = useForm({
//         EMAIL: '',
//         PASSWORD: ''
//     })
//     const [loading, setLoading] = useState(false)
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
//         EMAIL: {
//             required: true,
//             email: true
//         },
//         PASSWORD: {
//             required: true
//         },
//     }, {
//         EMAIL: {
//             required: "Ce champ est obligatoire",
//             email: "Email invalide"
//         },
//         PASSWORD: {
//             required: "Ce champ est obligatoire"
//         },
//     })
//     const handleSubmit = async (e) => {
//         try {
//             e.preventDefault()
//             if (!isValidate()) return false
//             setLoading(true)
//             setErrors({})
//             const form = new FormData()
//             const deviceInfo = getDeviceInfo()
//             form.append("EMAIL", data.EMAIL)
//             form.append("PASSWORD", data.PASSWORD)
//             form.append("deviceInfo", JSON.stringify(deviceInfo))
//             const res = await fetchApi("/administration/auth/login", {
//                 method: 'POST',
//                 body: form
//             })
//             const user = res.result
//             dispatch(setUserAction(user))
//             localStorage.setItem('user', JSON.stringify(user))
//             navigate("/")
//             dispatch(setToastAction({ severity: 'success', summary: "Vous êtes connecté", detail: "Vos identifiants sont corrects", life: 3000, position: 'top-left' }))
//         } catch (error) {
//             console.log(error)
//             if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
//                 setErrors(error.result)
//             } else if (error.httpStatus == "NOT_FOUND") {
//                 dispatch(setToastAction({ severity: 'error', summary: 'Identifiants incorrent', detail: "Vérifier votre EMAIL ou mot de passe", life: 3000 }));
//             } else {
//                 dispatch(setToastAction({ severity: 'error', summary: "Erreur du système", detail: "Erreur du système, réessayez plus tard", life: 3000 }));
//             }
//         } finally {
//             setLoading(false)
//         }
//     }

//     const [visiblePassowrd, setVisiblePassword] = useState(false)

//     return (
//         <>
//             {loading && <Loading />}
//             <div className="" style={{ backgroundColor: '#eff3f8' }}>
//                 <div className="container">
//                     {/* <div className="mubleco-logo d-flex align-items-center px-7 ml-2">
//                         <div className="logo_container">
//                             <img src={icon} alt="mubleco" className="w-100 h-100 object-fit-cover d-block m-auto" />
//                         </div>
//                         <div className="block ml-2">
//                             <h5 className="mb-0"> SGNRSA</h5>
//                             <div className="text-muted text-sm" style={{ fontSize: 12 }}>Burundi</div>
//                         </div>
//                     </div> */}
//                     <div className="d-flex">
//                         <div className="w-50 d-flex align-items-center justify-content-center bg-white">
//                             <form action="" method="POST" className="form w-75" onSubmit={handleSubmit}>
//                                 <h1 className="mb-3">Se connecter</h1>
//                                 <div className="form-group w-100">
//                                     <label htmlFor="EMAIL" className="label mb-1">Email</label>
//                                     <div className="col-sm">
//                                         <InputText type="text" placeholder="Ecrire votre email" id="EMAIL" name="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('EMAIL') ? 'p-invalid' : ''}`} />
//                                         <div className="invalid-feedback" style={{ minHeight: 0, display: 'block' }}>
//                                             {hasError('EMAIL') ? getError('EMAIL') : ""}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="form-group w-100 mt-3">
//                                     <label htmlFor="PASSWORD" className="label mb-1">Mot de passe </label>
//                                     <div className="col-sm">
//                                         <span className="p-input-icon-right w-100">
//                                             <InputText type={visiblePassowrd ? "text" : "PASSWORD"} placeholder="Ecrire le mot de passe" id="PASSWORD" name="PASSWORD" value={data.PASSWORD} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('PASSWORD') ? 'p-invalid' : ''}`} />
//                                             {!visiblePassowrd ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye cursor-pointer" viewBox="0 0 16 16" onClick={() => setVisiblePASSWORD(b => !b)}>
//                                                 <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
//                                                 <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
//                                             </svg> :
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash cursor-pointer" viewBox="0 0 16 16" onClick={() => setVisiblePASSWORD(b => !b)}>
//                                                     <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
//                                                     <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
//                                                     <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
//                                                 </svg>}
//                                         </span>
//                                         <div className="invalid-feedback" style={{ minHeight: 0, display: 'block' }}>
//                                             {hasError('PASSWORD') ? getError('PASSWORD') : ""}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <a href="#" className="d-block text-decoration-none my-3 text-right">Mot de passe oublie</a>
//                                 <Button label="se connecter" className="w-100" disabled={!isValidate()} loading={loading} />
//                             </form>
//                         </div>
//                         {/* <div className="psr-collage w-50 d-flex align-items-center justify-content-center" style={{ borderLeftWidth: 0.5, borderLeftColor: '#c4c4c4' }}>
//                             <img src={mubleco} alt="Psr collage" className="w-100 h-100 object-fit-cover d-block m-auto" />
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }




import icon from '/images/user.png';
import { InputText } from 'primereact/inputtext';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { Button } from "primereact/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../components/app/Loading";
import fetchApi from "../../helpers/fetchApi";
import { setUserAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router";
import getDeviceInfo from "../../utils/getDeviceInfo";
import { setToastAction } from "../../store/actions/appActions";

export default function LoginPage() {
    const [data, handleChange] = useForm({
        EMAIL: '',
        PASSWORD: ''
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
        EMAIL: { required: true, email: true },
        PASSWORD: { required: true },
    }, {
        EMAIL: { required: "Ce champ est obligatoire", email: "Email invalide" },
        PASSWORD: { required: "Ce champ est obligatoire" },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidate()) return;
        setLoading(true);
        setErrors({});
        const form = new FormData();
        const deviceInfo = getDeviceInfo();
        form.append("EMAIL", data.EMAIL);
        form.append("PASSWORD", data.PASSWORD);
        form.append("deviceInfo", JSON.stringify(deviceInfo));

        try {
            const res = await fetchApi("/administration/auth/login", {
                method: 'POST',
                body: form
            });
            const user = res.result;
            dispatch(setUserAction(user));
            localStorage.setItem('user', JSON.stringify(user));
            navigate("/");
            dispatch(setToastAction({ severity: 'success', summary: "Vous êtes connecté", detail: "Vos identifiants sont corrects", life: 3000, position: 'top-left' }));
        } catch (error) {
            if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
                setErrors(error.result);
            } else {
                dispatch(setToastAction({ severity: 'error', summary: 'Identifiants incorrects', detail: "Vérifiez votre EMAIL ou mot de passe", life: 3000 }));
            }
        } finally {
            setLoading(false);
        }
    };

    const [visiblePassword, setVisiblePassword] = useState(false);

    return (
        <>
            {loading && <Loading />}
            
            {/* <div className="flex flex-col align-items-center justify-content-center min-h-screen bg-gray-100">
                <div className="card p-5 shadow-2 border-round">
                    <h1 className="text-center mb-4">Se connecter</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="EMAIL" className="font-semibold">Email</label>
                            <InputText id="EMAIL" name="EMAIL" value={data.EMAIL} onChange={handleChange} onBlur={checkFieldData} className={`w-full ${hasError('EMAIL') ? 'p-invalid' : ''}`} placeholder="Ecrire votre email" />
                            <small className="p-error">{hasError('EMAIL') ? getError('EMAIL') : ""}</small>
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="PASSWORD" className="font-semibold">Mot de passe</label>
                            <InputText id="PASSWORD" name="PASSWORD" type={visiblePassword ? "text" : "password"} value={data.PASSWORD} onChange={handleChange} onBlur={checkFieldData} className={`w-full ${hasError('PASSWORD') ? 'p-invalid' : ''}`} placeholder="Ecrire le mot de passe" />
                            <button type="button" className="absolute right-0 top-0 mt-3 mr-2" onClick={() => setVisiblePassword(prev => !prev)}>
                                {visiblePassword ? <i className="pi pi-eye-slash" /> : <i className="pi pi-eye" />}
                            </button>
                            <small className="p-error">{hasError('PASSWORD') ? getError('PASSWORD') : ""}</small>
                        </div>
                        <a href="#" className="text-right block mt-2">Mot de passe oublié?</a>
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={!isValidate()} loading={loading} />
                    </form>
                </div>
            </div> */}
            <div className="flex flex-col align-items-center justify-content-center min-h-screen" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
                <div className="card p-5 shadow-2 border-round">
                    <h1 className="text-center mb-4">Se connecter</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="EMAIL" className="font-semibold">Email</label>
                            <InputText
                                id="EMAIL"
                                name="EMAIL"
                                value={data.EMAIL}
                                onChange={handleChange}
                                onBlur={checkFieldData}
                                className={`w-full ${hasError('EMAIL') ? 'p-invalid' : ''}`}
                                placeholder="Ecrire votre email"
                            />
                            <small className="p-error">{hasError('EMAIL') ? getError('EMAIL') : ""}</small>
                        </div>
                        {/* <div className="field mt-3">
                            <label htmlFor="PASSWORD" className="font-semibold">Mot de passe</label>
                            <span className="p-input-icon-right">
                                <InputText
                                    id="PASSWORD"
                                    name="PASSWORD"
                                    type={visiblePassword ? "text" : "password"}
                                    value={data.PASSWORD}
                                    onChange={handleChange}
                                    onBlur={checkFieldData}
                                    className={`w-full ${hasError('PASSWORD') ? 'p-invalid' : ''}`}
                                    placeholder="Ecrire le mot de passe"
                                />
                                <button
                                    type="button"
                                    className="p-inputtext-icon"
                                    onClick={() => setVisiblePassword(prev => !prev)}
                                    aria-label={visiblePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {visiblePassword ? <i className="pi pi-eye-slash" /> : <i className="pi pi-eye" />}
                                </button>
                            </span>
                            <small className="p-error">{hasError('PASSWORD') ? getError('PASSWORD') : ""}</small>
                        </div> */}
                        {/* <div className="field mt-3">
                            <label htmlFor="PASSWORD" className="font-semibold">Mot de passe</label>
                            <div className="flex align-items-center">
                                <InputText
                                    id="PASSWORD"
                                    name="PASSWORD"
                                    type={visiblePassword ? "text" : "password"}
                                    value={data.PASSWORD}
                                    onChange={handleChange}
                                    onBlur={checkFieldData}
                                    className={`w-full ${hasError('PASSWORD') ? 'p-invalid' : ''}`}
                                    placeholder="Ecrire le mot de passe"
                                />
                                <button
                                    type="button"
                                    className="p-inputtext-icon ml-3" // Add margin to the left for spacing
                                    onClick={() => setVisiblePassword(prev => !prev)}
                                    aria-label={visiblePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {visiblePassword ? <i className="pi pi-eye-slash" /> : <i className="pi pi-eye" />}
                                </button>
                            </div>
                            <small className="p-error">{hasError('PASSWORD') ? getError('PASSWORD') : ""}</small>
                        </div> */}
                        <div className="field mt-3">
                            <label htmlFor="PASSWORD" className="font-semibold">Mot de passe</label>
                            <div className="relative">
                                <InputText
                                    id="PASSWORD"
                                    name="PASSWORD"
                                    type={visiblePassword ? "text" : "password"}
                                    value={data.PASSWORD}
                                    onChange={handleChange}
                                    onBlur={checkFieldData}
                                    className={`w-full ${hasError('PASSWORD') ? 'p-invalid' : ''}`}
                                    placeholder="Ecrire le mot de passe"
                                />
                                <button
                                    type="button"
                                    className="p-inputtext-icon toggle-password"
                                    onClick={() => setVisiblePassword(prev => !prev)}
                                    aria-label={visiblePassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {visiblePassword ? <i className="pi pi-eye-slash" /> : <i className="pi pi-eye" />}
                                </button>
                            </div>
                            <small className="p-error">{hasError('PASSWORD') ? getError('PASSWORD') : ""}</small>
                        </div>
                        <a href="#" className="text-right block mt-2">Mot de passe oublié?</a>
                        <Button type="submit" label="Se connecter" className="w-full mt-3" disabled={!isValidate()} loading={loading} />
                    </form>
                </div>
            </div>
        </>
    );
}