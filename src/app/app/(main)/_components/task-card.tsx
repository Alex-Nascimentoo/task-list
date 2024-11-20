import React from 'react'
import { Task } from '../types'
import { formatMoney } from '@/lib/utils'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { GripHorizontalIcon, MoreHorizontal, TrashIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

type TaskCardProps = {
  data: Task
  handleDelete: (task: Task) => void
  handleEdit: (task: Task) => void
}

export default function TaskCard(props: TaskCardProps) {
  return (
    <div
      data-swapy-item={props.data.id}
      className='grid grid-cols-table gap-4 ring-1 ring-gray-200 rounded-md p-4 items-center'
    >
      <div
        data-swapy-handle
        className='flex justify-center'
      >
        <GripHorizontalIcon className='w-4 h-4' />
      </div>

      <p className='col-span-4'>{ props.data.id }</p>

      <p
        className='col-span-9 text-ellipsis overflow-hidden whitespace-nowrap'
      >{ props.data.title }</p>

      <p className='col-span-2'>{ props.data.dueDate.toLocaleDateString() }</p>

      <p
        className={`
          col-span-2 text-right rounded-md px-2 py-1
          overflow-hidden whitespace-nowrap text-ellipsis
          ${parseFloat(props.data.cost) >= 1000 ? 'text-black bg-slate-200' : ''}  
        `}
      >{ formatMoney(parseFloat(props.data.cost)) }</p>

      <div className="flex justify-center col-span-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir  menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='
          bg-white relative z-10
          ring-1 ring-gray-200 rounded-md shadow-lg
          p-2
          ' align="end">
            <DropdownMenuLabel className='font-semibold'>Ações</DropdownMenuLabel>
            
            <DropdownMenuItem
              onClick={() => props.handleEdit(props.data)}
              className='flex items-center gap-2 my-2 hover:cursor-pointer hover:outline-none hover:bg-gray-200 p-2 rounded-lg'
            >
              <Pencil1Icon className="w-4 h-4 mr-2" />
              Editar tarefa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => props.handleDelete(props.data)}
              className='text-red-500 flex items-center gap-2 hover:cursor-pointer hover:outline-none hover:bg-gray-200 p-2 rounded-lg'
            >
              <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
              Deletar tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
