import type { CategoryType } from '@/enums/categoryEnum'

export interface IconVO {
  readonly id: number;
  readonly uId: number | null;
  type: CategoryType
  icon: string,
  title: string,
}