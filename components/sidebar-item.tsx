'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

export function SidebarItem({
  item,
}: {
  item: { title: string; param: string }
}) {
  const router = useRouter()
  const params = useSearchParams()

  const handleClick = () => {
    router.push(`/?item=${item.param}`)
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        onClick={handleClick}
        isActive={
          params.get('item') === item.param ||
          (!params.get('item') && item.param === 'introduction')
        }
      >
        {item.title}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
