import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { TaskDataTable } from './_components/task-data-table'
import { Button } from '@/components/ui/button'
import { TaskUpsertSheet } from './_components/task-upsert-sheet'
import { PlusIcon } from '@radix-ui/react-icons'

export default async function Page() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Tarefas</DashboardPageHeaderTitle>

        <DashboardPageHeaderNav>
          <TaskUpsertSheet>
            <Button
              size='sm'
              className='text-base font-semibold'
            >
              <PlusIcon className='w-5 h-5 mr-2' />
              Adicionar tarefa
            </Button>
          </TaskUpsertSheet>
        </DashboardPageHeaderNav>
      </DashboardPageHeader>

      <DashboardPageMain>
        <h1
          className="
            text-2xl font-bold
            mb-6
          "
        >
          Seja bem-vindo!
        </h1>

        <TaskDataTable />
      </DashboardPageMain>
    </DashboardPage>
  )
}
