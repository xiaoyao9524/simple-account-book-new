import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { } from 'react-hook-form';
import { Form, Input, Button, Segmented, Toast } from 'antd-mobile';
import { type FormInstance } from 'antd-mobile/es/components/form'
import useCategoryStore from '@/store/useCategoryStore';
import { insertCategory } from '@/api/category';
import NavBar from '@/components/NavBar/NavBar';
import { CategoryTypeEnum, type CategoryType, checkIsCategoryType } from '@/enums/categoryEnum'
import './style.scss';

const iconList = [
  { title: '娱乐', list: ['shuma', 'game', 'steam', 'uplay', 'wegame', 'gog', 'epic', 'origin'] },
  { title: '饮食', list: ['canyin', 'shuiguo', 'shucai', 'lingshi', 'cha', 'yanjiu'] },
  { title: '医疗', list: ['yiliao'] },
  { title: '学习', list: ['shuji', 'xuexi'] },
  { title: '交通', list: ['zixingche', 'chuzuche', 'gongjiao', 'ditie', 'huoche', 'jipiao', 'qiche', 'truck'] },
  { title: '购物', list: ['fushi', 'gouwu', 'taobao', 'jingdong', 'xianyu', 'chaoshi', 'riyongpin', 'liwu'] },
  { title: '生活', list: ['shuifei', 'dianfei', 'wangluo', 'huafei', 'meirong', 'lvxing'] },
  { title: '家居', list: ['zhufang', 'jujia', 'weixiu'] },
  { title: '家庭', list: ['haizi', 'zhangbei', 'chongwu', 'qinyou'] },
  { title: '健身', list: ['yundong'] },
  { title: '办公', list: ['bangong'] },
  { title: '其它', list: ['jiaofei', 'qita', 'shejiao', 'lijin', 'juanzeng', 'zhuanzhang', 'caipiao', 'gongzi', 'licai', 'jianzhi'] },
];

export interface InsertCategoryFormData {
  title: string;
}

export default function InsertCategory() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const location = useLocation();
  const updateCategory = useCategoryStore((s) => s.updateList);

  const [form] = Form.useForm<InsertCategoryFormData>()
  const formInstance = useRef<FormInstance>(null);
  const [type, setType] = useState<CategoryType>(() => {
    // const localType = searchParams.get('type');
    const localType = location.state?.type;

    if (!localType) {
      return CategoryTypeEnum.EXPEND;
    }

    const type = Number(localType) as CategoryType;

    if (!checkIsCategoryType(type)) {
      return CategoryTypeEnum.EXPEND;
    }

    return type;
  });
  const [currentIcon, setCurrentIcon] = useState(iconList[0].list[0]);

  const handlerSave = async () => {
    if (!formInstance.current) {
      return
    }
    formInstance.current.submit();

  }

  const handlerFinish = async (values: InsertCategoryFormData) => {
    const param = {
      type,
      title: values.title,
      icon: currentIcon,
    }

    console.log('param: ', param);

    const res = await insertCategory(param);

    if (res) {
      Toast.show({ content: '新增类别成功', icon: 'success' });
      updateCategory();
      navigate(-1);
    }
  }

  const validateTitle = (_: unknown, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    const hasChineseRe = /[\u4e00-\u9fa5]/.test(value);
    if (hasChineseRe) {
      if (value.length > 4) {
        return Promise.reject(new Error('含有中文时长度最大为4个字符！'));
      }
    }

    if (value.length > 6) {
      return Promise.reject(new Error('类别名称长度最大为6个字符！'));
    }

    return Promise.resolve();
  }

  return (
    <div className="insert-category">
      <NavBar style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 5 }}>
        新增类别
      </NavBar>

      <div className="form-area">
        <Form
          layout='horizontal'
          form={form}
          name="form"
          ref={formInstance}
          onFinish={handlerFinish}
        >
          <Form.Item name="title" label="类别名称"
            rules={[
              { required: true, message: '请输入类别名称' },
              { type: 'string', min: 1, max: 6, message: '类别名称长度为1-6个字符！' },
              { validator: validateTitle }
            ]}
          >
            <Input placeholder="类别名称" />
          </Form.Item>
        </Form>
        <div className="tabs">
          <Segmented
            value={type}
            onChange={(val) => {
              setType(val as CategoryType);
            }}
            options={[
              { label: '支出', value: CategoryTypeEnum.EXPEND },
              { label: '收入', value: CategoryTypeEnum.INCOME },
            ]}
          />
        </div>
      </div>

      <ul className="icon-list-wrapper">
        {iconList.map((i) => (
          <li key={i.title} className="icon-list-item">
            <h3 className="icon-list-title">{i.title}</h3>
            <ul className="icon-list">
              {i.list.map((icon) => (
                <li
                  key={icon}
                  className={`icon-item ${currentIcon === icon ? 'active' : ''}`}
                  onClick={() => setCurrentIcon(icon)}
                >
                  <span className={`icon iconfont icon-${icon}`} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="save-btn-wrapper">
        <Button block color="primary" onClick={handlerSave}>
          保存
        </Button>
      </div>
    </div>
  );
}
