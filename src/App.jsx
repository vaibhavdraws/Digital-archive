import { useState, useEffect } from "react"

import Header from "./components/layout/Header"
import Sketchbook from "./components/sketchbook/Sketchbook"
import Gallery from "./components/gallery/Gallery"

import "./styles/global.css"
import "./styles/sketchbook.css"

export default function App() {

  const [isAdmin, setIsAdmin] =
    useState(false)

  const [viewMode, setViewMode] =
    useState("sketchbook")

  const [artworks, setArtworks] =
    useState([])

  const fetchArtworks = async () => {

    try {

      const response =
        await fetch(
          "https://captain-lawc-api.onrender.com/artworks"
        )

      const data =
        await response.json()

      setArtworks(data)

    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    const token =
      localStorage.getItem("adminToken")

    if (token) {
      setIsAdmin(true)
    }

    fetchArtworks()

  }, [])

  return (

    <div className="app">

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <section className="heroDescription">

        <p>
          A personal archive of artwork, sketches, studies, and creative experiments. This digital sketchbook documents artistic growth through traditional and digital illustrations,capturing ideas, observations, and finished pieces over time.
        </p>

      </section>

      <div
        key={viewMode}
        className="viewTransition"
      >
        {
          viewMode === "sketchbook"

            ? (
              <Sketchbook
                isAdmin={isAdmin}
                artworks={artworks}
                refreshArtworks={fetchArtworks}
              />
            )

            : (
              <Gallery
                artworks={artworks}
              />
            )
        }
      </div>

    </div>

  )

}