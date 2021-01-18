import React from "react"
import {
  Link
} from "react-router-dom"

export default function RegistrationInfo() {
  return (
    <>
      <h1>Jelentkezés az [ önkormányzat ] ingyenes koronavírus gyorstesztjére</h1>

      <p>A gyorstesztet <b>[ dátum ] és [ dátum ]</b> között van lehetősége elvégeztetni.</p>

      <p>Az [ önkormányzat ] négy helyszínen biztosít lehetőséget erre. Ezek a</p>
      <ul>
        <li><a href="https://www.google.com/maps" target="_blank">Helyszín 1</a></li>
        <li><a href="https://www.google.com/maps" target="_blank">Helyszín 2</a></li>
        <li><a href="https://www.google.com/maps" target="_blank">Helyszín 3</a></li>
        <li><a href="https://www.google.com/maps" target="_blank">Helyszín 4</a></li>
      </ul>

      <p>A tesztelési lehetőséget az önkormányzat csak a <b>[ kerületi ] lakcímmel vagy [ kerületi ] tartózkodási hellyel</b> rendelkezőknek biztosítja.</p>

      <p>A vizsgálat kb. 10 percet vesz igénybe, és nagyjából 15 perc múlva már át is veheti az eredményét és az eredményhez kapcsolódó tájékoztatót. A gyorsteszt a SARS CoV-2 vírus fehérje antigénjét keresi a mintában, melyet az orrból vesznek a mintavételt végző egészségügyi személyzet tagjai. A mintavétel kissé kellemetlen lehet, de nem fájdalmas és nem okoz sérülést.</p>

      <p>A mintavétel előtt 1,5 órával lehetőleg ne egyen, igyon, vagy dohányozzon!</p>

      <p><b><u><Link to="/tudnivalok">Kérjük, hogy jelentkezés előtt mindképpen olvassa el legfontosabb tudnivalókról szóló tájékoztatónkat!</Link></u></b></p>
    </>
  )
}
