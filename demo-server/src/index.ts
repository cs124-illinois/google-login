import { googleLogin } from "@cs124/koa-google-login"
import cors from "@koa/cors"
import Router from "@koa/router"
import Koa, { Context } from "koa"

const router = new Router<Record<string, unknown>, { email?: string }>()

const audience = process.env.GOOGLE_CLIENT_IDS!.split(",").map((s) => s.trim())

const PORT = process.env.PORT || 8888

router.get("/", async (ctx: Context) => {
  ctx.body = { email: ctx.email }
})

new Koa()
  .use(
    cors({
      origin: (ctx) => {
        return ctx.headers.origin as string
      },
      maxAge: 86400,
    })
  )
  .use(audience ? googleLogin({ audience, required: false }) : (_, next) => next())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT)
