import type { BaseResult } from './base';
import type { CategoryItem } from './category';
import type {CategoryType} from '@/enums/categoryEnum'
export interface BillItem {
  readonly id: number;
  readonly uid: number;
  category: CategoryItem;
  categoryType: number;
  price: number;
  billTime: string;
  remark?: string;
}

export interface GetBillListByDateRequestProps {
  date: string;
}

export type GetBillListByDateResponse = BaseResult<{
  list: BillItem[];
}>;

export interface InsertBillProps {
  type: CategoryType;
  categoryId: number;
  price: string;
  date: string;
  remark?: string;
}

export type InsertBillResponse = BaseResult<BillItem>;

export interface UpdateBillProps extends InsertBillProps {
  id: number;
}

export type UpdateBillResponse = BaseResult<boolean>;

export interface DeleteBillProps {
  id: number;
}

export type DeleteBillResponse = BaseResult<null>;
