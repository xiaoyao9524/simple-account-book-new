import request from './request';
import type { CategoryVO } from '@/types/category';
import type {
  GetAllCategoryListResult,
  InsertCategoryProps,
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

export const queryUserCategory = () => (
  request<CategoryVO[]>({
    method: 'get',
    url: '/category/queryUserCategory'
  })
)

export const updateUserCategory = (categorys: CategoryVO[]) => (
  request({
    method: 'post',
    url: '/category/updateUserCategory',
    data: categorys
  })
)

export const insertCategory = (data: InsertCategoryProps) => (
  request({
    method: 'post',
    url: '/category/insertCategory',
    data,
  })
)

export const batchUpdateCategory = (data: CategoryVO[]) => (
  request({
    method: 'post',
    url: '/category/batchUpdateCategory',
    data
  })
)


/**old */

export const getAllCategoryList = () =>
  request<GetAllCategoryListResult>({
    method: 'post',
    url: '/category/getAllCategoryList',
  });



export const updateCategory = (data: UpdateCategoryParams) =>
  request<UpdateCategoryResult>({
    method: 'post',
    url: '/category/updateCategory',
    data,
  });

export const getBillListByCategoryId = (data: { categoryId: number }) =>
  request<GetBillListByCategoryIdResult>({
    method: 'post',
    url: '/bill/getBillListByCategoryId',
    data,
  });

export const checkBillByCategoryId = (categoryId: number) =>
  request<CheckBillByCategoryId>({
    method: 'post',
    url: '/bill/checkBillByCategoryId',
    data: { categoryId },
  });

export const deleteCategory = (data: DeleteCategoryParams) =>
  request<DeleteCategoryResult>({
    method: 'delete',
    url: '/category/deleteCategory',
    data,
  });

export const addCategoryToCurrent = (data: AddCategoryToCurrentRequestParams) =>
  request<AddCategoryToCurrentResponseProps>({
    method: 'post',
    url: '/category/addCategoryToCurrent',
    data,
  });

export const updateCurrentUserCategory = () =>
  request<UpdateCurrentUserCategoryResult>({
    method: 'post',
    url: '/category/getCurrentUserCategory',
  });

export const deleteCategoryAndBill = (id: number) =>
  request<DeleteCategoryAndBillResponse>({
    method: 'post',
    url: '/category/deleteCategoryAndBill',
    data: { id },
  });
