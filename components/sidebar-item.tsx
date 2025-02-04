'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { track } from '@vercel/analytics'

export function SidebarItem({
  item,
}: {
  item: { title: string; param: string; beta?: boolean }
}) {
  const router = useRouter()
  const params = useSearchParams()

  const handleClick = () => {
    router.push(`/?item=${item.param}`)
    track('sidebar_item_clicked', {
      item: item.param,
    })
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
        <span className="flex items-center gap-2">
          {item.title}
          {item.beta && (
            <Badge variant="default" className="text-[10px] h-4">
              Beta
            </Badge>
          )}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
