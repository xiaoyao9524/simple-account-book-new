import type { BaseResult } from './base';
import type { BillItem } from './bill';
import type { CategoryType, CategoryEnable } from '@/enums/categoryEnum'

export interface CategoryItem {
  readonly id: number;
  readonly uId: number | null;
  type: CategoryType;
  title: string;
  icon: string;
}

export interface CategoryVO extends CategoryItem {
  enable: CategoryEnable,
  sort: number
}

export type InsertCategoryProps = Omit<CategoryItem, 'id' | 'uId'>;

/** old */

export interface CategoryItemWithSortIndex extends CategoryItem {
  sortIndex: number;
}

export interface AllCategoryListResult {
  expenditureList: CategoryItem[];
  incomeList: CategoryItem[];
}

export type GetAllCategoryListResult = BaseResult<AllCategoryListResult>;



export type InsertCategoryResultProps = BaseResult<{
  expenditureList: CategoryItemWithSortIndex[];
  incomeList: CategoryItemWithSortIndex[];
}>;

export interface UpdateCategoryParams {
  expenditureList: number[];
  incomeList: number[];
}

export interface UpdateCategoryResultData {
  expenditureList: CategoryItemWithSortIndex[];
  incomeList: CategoryItemWithSortIndex[];
}

export type UpdateCategoryResult = BaseResult<UpdateCategoryResultData>;

export type GetBillListByCategoryIdResult = BaseResult<{
  billList: BillItem[];
}>;

export type CheckBillByCategoryId = BaseResult<{
  existBill: boolean;
}>;

export interface DeleteCategoryParams {
  id: number;
}

export type DeleteCategoryResult = BaseResult<null>;

export type UpdateCurrentUserCategoryResult = BaseResult<{
  expenditureList: CategoryItemWithSortIndex[];
  incomeList: CategoryItemWithSortIndex[];
}>;

export interface AddCategoryToCurrentRequestParams {
  categoryId: number;
}

export type AddCategoryToCurrentResponseProps = BaseResult<boolean>;

export type DeleteCategoryAndBillResponse = BaseResult<boolean>;
