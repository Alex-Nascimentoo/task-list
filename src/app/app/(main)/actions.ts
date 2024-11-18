'use server'

import { prisma } from '@/services/database'
import { z } from 'zod'
import { deleteTaskSchema } from './schema'
import { Task } from './types'

export async function getUserTasks() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      presentOrder: 'asc',
    }
  })

  return tasks
}

export async function upsertTask(dto: Task) {
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
      },
    })

    return {
      error: null,
      data: 'Task deleted successfully',
    }
  }
}
