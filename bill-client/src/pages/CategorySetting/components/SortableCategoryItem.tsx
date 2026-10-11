import { useRef } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { CategoryVO } from '@/types/category';

export interface SortableCategoryItemProps extends CategoryVO {
  index: number;
  onDelete?: (category: CategoryVO) => void;
}

export default function SortableCategoryItem(props: SortableCategoryItemProps) {
  const {
    id,
    uId,
    title,
    icon,
    type,
    sort,
    enable,
    index,
    onDelete,
  } = props;
  const draghandleRef = useRef<HTMLSpanElement>(null);
  const { ref } = useSortable({
    id,
    index,
    handle: draghandleRef,
    transition: {
      duration: 200
    }
  });

  return (
    <li
      ref={ref}
      className="category-item"
    >
      <div
        className="operation-icon-wrapper"
        onClick={() => {
          onDelete?.({
            id,
            uId,
            title,
            icon,
            type,
            sort,
            enable
          });
        }}
      >
        <span className="icon iconfont-base icon-minus" />
      </div>
      <div className="category-icon-wrapper">
        <span className={`icon iconfont icon-${icon}`} />
      </div>
      <p className="category-title">
        {title} {uId !== null && <span className="category-user-icon" style={{ color: '#ccc' }}>(自定义)</span>}
      </p>
      <div className="drag-sort-wrapper">
        <span ref={draghandleRef} className="icon iconfont-base icon-sort" />
      </div>
    </li>
  );
}
