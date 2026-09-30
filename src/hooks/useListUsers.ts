import { skipToken, useQuery } from '@tanstack/react-query'
import { getUsers } from '../services/users'

export enum UserOperation {
  List = 'list',
}

export const getQueryKey = (operation: UserOperation) => ['users', operation] as const

export function useListUsers(enabled: boolean) {
  return useQuery({
    queryKey: getQueryKey(UserOperation.List),
    queryFn: enabled ? getUsers : skipToken,
  })
}
