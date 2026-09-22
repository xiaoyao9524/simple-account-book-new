import type { BaseResult } from './base';
import type { CategoryItem } from './category';

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
  categoryType: number;
  categoryId: number;
  price: string;
  billTime: string;
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
