import { Skeleton } from 'primereact/skeleton';
import React, {useState, useEffect, useRef} from 'react';
import {ProgressBar} from 'primereact/progressbar';
import {Toast} from 'primereact/toast';

export default function HomeSkeletons() {

    const [value, setValue] = useState(0);
    const toast = useRef(null);
    const interval = useRef(null);

    useEffect(() => {
        let _val = value;

        interval.current = setInterval(() => {
            _val += Math.floor(Math.random() * 10) + 1;

            if (_val >= 100) {
                _val = 100;
                toast.current.show({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
                clearInterval(interval.current);
            }

            setValue(_val);
        }, 2000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        };
    }, []);
    return (


        <div className="div mt-3 rounded bg-white p-3">



           





            <div className="card">
                <Toast ref={toast}></Toast>
                <ProgressBar value={value}></ProgressBar>
            </div>





            <div className="d-flex align-items-center justify-content-between mb-4">
                <Skeleton width="15rem" height="1.5rem" shape='rectangle' className="mb-2"></Skeleton>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="div">
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                </div>
                <div className="div ">
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                </div>
                <div className="div ">
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <div className="d-flex mb-3">
                        <Skeleton shape="circle" size="2rem" className="mr-1"></Skeleton>
                        <div className='mx-2'>
                            <Skeleton width="5rem" height='1rem' className="mb-1"></Skeleton>
                            <Skeleton width="10rem" height='0.5rem' className="mb-1"></Skeleton>
                            <Skeleton width="2rem" height=".5rem"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}