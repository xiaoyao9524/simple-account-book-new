package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.BillEntity;
import com.xy.simple_accountbook.bill.entity.vo.BillVO;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BillMapper {
    int insert(@Param("bill") BillEntity bill);
    int update(@Param("bill") BillEntity bill);

    List<BillQueryResult> queryByDateAndUid(@Param("start") String start, @Param("end") String end, @Param("uId") Long uId);

    int batchDelete(@Param("ids") List<Long> ids);

    Long findBillCountByCategoryIdAndUid(@Param("categoryId") Long categoryId, @Param("uId")Long uId);
    List<BillQueryResult> queryByCategoryIdAndUid(@Param("categoryId") Long categoryId, @Param("uId")Long uId);
}
