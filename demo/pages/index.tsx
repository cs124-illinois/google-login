import { GoogleLoginProvider, useGoogleLogin } from "@cs124/react-google-login"
import { useEffect } from "react"

const GoogleLoginDemo: React.FC = () => {
  const { profile, auth, ready, isSignedIn, idToken } = useGoogleLogin()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_DEMO_SERVER || !idToken || !profile) {
      return
    }
    fetch(process.env.NEXT_PUBLIC_DEMO_SERVER, {
      headers: {
        "google-token": idToken,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        const { email } = response
        if (email !== profile?.email) {
          throw new Error("Demo server not working")
        }
        console.log("OK")
      })
  }, [idToken, profile])

  if (!ready) {
    return null
  }
  return (
    <div style={{ display: "flex" }}>
      <button style={{ display: "block" }} onClick={() => (!isSignedIn ? auth?.signIn() : auth?.signOut())}>
        {!isSignedIn ? "Login" : "Logout"}
      </button>
      {isSignedIn ? <span>{profile?.email}</span> : null}
    </div>
  )
}

export default function Home() {
  return (
    <GoogleLoginProvider clientConfig={{ client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string }}>
      <h2>Google Login Demo</h2>
      <GoogleLoginDemo />
    </GoogleLoginProvider>
  )
}
