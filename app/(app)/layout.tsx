import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import GithubStars from '@/components/github-stars'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b p-4">
          <div className="flex items-center gap-2 w-full justify-between">
            <SidebarTrigger className="-ml-1" />
            <GithubStars />
          </div>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <main className="w-full p-2">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
