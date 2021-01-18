const loadGA = (callback) => {
  const existingScript = document.getElementById('ga')

  if (! existingScript) {
    const script = document.createElement('script')

    script.src = 'https://www.google-analytics.com/analytics.js'
    script.id = process.env.GA_ID
    document.body.appendChild(script)

    script.onload = () => {
      if (callback) callback()
    }
  }

  if (existingScript && callback) callback()
}
export default loadGA
