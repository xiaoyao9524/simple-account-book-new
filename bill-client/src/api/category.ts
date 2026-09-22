import request from './request';
import type {
  GetAllCategoryListResult,
  InsertCategoryProps,
  InsertCategoryResultProps,
  UpdateCategoryParams,
  UpdateCategoryResult,
  GetBillListByCategoryIdResult,
  CheckBillByCategoryId,
  DeleteCategoryParams,
  DeleteCategoryResult,
  UpdateCurrentUserCategoryResult,
  AddCategoryToCurrentRequestParams,
  AddCategoryToCurrentResponseProps,
  DeleteCategoryAndBillResponse,
} from '@/types/category';

export const getAllCategoryList = () =>
  request<GetAllCategoryListResult>({
    method: 'post',
    url: '/api/category/getAllCategoryList',
  });

export const insertCategory = (data: InsertCategoryProps) =>
  request<InsertCategoryResultProps>({
    method: 'post',
    url: '/api/category/insert',
    data,
  });

export const updateCategory = (data: UpdateCategoryParams) =>
  request<UpdateCategoryResult>({
    method: 'post',
    url: '/api/category/updateCategory',
    data,
  });

export const getBillListByCategoryId = (data: { categoryId: number }) =>
  request<GetBillListByCategoryIdResult>({
    method: 'post',
    url: '/api/bill/getBillListByCategoryId',
    data,
  });

export const checkBillByCategoryId = (categoryId: number) =>
  request<CheckBillByCategoryId>({
    method: 'post',
    url: '/api/bill/checkBillByCategoryId',
    data: { categoryId },
  });

export const deleteCategory = (data: DeleteCategoryParams) =>
  request<DeleteCategoryResult>({
    method: 'delete',
    url: '/api/category/deleteCategory',
    data,
  });

export const addCategoryToCurrent = (data: AddCategoryToCurrentRequestParams) =>
  request<AddCategoryToCurrentResponseProps>({
    method: 'post',
    url: '/api/category/addCategoryToCurrent',
    data,
  });

export const updateCurrentUserCategory = () =>
  request<UpdateCurrentUserCategoryResult>({
    method: 'post',
    url: '/api/category/getCurrentUserCategory',
  });

export const deleteCategoryAndBill = (id: number) =>
  request<DeleteCategoryAndBillResponse>({
    method: 'post',
    url: '/api/category/deleteCategoryAndBill',
    data: { id },
  });
