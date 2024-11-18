'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Task } from '../types'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { CurrencyInput } from 'react-currency-mask'
import { upsertTask } from '../actions'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

type TaskUpsertFormProps = {
  children: React.ReactNode
  defaultValue?: Task
}

export default function TaskUpsertForm(props: TaskUpsertFormProps) {
  const router = useRouter()

  const ref = useRef<HTMLDivElement>(null)

  const [dueDate, setDueDate] = useState(props.defaultValue?.dueDate || undefined)
  const [cost, setCost] = useState(props.defaultValue?.cost.toString() || '')

  const form = useForm<Task>()

  async function onSubmit(data: Task) {
    if (!data.title) {
      toast({
        title: 'Erro',
        description: 'O título é obrigatório.',
      })
      return
    }

    if (!cost) {
      toast({
      title: 'Erro',
      description: 'O custo é obrigatório.',
      })
      return
    }

    if (parseFloat(cost) < 0) {
      toast({
      title: 'Erro',
      description: 'O custo não pode ser um valor negativo.',
      })
      return
    }

    if (!dueDate) {
      toast({
        title: 'Erro',
        description: 'A data limite é obrigatória.',
      })
      return
    }

    
    try {
      const dto = {
        ...data,
        cost: parseFloat(cost).toString(),
        dueDate: dueDate,
        id: props.defaultValue?.id || '',
      }

      console.log('dto is: ', dto)

      console.log('will try to upsert now')
      await upsertTask(dto)

      console.log('finished upsert')
      form.reset()
      setCost('')
      setDueDate(undefined)

      router.refresh()

      ref.current?.click()
    
      toast({
        title: 'Tarefa salva',
        description: 'A tarefa foi salva com sucesso.',
      })
    } catch(err) {
      toast({
        title: 'Erro ao salvar tarefa',
        description: 'Ocorreu um erro ao salvar a tarefa, tente novamente.',
      })

      if (process.env.APP_ENV === 'dev') {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    form.reset(props.defaultValue)
    setCost(props.defaultValue?.cost.toString() || '')
    setDueDate(props.defaultValue?.dueDate)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValue])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          ref={ref}
          onClick={() => {
            form.reset()
            setCost('')
            setDueDate(undefined)
          }}
        >
          {props.children}
        </div>
      </SheetTrigger>
      <SheetContent>
        <Form { ...form }>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='h-full flex flex-col space-y-8'
          >
            <SheetHeader>
              <SheetTitle>
                { props.defaultValue ? 'Editar Tarefa' : 'Criar Tarefa' }
              </SheetTitle>
              <SheetDescription>
                Preencha os campos abaixo para editar sua tarefa. Clique em salvar quando terminar.
              </SheetDescription>
            </SheetHeader>

            <FormItem className=''>
              <FormLabel>Título</FormLabel>
              <Input
                placeholder="title"
                {...form.register('title')}
                defaultValue={props.defaultValue?.title}
                autoFocus
                required
              />
              <FormDescription>
                O título é como você identificará a tarefa.
              </FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem className=''>
              <FormLabel>Custo</FormLabel>
              <CurrencyInput
                defaultValue={props.defaultValue ? parseFloat(props.defaultValue.cost).toString() : ''}
                onChangeValue={(e: ChangeEvent<HTMLInputElement>, originalValue) =>
                  setCost(originalValue.toString())
                }
                max={9999999999999}
                {...form.register('cost')}
                InputElement={
                  <Input
                    placeholder='R$ 123,00'
                    required
                  />
                }
              />
              <FormDescription>
                O quanto a tarefa custa financeiramente. (Ex: 100.00)
              </FormDescription>
            </FormItem>

            <FormItem className="flex flex-col">
              <FormLabel>Data limite</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      {dueDate ? (
                        format(dueDate, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className='bg-white ring-1 ring-neutral-300 rounded-lg shadow-lg'
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                A data de vencimento é quando a tarefa deve ser concluída.
              </FormDescription>
              <FormMessage />
            </FormItem>

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
