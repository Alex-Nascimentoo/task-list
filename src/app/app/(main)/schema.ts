import { z } from 'zod';

export const upsertTaskSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  cost: z.number(),
  dueDate: z.date(),
})
