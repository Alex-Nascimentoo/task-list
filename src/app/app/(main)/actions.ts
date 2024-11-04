import { auth } from '@/services/auth'
import { prisma } from '@/services/database'

export async function getUserTasks() {
  const session = await auth()

  const tasks = await prisma.task.findMany({
    where: {
      userId: session?.user?.id,
    }
  })

  return tasks
}
