import { GoogleLoginProvider, useGoogleLogin } from "@cs124/react-google-login"
import { useEffect, useState } from "react"
import stringHash from "string-hash"

type TokenCheck = {
  token: string
  timestamp: Date
  ok: boolean
}

const GoogleLoginDemo: React.FC = () => {
  const { profile, auth, ready, isSignedIn, idToken } = useGoogleLogin()
  const [checks, setChecks] = useState<TokenCheck[]>([])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_DEMO_SERVER || !idToken || !profile) {
      return
    }
    const checkTimer = setInterval(() => {
      fetch(process.env.NEXT_PUBLIC_DEMO_SERVER!!, {
        headers: {
          "google-token": idToken,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const { email } = response
          setChecks((previousChecks) => {
            return [{ token: idToken, timestamp: new Date(), ok: email === profile?.email }, ...previousChecks].slice(
              0,
              1024
            )
          })
        })
    }, 1024)
    return () => {
      clearInterval(checkTimer)
    }
  }, [idToken, profile])

  if (!ready) {
    return null
  }
  return (
    <>
      <div style={{ display: "flex" }}>
        <button style={{ display: "block" }} onClick={() => (!isSignedIn ? auth?.signIn() : auth?.signOut())}>
          {!isSignedIn ? "Login" : "Logout"}
        </button>
        {isSignedIn ? <span>{profile?.email}</span> : null}
      </div>
      {checks.map(({ timestamp, ok, token }, key) => (
        <div key={key}>
          {timestamp.toISOString()} {ok ? "Working" : "Broken"} {stringHash(token)}
        </div>
      ))}
    </>
  )
}

export default function Home() {
  return (
    <GoogleLoginProvider refreshRate={10240} clientConfig={{ client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!! }}>
      <h2>Google Login Demo</h2>
      <GoogleLoginDemo />
    </GoogleLoginProvider>
  )
}
