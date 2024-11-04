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
import { Task } from '../types'
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
import { upsertTaskSchema } from '../schema'
import { upsertTask } from '../actions'
import { useRouter } from 'next/navigation'

type TaskUpsertSheetProps = {
  children?: React.ReactNode
  deafultValue?: Task
}

export function TaskUpsertSheet(props: TaskUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof upsertTaskSchema>>({
    resolver: zodResolver(upsertTaskSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      // Transform cost to cents
      const rawCost = data.cost.toString()
      const clearCost = parseInt(rawCost.replace(/\D/g, ''))
      const finalCost = rawCost.includes('.') ? clearCost : clearCost * 100
  
      const dto = {
        ...data,
        cost: finalCost,
      }
  
      console.log(`dto is: ${typeof(dto.cost)}`)
  
      await upsertTask(dto)
  
      router.refresh()
  
      ref.current?.click()
  
      toast({
        title: 'Tarefa criada',
        description: 'A tarefa foi criada com sucesso.',
      })
    } catch (err) {
      toast({
        title: 'Erro ao criar tarefa',
        description: 'Ocorreu um erro ao criar a tarefa, tente novamente.',
      })

      if (process.env.APP_ENV === 'dev') {
        console.error(err)
      }
    }

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
                <Input
                  placeholder="Tarefa 03..."
                  {...field}
                  autoComplete='off'
                />
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
                <Input
                  type="number"
                  placeholder="Custo financeiro da tarefa... (Ex: 100.00)"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                </FormControl>
                <FormDescription>
                O quanto a tarefa custa financeiramente. (Ex: 100.00)
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
