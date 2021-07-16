import { OAuth2Client, VerifyIdTokenOptions } from "google-auth-library"
import { Context, Middleware, Next } from "koa"

type GoogleLoginOptions = Omit<VerifyIdTokenOptions, "idToken"> & {
  required: boolean
  headerKey?: string
}
export const googleLogin = (options: GoogleLoginOptions): Middleware => {
  const { required } = options
  const headerKey = options.headerKey || "google-token"
  if (!options.audience || !options.audience[0]) {
    throw Error("Empty audience array")
  }
  const googleClient = new OAuth2Client(options.audience[0])
  return async (ctx: Context, next: Next) => {
    try {
      const googlePayload = await googleClient
        .verifyIdToken({
          idToken: ctx.headers[headerKey] as string,
          ...options,
        })
        .then((result) => result.getPayload())
      ctx.email = googlePayload?.email?.toLowerCase()
      required && ctx.assert(ctx.email, 401)
      ctx.googlePayload = googlePayload
    } catch (err) {
      required && ctx.throw(401)
    }
    await next()
  }
}
