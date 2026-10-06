import {useRef} from 'react';
import {useSortable} from '@dnd-kit/react/sortable';
import type { CategoryItem as ICategoryItemProps } from '@/types/category';

export interface SortableCategoryItemProps extends ICategoryItemProps {
  id: number;
  index: number;
  onDelete?: (category: ICategoryItemProps) => void;
}

export default function SortableCategoryItem({
  id,
  title,
  icon,
  categoryType,
  index,
  onDelete,
}: SortableCategoryItemProps) {
  const draghandleRef = useRef<HTMLSpanElement>(null);
  const {ref} = useSortable({
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
          onDelete?.({ id, categoryType, title, icon });
        }}
      >
        <span className="icon iconfont-base icon-minus" />
      </div>
      <div className="category-icon-wrapper">
        <span className={`icon iconfont icon-${icon}`} />
      </div>
      <p className="category-title">
        {title}
      </p>
      <div className="drag-sort-wrapper">
        <span ref={draghandleRef} className="icon iconfont-base icon-sort" />
      </div>
    </li>
  );
}
