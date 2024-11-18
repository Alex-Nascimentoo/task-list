import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { TaskDataTable } from './_components/task-data-table'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { getUserTasks } from './actions'
import TaskUpsertForm from './_components/task-upsert-form'

export default async function Page() {
  const tasks = await getUserTasks()

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Tarefas</DashboardPageHeaderTitle>

        <DashboardPageHeaderNav>
          <TaskUpsertForm>
            <Button
              size='sm'
              className='text-base font-semibold'
            >
              <PlusIcon className='w-5 h-5 mr-2' />
              Adicionar tarefa
            </Button>
          </TaskUpsertForm>
        </DashboardPageHeaderNav>
      </DashboardPageHeader>

      <DashboardPageMain>
        <h1
          className="
            text-2xl font-bold
            mb-6
          "
        >
          Lista de tarefas
        </h1>

        <TaskDataTable data={tasks} />
      </DashboardPageMain>
    </DashboardPage>
  )
}
