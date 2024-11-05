import { ReturnTypeWithoutPromise } from '@/@types/return-type-without-promise'
import { getUserTasks } from './actions'

export type Task = ReturnTypeWithoutPromise<typeof getUserTasks>[0]
