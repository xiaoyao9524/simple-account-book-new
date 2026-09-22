import type { CategoryItemWithSortIndex } from './category';

export interface UserInfo {
  username: string;
  avatar?: string;
  bookkeepingDays: number;
  bookkeepCount: number;
  category: {
    expenditureList: CategoryItemWithSortIndex[];
    incomeList: CategoryItemWithSortIndex[];
  };
}
