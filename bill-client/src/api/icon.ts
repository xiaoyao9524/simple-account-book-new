import request from './request';
import type { IconVO } from '@/types/Icon'

export const queryDefaultIcons = () => {
  return request<IconVO[]>({
    method: 'GET',
    url: '/icon/queryDefaultIconList'
  })
}


