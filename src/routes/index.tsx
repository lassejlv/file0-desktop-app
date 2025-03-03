import { createFileRoute } from '@tanstack/react-router'
import { GetUser } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const user = await GetUser()
    return { user }
  },
  onError: (_error) => {
    throw Route.useNavigate()({ to: '/login' })
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <>
      <h1>Home</h1>
      <p>
        {user.id} {user.email}
      </p>
    </>
  )
}
