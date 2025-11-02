// AUTO-GENERATED - DO NOT EDIT
import { Router } from 'express'
import * as R0 from './auth/login/route'
import * as R1 from './auth/register/route'
import * as R2 from './docs/route'
import * as R3 from './welcome/route'

const router = Router()
{
    const ep = '/auth/login'
    router.post(ep, R0.POST)
}
{
    const ep = '/auth/register'
    router.post(ep, R1.POST)
}
{
    const ep = '/docs'
    router.get(ep, R2.GET)
}
{
    const ep = '/welcome'
    router.get(ep, R3.GET)
}
export { router }
