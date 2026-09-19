import { useState } from "react"

export default function Header({

  isAdmin,
  setIsAdmin,
  setViewMode

}) {

  const [menuOpen, setMenuOpen]
    = useState(false)

  const handleAdminLogin = async () => {

    const password =
      prompt("Enter admin password")

    if (!password) return

    try {

      const response =
        await fetch(
          "https://captain-lawc-api.onrender.com/admin-login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              password
            })
          }
        )

      const data =
        await response.json()

      if (data.success) {

        localStorage.setItem(
          "adminToken",
          data.token
        )

        setIsAdmin(true)

      } else {

        alert("Access denied")

      }

    } catch (error) {

      console.log(error)

      alert("Server error")

    }

  }
  return (

    <header className="header">

      <div className="logoSection">

        <img
          src="/logo/logo.jpeg"
          alt="logo"
          className="logo"
        />

        <div>

          <h1 className="brand">
            Captain L.A.W.C
          </h1>

          <p className="subtitle">
            Digital Artwork Archive
          </p>

          <a
            href="https://www.youtube.com/@captainL.A.W.C"
            target="_blank"
            rel="noopener noreferrer"
            className="youtubeLink"
          >

            <img
              src="/youtube.png"
              alt="YouTube"
              className="youtubeIcon"
            />

            @captainL.A.W.C

          </a>

        </div>

      </div>

      <div className="headerCenter">

        <h2>
          Welcome to The Digital Sketchbook
        </h2>

      </div>

      <div className="headerRight">

        <div className="hamburgerWrapper">

          <button
            className="hamburgerButton"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            ☰
          </button>

          {

            menuOpen && (

              <div className="dropdownMenu">

                <button
                  onClick={() => {
                    setViewMode("sketchbook")
                    setMenuOpen(false)
                  }}
                >
                  Sketchbook
                </button>

                <button
                  onClick={() => {
                    setViewMode("gallery")
                    setMenuOpen(false)
                  }}
                >
                  Gallery
                </button>

              </div>

            )

          }

        </div>

        <button
          className="adminButton"
          onClick={handleAdminLogin}
        >

          {

            isAdmin
              ? "Admin Active"
              : "Admin Access"

          }

        </button>

        <img
          src="/profile/profile.jpeg"
          alt="profile"
          className="profileImage"
        />

      </div>

    </header>

  )

}