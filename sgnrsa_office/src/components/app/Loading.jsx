import Lottie from "react-lottie-player";
import loading from '../../../public/lotties/loading_anumation.json'
import { createPortal } from "react-dom";

export default function Loading() {
          return (
                    createPortal(<div className="modal-loading-container">
                              <div className="modal-loading-content">
                                        <Lottie
                                                  animationData={loading}
                                                  style={{ background:"transparent", height: "100%" }} 
                                                  loop
                                                  play
                                        />
                              </div>
                    </div>, document.body)
          )
}