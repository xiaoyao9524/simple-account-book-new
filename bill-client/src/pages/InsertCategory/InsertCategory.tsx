import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Toast } from 'antd-mobile';
import { useStore } from '@/store/useStore';
import { insertCategory } from '@/api/category';
import type { InsertCategoryProps } from '@/types/category';
import NavBar from '@/components/NavBar/NavBar';
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

export default function InsertCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { type?: '支出' | '收入' } | null;
  const setUserCategory = useStore((s) => s.setUserCategory);

  const [currentIcon, setCurrentIcon] = useState(iconList[0].list[0]);
  const categoryType: 0 | 1 = state?.type === '收入' ? 0 : 1;
  const { register, handleSubmit, formState: { errors } } = useForm<{ title: string }>();

  useEffect(() => {
    if (!state || !state.type) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  async function handlerSave(data: { title: string }) {
    const params: InsertCategoryProps = {
      title: data.title,
      categoryType,
      icon: currentIcon,
    };
    try {
      const res = await insertCategory(params);
      if (res.status === 200) {
        setUserCategory(res.data);
        navigate(-1);
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    } catch (err) {
      Toast.show({ content: (err as Error).message, icon: 'fail' });
    }
  }

  return (
    <div className="insert-category">
      <NavBar style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 5 }}>
        新增类别
      </NavBar>

      <form className="form-area" onSubmit={handleSubmit(handlerSave)}>
        <div className="input-row">
          <label className="label">类别名称</label>
          <input
            className="input"
            {...register('title', {
              required: '必须输入类别名称',
              maxLength: { value: 4, message: '类别名称不要超过四个汉字' },
            })}
            placeholder="类别名称(不超过四个汉字)"
          />
        </div>
        {errors.title && <p className="error">{errors.title.message}</p>}
      </form>

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
        <Button block color="primary" onClick={handleSubmit(handlerSave)}>
          保存
        </Button>
      </div>
    </div>
  );
}
