import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { appConfigDir, BaseDirectory } from '@tauri-apps/api/path'
import { exists, mkdir } from '@tauri-apps/plugin-fs'

export const Route = createRootRoute({
  component: Root,
  loader: async () => {
    const config_dir = await appConfigDir()
    console.log('config_dir', config_dir)

    const dir_exists = await exists(config_dir)

    if (!dir_exists) {
      await mkdir(config_dir, { baseDir: BaseDirectory.AppConfig })
      console.log('created config dir')
    }
  },
})

function Root() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
