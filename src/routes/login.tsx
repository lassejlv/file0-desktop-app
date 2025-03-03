import { GetUser, Login } from '@/lib/api'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  loader: async () => {
    const user = await GetUser()
    console.log('user', user)
    if (user) throw new Error('User is already logged in')
  },
  onError: (_error) => {
    throw Route.useNavigate()({ to: '/' })
  },
})

function RouteComponent() {
  const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    try {
      const message = await Login(email, password)
      console.log(message)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <form onSubmit={loginSubmit} className='flex flex-col space-y-4'>
        <Input type='email' name='email' placeholder='Email' />
        <Input type='password' name='password' placeholder='Password' />
        <Button type='submit'>Login</Button>
      </form>
    </>
  )
}
