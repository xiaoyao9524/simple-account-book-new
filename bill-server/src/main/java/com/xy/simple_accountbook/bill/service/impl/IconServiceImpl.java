package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.entity.IconEntity;
import com.xy.simple_accountbook.bill.mapper.IconMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IconServiceImpl {
    @Autowired
    private IconMapper iconMapper;

    public List<IconEntity> queryDefaultIcons () {
        List<IconEntity> iconEntitys = iconMapper.queryDefaultIcons();

        return iconEntitys;
    }
}
