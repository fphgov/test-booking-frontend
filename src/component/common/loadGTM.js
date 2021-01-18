const loadGTM = (callback) => {
  const existingScript = document.getElementById('gtm')

  if (! existingScript) {
    const script = document.createElement('script')

    const l = 'dataLayer';
    const id = process.env.GTM_ID;

    script.src = `https://www.googletagmanager.com/gtm.js?id=${id}&l=${l}`
    script.id  = 'gtm'
    script.async = true

    document.body.appendChild(script)

    script.onload = () => {
      if (callback) callback()
    }
  }

  if (existingScript && callback) callback()
}

export default loadGTM
