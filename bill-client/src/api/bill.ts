import request from './request';
import type {
  GetBillListByDateRequestProps,
  InsertBillProps,
  UpdateBillProps,
  BillItem
} from '@/types/bill';

export const insertBill = (data: InsertBillProps) =>
  request({
    method: 'post',
    url: '/bill/insert',
    data,
  });

export const updateBill = (data: UpdateBillProps) =>
  request({
    method: 'post',
    url: '/bill/update',
    data,
  });

export const batchDeleteBill = (ids: number[]) =>
  request<number>({
    method: 'post',
    url: '/bill/batchDelete',
    data: {
      ids
    },
  });

export const getBillListByDate = (params: GetBillListByDateRequestProps) =>
  request<BillItem[]>({
    method: 'get',
    url: '/bill/list',
    params
  });

  export const getBillByCategoryId = (params: { categoryId: number }) =>
    request<BillItem[]>({
      method: 'get',
      url: '/bill/queryByCategoryId',
      params
    });


export const transferCategory = (data: {categoryId: number, newCategoryId: number}) => (
  request<boolean>({
    method: 'post',
    url: '/bill/transferCategory',
    data
  })
)

export const deleteBillAndCategory = (data: {categoryId: number}) => (
  request({
    method: 'post',
    url: '/bill/deleteBillAndCategory',
    data
  })
)

export const getBillDay= () => (
  request<number>({
    method: 'get',
    url: '/bill/getBillDay'
  })
)

export const getBillCount= () => (
  request<number>({
    method: 'get',
    url: '/bill/getBillCount'
  })
)