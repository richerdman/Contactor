export type Board = {
    id: number;
    name: string;
    description: string;
    thumbnailPhoto: string;
};

export type List = {
    id: number;
    boardId: number;
    name: string;
    color: string;
};

export type Task = {
    id: number;
    listId: number;
    name: string;
    description: string;
    isFinished: boolean;
};

export type RootStackParamList = {
    Home: undefined;
    Boards: undefined;
    createBoard: undefined;
    editBoard: { boardId: number };
    Lists: { boardId: number };
    Tasks: { listId: number };
};