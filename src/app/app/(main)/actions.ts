'use server'

// import { auth } from '@/services/auth'
import { prisma } from '@/services/database'
import { z } from 'zod'
import { deleteTaskSchema, upsertTaskSchema } from './schema'

export async function getUserTasks() {
  // const session = await auth()

  const tasks = await prisma.task.findMany({
    // where: {
    //   userId: session?.user?.id,
    // },
    orderBy: {
      presentOrder: 'asc',
    }
  })

  return tasks
}

export async function upsertTask(dto: z.infer<typeof upsertTaskSchema>) {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'User not authorized',
  //     data: null,
  //   }
  // }

  // Update task if already has an id
  if (dto.id) {
    const task = await prisma.task.update({
      where: {
        id: dto.id,
        // userId: session?.user?.id,
      },
      data: {
        title: dto.title,
        cost: dto.cost,
        dueDate: dto.dueDate,
      },
    })

    return {
      error: null,
      data: task,
    }
  }

  if (!dto.title) {
    return {
      error: 'Title is required',
      data: null,
    }
  }

  // Finally create new task
  const task = await prisma.task.create({
    data: {
      title: dto.title,
      cost: dto.cost,
      dueDate: dto.dueDate,
      // userId: session?.user?.id,
      userId: '',
    }
  })

  return task
}

export async function deleteTask(dto: z.infer<typeof deleteTaskSchema>) {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return {
  //     error: 'User not authorized',
  //     data: null,
  //   }
  // }

  if (dto.id) {
    await prisma.task.delete({
      where: {
        id: dto.id,
        // userId: session?.user?.id,
      },
    })

    return {
      error: null,
      data: 'Task deleted successfully',
    }
  }
}
