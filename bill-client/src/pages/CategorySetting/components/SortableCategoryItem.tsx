import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategoryItem as ICategoryItemProps } from '@/types/category';

export interface SortableCategoryItemProps extends ICategoryItemProps {
  id: number;
  onDelete?: (category: ICategoryItemProps) => void;
}

export default function SortableCategoryItem({
  id,
  title,
  icon,
  categoryType,
  isDefault,
  onDelete,
}: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="category-item"
      {...attributes}
    >
      <div
        className="operation-icon-wrapper"
        onClick={() => {
          onDelete?.({ id, categoryType, title, isDefault, icon });
        }}
      >
        <span className="icon iconfont-base icon-minus" />
      </div>
      <div className="category-icon-wrapper">
        <span className={`icon iconfont icon-${icon}`} />
      </div>
      <p className="category-title">
        {title} {isDefault === 0 ? <span>（自定义）</span> : ''}
      </p>
      <div className="drag-sort-wrapper" {...listeners}>
        <span className="icon iconfont-base icon-sort" />
      </div>
    </li>
  );
}
