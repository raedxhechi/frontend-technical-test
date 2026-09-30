import type { User } from '../types/user'
import { get } from './api'

export async function getUser(userId: User['id']): Promise<User | null> {
  const [user] = await get<User[]>(`/user/${userId}`)

  return user ?? null
}
