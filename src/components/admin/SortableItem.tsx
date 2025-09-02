import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PropsWithChildren } from "react";

type SortableItemProps = PropsWithChildren<{ id: string }>;

export default function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative"
    >
      <div
        {...listeners}
        className="absolute left-[-24px] top-4 cursor-grab text-gray-500 hover:text-pink"
      >
        ⠿
      </div>
      {children}
    </div>
  );
}
