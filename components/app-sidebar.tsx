import { Suspense } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarItem } from './sidebar-item'
import { tools } from '@/app/data'
import { Logo } from './logo'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data: {
    title: string
    items: {
      title: string
      param: string
      beta: boolean
    }[]
  }[] = []

  for (const tool in tools) {
    const info = tools[tool as keyof typeof tools]
    const titleExists = data.find((item) => item.title === info.ui.title)
    if (!titleExists) {
      data.push({
        title: info.ui.title,
        items: [
          {
            title: info.name.charAt(0).toUpperCase() + info.name.slice(1),
            param: info.name,
            beta: info.ui.beta,
          },
        ],
      })
    } else {
      titleExists.items.push({
        title: info.name.charAt(0).toUpperCase() + info.name.slice(1),
        param: info.name,
        beta: info.ui.beta,
      })
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center gap-4 p-4">
        <Logo className="w-8 h-8 text-primary" />
        <h1 className="text-md font-bold"> Agent Tools</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup key="introduction">
          <SidebarGroupLabel>Introduction</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense fallback={<div>Loading...</div>}>
                <SidebarItem
                  item={{ title: 'Introduction', param: 'introduction' }}
                />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {item.items.map((subItem) => (
                <SidebarMenu key={subItem.param}>
                  <SidebarItem item={subItem} />
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
