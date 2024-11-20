"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, GripHorizontalIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { formatMoney } from '@/lib/utils'
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
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import TaskUpsertForm from './task-upsert-form'
import { createSwapy } from 'swapy'

type TaskDataTableProps = {
  data: Task[]
}

export function TaskDataTable({ data }: TaskDataTableProps) {
  const router = useRouter()
  const sheetRef = React.useRef<HTMLButtonElement>(null)
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Task>[] = [
    {
      // accessorKey: "id",
      id: 'id',
      accessorKey: "id",
      header: () => <div className="w-fit">ID</div>,
      cell: ({ row }) => <div className="w-fit">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='pl-0'
          >
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "dueDate",
      header: () => <div className="">Data limite</div>,
      cell: ({ row }) => {
        const date: Date = row.getValue("dueDate")
        const result = date.toLocaleDateString("pt-BR")
  
        return <div className={`font-medium`}>{result}</div>
      },
    },
    {
      accessorKey: "cost",
      header: () => <div className="text-right">Custo</div>,
      cell: ({ row }) => {
        const cost: number = row.getValue("cost")

        const bg = cost >= 1000 ? 'bg-slate-500 text-white' : ''

        return (
        <div className={`float-right`}>
          <p
            className={`max-w-fit font-medium text-right px-2 py-1 rounded-md ${bg}`}
          >
            {/* { cost } */}
            {/* { cost.toLocaleString('pt-BR') } */}
            { formatMoney(cost, 'clear') }
          </p>
        </div>
      )},
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir  menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  console.log('open edit with: ', task)
                  setCurrentTask({ ...task, cost: task.cost })
                  sheetRef.current?.click()
                }}
              >
                <Pencil1Icon className="w-4 h-4 mr-2" />
                Editar tarefa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(task)}
                className='text-red-500'
              >
                <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                Deletar tarefa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

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
    swapy.enable(true)
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
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
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
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <div key={index} data-swapy-slot={index} className='min-h-4'>
                    <div
                      data-swapy-item={row.id}
                      className='grid grid-cols-table gap-4 ring-1 ring-gray-200 rounded-md p-4 items-center'
                    >
                      <div
                        data-swapy-handle
                        className='flex justify-center'
                      >
                        <GripHorizontalIcon className='w-4 h-4' />
                      </div>

                      <p className='col-span-4'>{ data[parseInt(row.id)].id }</p>

                      <p
                        className='col-span-9 text-ellipsis overflow-hidden whitespace-nowrap'
                      >{ data[parseInt(row.id)].title }</p>

                      <p className='col-span-2'>{ data[parseInt(row.id)].dueDate.toLocaleDateString() }</p>

                      <p
                        className={`
                          col-span-2 text-right rounded-md px-2 py-1
                          ${parseFloat(data[parseInt(row.id)].cost) >= 1000 ? 'text-black bg-slate-200' : ''}  
                        `}
                      >{ formatMoney(parseFloat(data[parseInt(row.id)].cost)) }</p>

                      <div className="flex justify-center col-span-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir  menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentTask({ ...data[parseInt(row.id)] })
                                sheetRef.current?.click()
                              }}
                            >
                              <Pencil1Icon className="w-4 h-4 mr-2" />
                              Editar tarefa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(data[parseInt(row.id)])}
                              className='text-red-500'
                            >
                              <TrashIcon className="w-4 h-4 mr-2 text-red-500" />
                              Deletar tarefa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))) : (
                  <div className='flex justify-center items-center h-24'>
                    <p>Sem resultados.</p>
                  </div>
                )
              }
            </div>
          </section>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
