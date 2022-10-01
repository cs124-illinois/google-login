import PropTypes from "prop-types"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

export interface GoogleLoginContext extends GoogleAuthContext, GoogleUserContext, GoogleTokensContext {
  available: boolean
  loggingIn: boolean
  profile: GoogleProfile | undefined
  setLoggingIn: (loggingIn: boolean) => void
}
const GoogleLoginContext = createContext<GoogleLoginContext>({
  available: false,
  auth: null,
  user: null,
  profile: undefined,
  ready: false,
  err: undefined,
  isSignedIn: false,
  loggingIn: false,
  idToken: undefined,
  accessToken: undefined,
  setLoggingIn: () => {
    throw Error("GoogleLoginContext not defined")
  },
})

export interface GoogleProfile {
  id: string
  name: string
  givenName: string
  familyName: string
  imageUrl: string
  email: string
}

export interface GoogleAuth {
  then: (onInit: (auth: GoogleAuth) => void, onError: (error: Error) => void) => void
  isSignedIn: {
    get: () => boolean
    listen: (callback: (isSignedIn: boolean) => void) => void
  }
  signIn: (options?: {
    prompt: string
    scope: string
    ux_mode: string
    redirect_uri: string
  }) => Promise<GoogleUser | void>
  signOut: () => Promise<void>
  disconnect: () => void
  grantOfflineAccess: (options: OfflineAccessOptions) => Promise<{ code: string }>
  currentUser: {
    get: () => GoogleUser
    listen: (callback: (user: GoogleUser) => void) => void
  }
}
export interface GoogleUser {
  getId: () => string
  isSignedIn: () => boolean
  getHostedDomain: () => string
  getGrantedScopes: () => string
  getBasicProfile: () => {
    getId: () => string
    getName: () => string
    getGivenName: () => string
    getFamilyName: () => string
    getImageUrl: () => string
    getEmail: () => string
  }
  getAuthResponse: (includeAuthorizationData?: boolean) => AuthResponse
  reloadAuthResponse: () => Promise<AuthResponse>
  hasGrantedScopes: (scopes: string) => boolean
  grantOfflineAccess: (options: OfflineAccessOptions) => void
  disconnect: () => void
}
export interface AuthResponse {
  access_token: string
  id_token: string
  scope: string
  expires_in: number
  first_issued_at: number
  expires_at: number
}
export interface OfflineAccessOptions {
  prompt: string
  scope: string
}

export interface GoogleLoginProviderProps {
  clientConfig: ClientConfig
  libraryURI?: string
  children: React.ReactNode
  localStorageKey?: string
  refreshRate?: number
}
export interface ClientConfig {
  client_id: string
  cookie_policy?: string | null
  scope?: string | null
  fetch_basic_profile?: boolean | null
  hosted_domain?: string | null
  openid_realm?: string | null
  ux_mode?: string | null
  redirect_uri?: string | null
}

export interface GoogleAuthContext {
  auth: GoogleAuth | null
  ready: boolean
  err: Error | undefined
}
export interface GoogleUserContext {
  user: GoogleUser | null
  isSignedIn: boolean | undefined
}
export interface GoogleTokensContext {
  idToken: string | undefined
  accessToken: string | undefined
}

const getProfile = (user: GoogleUser): GoogleProfile | undefined => {
  const profile = user.getBasicProfile()
  if (!profile) {
    return
  }
  return {
    id: profile.getId(),
    name: profile.getName(),
    givenName: profile.getGivenName(),
    familyName: profile.getFamilyName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
  }
}

