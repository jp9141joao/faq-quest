import React from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { FAQCard } from './FAQCard';
import { FAQItem } from '../types';

interface ReorderableFAQItemProps {
  item: FAQItem;
  searchTerm: string;
  onDelete: (id: number) => void;
  onEdit: (item: FAQItem) => void;
  onClick: () => void;
}

export const ReorderableFAQItem: React.FC<ReorderableFAQItemProps> = ({
  item,
  searchTerm,
  onDelete,
  onEdit,
  onClick
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <FAQCard
        item={item}
        searchTerm={searchTerm}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        isDraggable={true}
        dragControls={dragControls}
      />
    </Reorder.Item>
  );
};
