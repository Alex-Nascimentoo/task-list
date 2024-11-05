"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { TaskUpsertSheet } from './task-upsert-sheet'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

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

        const bg = cost >= 100000 ? 'bg-slate-500 text-white' : ''

        return (
        <div className={`float-right`}>
          <p
            className={`max-w-fit font-medium text-right px-2 py-1 rounded-md ${bg}`}
          >
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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => openEditSheet(task)}
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

  function openEditSheet(task: Task) {
    const data = {
      ...task,
      cost: task.cost / 100,
    }

    setCurrentTask(data)
    sheetRef.current?.click()
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

  return (
    <>
      <TaskUpsertSheet defaultValue={currentTask!}>
        <Button
          size='sm'
          className='text-base font-semibold hidden'
          ref={sheetRef}
        >
          Editar tarefa
        </Button>
      </TaskUpsertSheet>

      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Tem certeza?</DialogTitle>
            <DialogDescription className='text-base'>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
