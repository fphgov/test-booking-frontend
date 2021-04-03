import jwtDecode from "jwt-decode"

const tokenParser = function(key) {
  const token = localStorage.getItem('auth_token')

  if (token) {
    const decodedJwt = jwtDecode(token)

    let decoded = decodedJwt

    key.split('.').forEach((k) => {
      decoded = decoded && decoded[k] || null
    })

    return decoded
  }

  return null
}

export default tokenParser
