package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.entity.BillUserEntity;
import com.xy.simple_accountbook.bill.entity.vo.BillUserVO;
import com.xy.simple_accountbook.bill.mapper.BillUserMapper;
import com.xy.simple_accountbook.bill.service.BillUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillUserServiceImpl implements BillUserService {
    private final BillUserMapper billUserMapper;
}
