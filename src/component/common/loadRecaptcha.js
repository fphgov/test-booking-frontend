const loadRecaptcha = (callback) => {
  const existingScript = document.getElementById('g-recaptcha')

  if (!existingScript) {
    const script = document.createElement('script')

    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.SITE_KEY}`
    document.body.appendChild(script)

    script.onload = () => {
      if (callback) callback()
    }
  }

  if (existingScript && callback) callback()
}
export default loadRecaptcha
