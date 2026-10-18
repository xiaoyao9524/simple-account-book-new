import request from './request';
import type {
  GetBillListByDateRequestProps,
  InsertBillProps,
  DeleteBillProps,
  DeleteBillResponse,
  UpdateBillProps,
  UpdateBillResponse,
  BillItem
} from '@/types/bill';

export const insertBill = (data: InsertBillProps) =>
  request({
    method: 'post',
    url: '/bill/insert',
    data,
  });

/**old */

export const getBillListByDate = (params: GetBillListByDateRequestProps) =>
  request<BillItem[]>({
    method: 'get',
    url: '/bill/list',
    params
  });



export const deleteBill = (data: DeleteBillProps) =>
  request<DeleteBillResponse>({
    method: 'delete',
    url: '/bill/deleteBill',
    data,
  });

export const updateBill = (data: UpdateBillProps) =>
  request<UpdateBillResponse>({
    method: 'post',
    url: '/bill/updateBill',
    data,
  });
