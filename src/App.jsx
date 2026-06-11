import { useState } from "react"

import Header from "./components/layout/Header"
import Sketchbook from "./components/sketchbook/Sketchbook"

import "./styles/global.css"
import "./styles/sketchbook.css"

export default function App() {

  const [isAdmin, setIsAdmin]
    = useState(false)

  return (

    <div className="app">

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <section className="heroDescription">


        <p>

          A personal archive of artwork,
          sketches, studies, and creative
          experiments. This digital sketchbook
          documents artistic growth through
          traditional and digital illustrations,
          capturing ideas, observations, and
          finished pieces over time.

        </p>

      </section>

      <Sketchbook
        isAdmin={isAdmin}
      />

    </div>

  )

}