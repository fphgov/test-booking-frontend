import React from "react"
import {
  useLocation
} from "react-router-dom"
import StoreContext from '../../StoreContext'

export default function PageWrapper(props) {
  const context = React.useContext(StoreContext)

  const location = useLocation()

  React.useEffect(() => {
    context.set('location', location)
  }, [ location ])

  return (
    <>
      {props.children}
    </>
  )
}
