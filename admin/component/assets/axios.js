import axios from "axios"

axios.defaults.validateStatus = function (status) {
  return status != 200
}

axios.interceptors.response.use(response => {
   return response
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('role')

    window.location.hash = '#/login'
  }

  return error
})

export default axios
