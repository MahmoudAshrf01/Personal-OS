
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type { DragEndEvent } from "@dnd-kit/core";

type Status = {
  id: string;
  name: string;
  color: string;
};

type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
};

export type ListItemsProps = {
  children: ReactNode;
  className?: string;
};

export const ListItems = ({ children, className }: ListItemsProps) => (
  <div className={cn("flex flex-1 flex-col gap-2 p-3", className)}>
    {children}
  </div>
);

export type ListHeaderProps =
  | {
      children: ReactNode;
    }
  | {
      name: Status["name"];
      color: Status["color"];
      className?: string;
    };

export const ListHeader = (props: ListHeaderProps) =>
  "children" in props ? (
    props.children
  ) : (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 bg-foreground/5 p-3",
        props.className
      )}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: props.color }}
      />
      <p className="m-0 font-semibold text-sm">{props.name}</p>
    </div>
  );

export type ListGroupProps = {
  id: Status["id"];
  children: ReactNode;
  className?: string;
};

export const ListGroup = ({ id, children, className }: ListGroupProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        "bg-secondary transition-colors",
        isOver && "bg-foreground/10",
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

type ListItemContextValue = {
  attributes: ReturnType<typeof useDraggable>["attributes"];
  listeners: ReturnType<typeof useDraggable>["listeners"];
};

const ListItemContext = createContext<ListItemContextValue | null>(null);

const DragOverlayContext = createContext(false);
const DragOverlayEnabledContext = createContext(false);

export const useIsDragOverlay = () => useContext(DragOverlayContext);

export type ListItemDragHandleProps = {
  children: ReactNode;
  className?: string;
};

export const ListItemDragHandle = ({
  children,
  className,
}: ListItemDragHandleProps) => {
  const context = useContext(ListItemContext);
  if (!context) {
    throw new Error("ListItemDragHandle must be used within a ListItem");
  }

  return (
    <div
      className={cn("cursor-grab touch-none active:cursor-grabbing", className)}
      {...context.listeners}
      {...context.attributes}
    >
      {children}
    </div>
  );
};

export type ListItemProps = Pick<Feature, "id" | "name"> & {
  readonly index: number;
  readonly parent: string;
  readonly children?: ReactNode;
  readonly className?: string;
};

export const ListItem = ({
  id,
  name,
  index,
  parent,
  children,
  className,
}: ListItemProps) => {
  const isDragOverlay = useIsDragOverlay();
  const hasDragOverlay = useContext(DragOverlayEnabledContext);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { index, parent },
      disabled: isDragOverlay,
    });

  const showPlaceholder = isDragging && hasDragOverlay;

  return (
    <ListItemContext.Provider value={{ attributes, listeners }}>
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-md border bg-background p-2 shadow-sm",
          showPlaceholder && "opacity-40",
          isDragOverlay && "z-[100] cursor-grabbing shadow-lg ring-2 ring-primary/20",
          className
        )}
        style={
          isDragOverlay || showPlaceholder
            ? undefined
            : {
                transform: transform
                  ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                  : undefined,
              }
        }
        ref={setNodeRef}
      >
        {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
      </div>
    </ListItemContext.Provider>
  );
};

export type ListProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragCancel?: () => void;
  dragOverlay?: ReactNode;
  className?: string;
};

export const ListProvider = ({
  children,
  onDragEnd,
  onDragStart,
  onDragCancel,
  dragOverlay,
  className,
}: ListProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  return (
    <DragOverlayEnabledContext.Provider value={Boolean(dragOverlay)}>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={(event) => {
          setActiveId(String(event.active.id));
          onDragStart?.(event);
        }}
        onDragEnd={(event) => {
          setActiveId(null);
          onDragEnd(event);
        }}
        onDragCancel={() => {
          setActiveId(null);
          onDragCancel?.();
        }}
      >
        <div className={cn("relative flex size-full flex-col", className)}>
          {children}
        </div>
        {typeof document !== "undefined"
          ? createPortal(
              <DragOverlay dropAnimation={null} className="z-100">
                {activeId && dragOverlay ? (
                  <DragOverlayContext.Provider value={true}>
                    {dragOverlay}
                  </DragOverlayContext.Provider>
                ) : null}
              </DragOverlay>,
              document.body
            )
          : null}
      </DndContext>
    </DragOverlayEnabledContext.Provider>
  );
};
