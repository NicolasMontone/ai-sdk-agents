'use client'

import { useSearchParams } from 'next/navigation'

import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'

export function SidebarItem({
  item,
}: {
  item: { title: string; param: string }
}) {
  const params = useSearchParams()

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={
          params.get('item') === item.param ||
          (!params.get('item') && item.param === 'introduction')
        }
      >
        <form action="">
          <input type="hidden" name="item" value={item.param} />
          <button
            type="submit"
            className="cursor-pointer w-full text-left h-full"
          >
            {item.title}
          </button>
        </form>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
