import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import GithubStars from '@/components/github-stars'
import { Suspense } from 'react'
import { cookies } from "next/headers"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
	const sidebarState = cookieStore.get("sidebar:state");
	const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b p-4">
          <div className="flex items-center gap-2 w-full justify-between">
            <SidebarTrigger className="-ml-1" />
            <GithubStars />
          </div>
        </header>
        <main className="w-full p-2">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
