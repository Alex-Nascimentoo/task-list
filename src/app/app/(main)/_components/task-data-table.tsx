"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Task } from '../types'
import { deleteTask } from '../actions'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TaskUpsertForm from './task-upsert-form'
import { createSwapy } from 'swapy'
import TaskCard from './task-card'

type TaskDataTableProps = {
  data: Task[]
}

export function TaskDataTable({ data }: TaskDataTableProps) {
  const router = useRouter()
  const sheetRef = React.useRef<HTMLButtonElement>(null)

  const [slotItems, setSlotItems] = React.useState({})

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null)
 
  const [filterTitle, setFilterTitle] = React.useState("")

  function openEditDialog(task: Task) {
    setCurrentTask(task)
    sheetRef.current?.click()
  }

  async function openDeleteDialog(task: Task) {
    setCurrentTask(task)
    setIsDialogOpen(true)
  }

  async function handleDeleteTask(task: Task) {
    await deleteTask({ id: task.id })

    setIsDialogOpen(false)
    router.refresh()

    toast({
      title: "Sucesso!",
      description: "Tarefa deletada com sucesso.",
    })
  }

  React.useEffect(() => {
    const container = document.querySelector('#dragable')
    const swapy = createSwapy(container)
    let localItems = {}

    if (!localStorage.getItem('slotItem')) {
      data.map((item, index) => {
        localItems = {
          ...localItems,
          [`${index}`]: item.id,
        }
      })

      localStorage.setItem('slotItem', JSON.stringify(localItems))
      setSlotItems(localItems)
    }
    
    swapy.onSwap(({ data }) => {
      console.log('swap', data);
      localStorage.setItem('slotItem', JSON.stringify(data.object))
    })

    swapy.onSwapEnd(({ data, hasChanged }) => {
      console.log(hasChanged);
      console.log('end', data);
    })

    swapy.onSwapStart(() => {
      console.log('start')
    })

    return () => {
      swapy.destroy()
    }
  }, [data, slotItems])

  React.useEffect(() => {
    setSlotItems(JSON.parse(localStorage.getItem('slotItem')!))
  }, [])

  return (
    <>
      <TaskUpsertForm defaultValue={currentTask || undefined}>
        <Button
          size='sm'
          className='text-base font-semibold hidden'
          ref={sheetRef}
        >
          Editar tarefa
        </Button>
      </TaskUpsertForm>

      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader
            className='overflow-hidden'
          >
            <DialogTitle className='text-2xl'>Tem certeza?</DialogTitle>
            <DialogDescription
              className='
              text-base
              overflow-hidden whitespace-pre-wrap text-ellipsis max-w-full
              '
            >
              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua tarefa:
              <br />
              <strong>{ currentTask?.title }</strong>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter
            className='flex justify-between mt-10'
          >
            <Button
              className='w-full'
              type="button"
              onClick={() => setIsDialogOpen(false)}
            >Cancelar</Button>

            <Button
              className='w-full bg-red-500'
              type="button"
              onClick={() => handleDeleteTask(currentTask!)}
            >Deletar</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar títulos..."
            value={filterTitle}
            onChange={(event) => setFilterTitle(event.target.value)}
            className="max-w-sm"
          />

        </div>
            <div
              className='
              grid grid-cols-table gap-4
              ring-1 ring-gray-200 rounded-md
              mb-4 px-4 py-2
              text-gray-500
              '
            >
              <div></div>

              <p className='col-span-4'>ID</p>

              <p className='col-span-9'>Título</p>

              <p className='col-span-2'>Data limite</p>

              <p className='text-right col-span-2'>Custo</p>

              <p className='justify-self-center col-span-2'>Ações</p>
            </div>
        <div className="rounded-md border">
          
          <section>
          <div
            id='dragable'
            className='flex flex-col gap-4'
          >
            {
              data.length ? ( data.filter((item) => item.title.toLowerCase().includes(filterTitle.toLowerCase()))
                .map((item, index) => (
                  <div
                    key={item.id}
                    data-swapy-slot={index}
                  >
                    {
                      data.filter(item => item.id === slotItems[index]).map(task => (
                        <TaskCard
                          key={task.id}
                          data={task}
                          handleDelete={openDeleteDialog}
                          handleEdit={openEditDialog}
                        />
                      ))
                    }
                  </div>
                ))
              ) : (
                  <div className='flex justify-center items-center h-24'>
                    <p>Sem resultados.</p>
                  </div>
                )
              }
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