const NO_TOKENS = { idToken: undefined, accessToken: undefined }
export const GoogleLoginProvider: React.FC<GoogleLoginProviderProps> = ({
  clientConfig,
  libraryURI,
  children,
  refreshRate = 30 * 60 * 1000,
}) => {
  const lastRefresh = useRef<number>(0)

  const [auth, setAuth] = useState<GoogleAuthContext>({ auth: null, ready: false, err: undefined })
  const [user, setUser] = useState<GoogleUserContext>({
    user: null,
    isSignedIn: undefined,
  })
  const initialTokens = useMemo(() => {
    if (typeof window === "undefined") {
      return NO_TOKENS
    }
    const savedTokens = localStorage.getItem("react-google-login:tokens")
    if (!savedTokens) {
      return NO_TOKENS
    }
    const { idToken, accessToken, saved } = JSON.parse(savedTokens)
    if (!saved || saved + 30 * 60 * 1000 < Date.now()) {
      return NO_TOKENS
    }
    lastRefresh.current = saved
    return { idToken, accessToken }
  }, [])
  const [tokens, setTokens] = useState<GoogleTokensContext>(initialTokens)
  const [loggingIn, setLoggingIn] = useState(false)
  const [profile, setProfile] = useState<GoogleProfile | undefined>()

  const initialize = useCallback(() => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init(clientConfig).then(
        (newAuth) => {
          setAuth({ auth: newAuth, ready: true, err: undefined })
          const initialUser = newAuth.currentUser.get()
          setUser({ user: initialUser, isSignedIn: initialUser.isSignedIn() })
          initialUser && setProfile(getProfile(initialUser))
          newAuth.currentUser.listen((newUser) => {
            setUser({ user: newUser, isSignedIn: newUser.isSignedIn() })
            if (!newUser.isSignedIn()) {
              setTokens(NO_TOKENS)
              setProfile(undefined)
            } else {
              setProfile(getProfile(newUser))
            }
          })
        },
        (err) => {
          setAuth({ auth: null, ready: false, err })
          throw err
        }
      )
    })
  }, [clientConfig])

  useEffect(() => {
    // Allow users to load the Google API separately if they want. Can help with preloading.
    if (window.gapi) {
      initialize()
      return
    }
    const existingScript = document.head.querySelector(`script[src="${libraryURI}"]`) as HTMLScriptElement
    if (existingScript) {
      existingScript.onload = initialize
      return
    }
    const insertedScript = true
    const script = Object.assign(document.createElement("script"), {
      src: libraryURI,
      async: true,
      defer: true,
    })
    script.onload = initialize
    document.head.appendChild(script)
    return (): void => {
      if (insertedScript) {
        document.head.removeChild(script)
      }
    }
  }, [libraryURI, initialize])

  useEffect(() => {
    if (!tokens.idToken) {
      localStorage.removeItem("react-google-login:tokens")
      return
    }
    localStorage.setItem("react-google-login:tokens", JSON.stringify({ ...tokens, saved: Date.now() }))
  }, [tokens])

  useEffect(() => {
    if (!user?.isSignedIn) {
      return
    }
    const refreshTokens = async () => {
      if (!user.user) {
        setTokens(NO_TOKENS)
        return
      }
      const { id_token: idToken, access_token: accessToken } = await user.user.reloadAuthResponse()
      setTokens({ idToken, accessToken })
      lastRefresh.current = Date.now()
    }
    const refreshTimer = setInterval(async () => {
      await refreshTokens()
    }, refreshRate)
    refreshTokens()
    return () => {
      clearInterval(refreshTimer)
    }
  }, [user.user, user.isSignedIn, refreshRate])

  return (
    <GoogleLoginContext.Provider
      value={{ available: true, ...auth, ...user, ...tokens, loggingIn, setLoggingIn, profile }}
    >
      {children}
    </GoogleLoginContext.Provider>
  )
}

GoogleLoginProvider.propTypes = {
  clientConfig: PropTypes.exact({
    client_id: PropTypes.string.isRequired,
    cookie_policy: PropTypes.string,
    scope: PropTypes.string,
    fetch_basic_profile: PropTypes.bool,
    hosted_domain: PropTypes.string,
    openid_realm: PropTypes.string,
    ux_mode: PropTypes.string,
    redirect_uri: PropTypes.string,
  }).isRequired,
  libraryURI: PropTypes.string,
  children: PropTypes.node.isRequired,
  refreshRate: PropTypes.number,
}
GoogleLoginProvider.defaultProps = {
  libraryURI: "https://apis.google.com/js/platform.js",
}

declare global {
  interface Window {
    gapi: {
      load: (library: string, callback: () => void) => void
      auth2: {
        init: (params: ClientConfig) => GoogleAuth
        getAuthInstance: () => GoogleAuth
      }
    }
  }
}

export const useGoogleLogin = (): GoogleLoginContext => {
  return useContext(GoogleLoginContext)
}
interface WithGoogleLoginProps {
  children: (googleLogin: GoogleLoginContext) => JSX.Element | null
}
export const WithGoogleLogin: React.FC<WithGoogleLoginProps> = ({ children }) => {
  return children(useGoogleLogin())
}
WithGoogleLogin.propTypes = {
  children: PropTypes.func.isRequired,
}

export const useGoogleUser = (): GoogleUserContext => {
  const { user, isSignedIn } = useContext(GoogleLoginContext)
  return { user, isSignedIn }
}
interface WithGoogleUserProps {
  children: (googleUser: GoogleUserContext) => JSX.Element | null
}
export const WithGoogleUser: React.FC<WithGoogleUserProps> = ({ children }) => {
  return children(useGoogleUser())
}
WithGoogleUser.propTypes = {
  children: PropTypes.func.isRequired,
}

export interface GoogleAuthTokens {
  id_token: string
  access_token: string
}

export const useGoogleTokens = (): GoogleTokensContext => {
  const { idToken, accessToken } = useContext(GoogleLoginContext)
  return { idToken, accessToken }
}
interface WithGoogleTokensProps {
  children: (googleTokens: GoogleTokensContext) => JSX.Element | null
}
export const WithGoogleTokens: React.FC<WithGoogleTokensProps> = ({ children }) => {
  return children(useGoogleTokens())
}
WithGoogleTokens.propTypes = {
  children: PropTypes.func.isRequired,
}

export const useGoogleEmail = (): string | undefined => {
  const { user, isSignedIn } = useContext(GoogleLoginContext)
  if (!user || !isSignedIn) {
    return undefined
  }
  return user?.getBasicProfile().getEmail()
}
interface WithGoogleEmailProps {
  children: (googleEmail: string | undefined) => JSX.Element | null
}
export const WithGoogleEmail: React.FC<WithGoogleEmailProps> = ({ children }) => {
  return children(useGoogleEmail())
}
WithGoogleEmail.propTypes = {
  children: PropTypes.func.isRequired,
}
