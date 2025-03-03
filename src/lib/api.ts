import { appConfigDir } from '@tauri-apps/api/path'
import { readTextFile, remove, writeTextFile } from '@tauri-apps/plugin-fs'
import { fetch } from '@tauri-apps/plugin-http'

const API_URL = 'https://file0.io'

interface User {
  id: string
  email: string
  defaultRegion: string
  paidStatus: boolean
  planName: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  createdAt: string
  updatedAt: string
}

export const Login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (response.status !== 200) {
    throw new Error(`Failed to login: ${response.status}`)
  }

  const resp = (await response.json()) as { message: string; data: { token: string } }

  const config_dir = await appConfigDir()
  await writeTextFile(`${config_dir}/token.txt`, resp.data.token)

  return resp
}

export const GetUser = async (): Promise<User> => {
  const config_dir = await appConfigDir()
  const token = await readTextFile(`${config_dir}/api/token.txt`)
  if (!token) throw new Error('No token found')

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Cookie: `session=${token}`,
    },
  })

  if (response.status !== 200) {
    throw new Error(`Failed to get user: ${response.status}`)
  }

  const data = (await response.json()) as User

  return data
}

export const Logout = async () => {
  const config_dir = await appConfigDir()
  await remove(`${config_dir}/token.txt`)
  return true
}
