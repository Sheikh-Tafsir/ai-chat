import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/api/pdf']
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
