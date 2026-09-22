import request from './request';
import type {
  GetBillListByDateRequestProps,
  GetBillListByDateResponse,
  InsertBillProps,
  InsertBillResponse,
  DeleteBillProps,
  DeleteBillResponse,
  UpdateBillProps,
  UpdateBillResponse,
} from '@/types/bill';

export const getBillListByDate = (data: GetBillListByDateRequestProps) =>
  request<GetBillListByDateResponse>({
    method: 'post',
    url: '/api/bill/getBillListByDate',
    data,
  });

export const insertBill = (data: InsertBillProps) =>
  request<InsertBillResponse>({
    method: 'post',
    url: '/api/bill/insertBill',
    data,
  });

export const deleteBill = (data: DeleteBillProps) =>
  request<DeleteBillResponse>({
    method: 'delete',
    url: '/api/bill/deleteBill',
    data,
  });

export const updateBill = (data: UpdateBillProps) =>
  request<UpdateBillResponse>({
    method: 'post',
    url: '/api/bill/updateBill',
    data,
  });
