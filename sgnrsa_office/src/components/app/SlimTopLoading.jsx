import { useEffect } from 'react'
import { useRef } from 'react'
import LoadingBar from 'react-top-loading-bar'

export default function SlimTopLoading() {
          const ref = useRef(null)

          useEffect(() => {
                    ref.current.continuousStart()
          }, [ref])

          return <LoadingBar color="#0d6efd" ref={ref} />
}