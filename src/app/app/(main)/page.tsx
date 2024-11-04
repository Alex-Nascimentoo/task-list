import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'

export default async function Page() {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Tarefas</DashboardPageHeaderTitle>
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
      </DashboardPageMain>
    </DashboardPage>
  )
}
