export default function Header({

  isAdmin,

  setIsAdmin

}) {

  const handleAdminLogin = () => {

    const password =
      prompt("Enter admin password")

    if (password === "gillu123") {

      setIsAdmin(true)

    } else {

      alert("Access denied")

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
            The Grey Diary
          </h1>

          <p className="subtitle">
            Digital Artwork Archive
          </p>

          <a
            href="https://www.youtube.com/@Greydiaryofgreyman"
            target="_blank"
            rel="noopener noreferrer"
            className="youtubeLink"
          >

            <img
              src="/youtube.png"
              alt="YouTube"
              className="youtubeIcon"
            />

            @Greydiaryofgreyman

          </a>

        </div>

      </div>

      <div className="headerCenter">

        <h2>
          Welcome to The Grey Diary
        </h2>

      </div>

      <div className="headerRight">

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