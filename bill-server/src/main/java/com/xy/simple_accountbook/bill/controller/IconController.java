package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.entity.IconEntity;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.entity.vo.IconVO;
import com.xy.simple_accountbook.bill.service.impl.IconServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class IconController {

    @Autowired
    IconServiceImpl iconService;

    @GetMapping("/icon/queryDefaultIconList")
    public BaseResponse<List<IconVO>> queryDefaultIconList() {
         List<IconEntity> iconEntitys = iconService.queryDefaultIcons();

         List<IconVO> iconVos = iconEntitys.stream().map(IconVO::transferEntityToIconVO).collect(Collectors.toList());

         return BaseResponse.success(iconVos);
    }
}
