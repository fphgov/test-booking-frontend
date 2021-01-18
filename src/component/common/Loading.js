import React from "react"
import Logo from '../../img/logoipsum.svg'

export default function Loading() {
  return (
    <div className="loading-overlayer">
      <div className="loader"><Logo /></div>
    </div>
  )
}
