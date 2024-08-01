import React from "react";

type DragItemState = "dragging" | "idle";

type DraggableListProps<T> = {
    items: T[];
    item: (item: T, state: DragItemState) => React.ReactNode;
    insertLine?: () => React.ReactNode;
    onChange?: (items: T[]) => void;
};

const InsertLine = () => <div style={{ height: 10, backgroundColor: "red" }} />;

export default function DraggableList<T>({
    items,
    item,
    insertLine = InsertLine,
    onChange
}: DraggableListProps<T>) {
    const currentDragIndex = React.useRef<number | null>(null);
    const insertIndex = React.useRef<number | null>(null);

    const [_, setJustNumber] = React.useState(0);
    const rerender = () => setJustNumber((prev) => prev + 1);

    const handleSort = () => {
        if (currentDragIndex.current === null || insertIndex.current === null)
            return;

        // Move the item
        // const newItems = [...items];
        // const [removed] = newItems.splice(currentDragIndex.current, 1);
        // newItems.splice(insertIndex.current, 0, removed);

        // onChange?.(newItems);

        // currentDragIndex.current = null;
        // insertIndex.current = null;
    };

    return (
        <>
            {items.map((data, index) => {
                return (
                    <>
                        {insertIndex.current === index && insertLine?.()}
                        <div
                            key={index}
                            draggable
                            onDragStart={() =>
                                (currentDragIndex.current = index)
                            }
                            onDragEnter={() => {
                                insertIndex.current = index;
                                // rerender();
                            }}
                            // onDragOver={(e) => e.preventDefault()}
                            onDragEnd={handleSort}>
                            {item(data, "idle")}
                        </div>
                    </>
                );
            })}
        </>
    );
}
