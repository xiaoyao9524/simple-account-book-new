import type { BaseResult } from './base';
import type { BillItem } from './bill';



export interface CategoryItem {
  readonly id: number;
  categoryType: 0 | 1;
  isDefault: 0 | 1;
  title: string;
  icon: string;
}

export interface CategoryItemWithSortIndex extends CategoryItem {
  sortIndex: number;
}

export interface AllCategoryListResult {
  expenditureList: CategoryItem[];
  incomeList: CategoryItem[];
}

export type GetAllCategoryListResult = BaseResult<AllCategoryListResult>;

export interface InsertCategoryProps {
  categoryType: 0 | 1;
  title: string;
  icon: string;
}

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
