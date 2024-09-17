
import { Skeleton } from 'primereact/skeleton';

export default function DashboardSkeletons() {
          return (
                    <div className="div rounded bg-white p-3">
                              <div className="d-flex align-items-center justify-content-between mb-4">
                                        <Skeleton width="15rem" height="1.5rem" shape='rectangle' className="mb-2"></Skeleton>
                                        <div className="d-flex align-items-center ">
                                                  <Skeleton width="5rem" height="1rem" shape='rectangle' className="mb-2 mx-2"></Skeleton>
                                                  <Skeleton width="5rem" height="1rem" shape='rectangle' className="mb-2 mx-2"></Skeleton>
                                                  <Skeleton width="5rem" height="1rem" shape='rectangle' className="mb-2"></Skeleton>
                                        </div>
                              </div>
                              <div className="d-flex align-items-end justify-content-between mb-2" style={{ height: 300 }}>
                                        <div className="d-flex align-items-end flex-fill h-100">
                                                  <div className="vr"></div>
                                                  <div className="flex-fill mx-2 h-25" style={{ backgroundColor: '#71b3a1', borderRadius: 3}}></div>
                                        </div>
                                        <div className="d-flex align-items-end flex-fill h-100">
                                                  <div className="vr"></div>
                                                  <div className="flex-fill mx-2 h-50" style={{ backgroundColor: '#71b3a1', borderRadius: 3}}></div>
                                        </div>
                                        <div className="d-flex align-items-end flex-fill h-100">
                                                  <div className="vr"></div>
                                                  <div className="flex-fill mx-2 h-75" style={{ backgroundColor: '#71b3a1', borderRadius: 3}}></div>
                                        </div>
                                        <div className="d-flex align-items-end flex-fill h-100">
                                                  <div className="vr"></div>
                                                  <div className="flex-fill mx-2 h-50" style={{ backgroundColor: '#bdc974', borderRadius: 3}}></div>
                                        </div>
                                        <div className="d-flex align-items-end flex-fill h-100">
                                                  <div className="vr"></div>
                                                  <div className="flex-fill mx-2 h-100" style={{ backgroundColor: '#71b3a1', borderRadius: 3}}></div>
                                        </div>
                              </div>
                    </div>
          )
}