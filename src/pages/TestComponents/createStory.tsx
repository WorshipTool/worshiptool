export const storyBookComponents: StoryBookItem[] = [];

type ComponentFuncType = () => JSX.Element;
export type StoryBookItem = {
    component: ComponentFuncType;
    name: string;
};

export const createStory = (
    type: Function,
    storyComponent: ComponentFuncType
) => {
    const data: StoryBookItem = {
        component: storyComponent,
        name: type.name
    };
    if (!data) return;
    storyBookComponents.push(data);
};
