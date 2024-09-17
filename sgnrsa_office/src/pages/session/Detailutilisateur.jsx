
import { Image } from "primereact/image";
import moment from "moment";
import UserImage from "/images/user.png";

export default function Detailutilisateur({detailutilisateur}) {
    return (

        <>
            <div className="row">
                <div className="col-sm mt-5 ">
                    <label htmlFor="" className="font-bold">
                    appCodeName
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.appCodeName ? detailutilisateur.appCodeName : '-'}
                    </div>
                </div>

                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    appName
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.appName ? detailutilisateur.appName : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    appVersion
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.appVersion ? detailutilisateur.appVersion : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    browserName
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.browserName ? detailutilisateur.browserName : '-'}
                    </div>
                </div>

            </div>


            <div className="row">
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    browserVersion
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.browserVersion ? detailutilisateur.browserVersion : '-'}
                    </div>
                </div>

                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    mobile
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.mobile ? detailutilisateur.mobile : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    osName
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.osName ? detailutilisateur.osName : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    osVersion
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.osVersion ? detailutilisateur.osVersion : '-'}
                    </div>
                </div>

            </div>


            <div className="row">
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    platform
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.platform ? detailutilisateur.platform : '-'}
                    </div>
                </div>

                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    userAgent
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.userAgent ? detailutilisateur.userAgent : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                    vendor
                    </label>
                    <div className="text-muted">
                        {detailutilisateur.vendor ? detailutilisateur.vendor : '-'}
                    </div>
                </div>
                <div className="col-sm mt-5">
                    <label htmlFor="" className="font-bold">
                        {/* osName */}

                    </label>
                    <div className="text-muted">
                        {/* {detailutilisateur.osName ? detailutilisateur.osName : '-'} */}
                    </div>
                </div>

            </div>

        </>

    )
}





