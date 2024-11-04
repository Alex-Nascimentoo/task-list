'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Task } from './task-data-table'
import { useRef } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from '@/hooks/use-toast'

type TaskUpsertSheetProps = {
  children?: React.ReactNode
  deafultValue?: Task
}

const FormSchema = z.object({
  dueDate: z.date({
    required_error: "Uma data de vencimento é obrigatória.",
  }),
  title: z.string({
    required_error: "Um título é obrigatório.",
  }),
  cost: z.string({
    required_error: "Um custo é obrigatório.",
  }),
})

export function TaskUpsertSheet(props: TaskUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)

    toast({
      title: 'Tarefa criada',
      description: 'A tarefa foi criada com sucesso.',
    })
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div ref={ref}>{props.children}</div>
      </SheetTrigger>
        <SheetContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8 h-full flex flex-col">
            <SheetHeader>
              <SheetTitle>Criar Tarefa</SheetTitle>
              <SheetDescription>
                Preencha os campos abaixo para criar uma nova tarefa. Clique em salvar quando terminar.
              </SheetDescription>
            </SheetHeader>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                <Input placeholder="Tarefa 03..." {...field} />
                </FormControl>
                <FormDescription>
                O título é como você identificará a tarefa.
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Custo</FormLabel>
                <FormControl>
                <Input placeholder="Custo financeiro da tarefa..." {...field} />
                </FormControl>
                <FormDescription>
                O quanto a tarefa custa financeiramente.
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data limite</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    A data de vencimento é quando a tarefa deve ser concluída.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className='w-full inline-block !mt-auto'>
              <Button
                type="submit"
                className='w-full text-lg font-semibold'
              >Salvar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
