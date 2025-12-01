import rawData from '../data/data.json';
import type { Board, List } from '../types/types';

export type Task = {
    id: number;
    name: string;
    description?: string;
    isFinished: boolean;
    listId: number;
};

type DataShape = {
    boards: Board[];
    lists: List[];
    tasks: Task[];
};

// Keep a singleton in-memory copy of the data so updates persist during app runtime
const data: DataShape = JSON.parse(JSON.stringify(rawData));

let nextTaskId = data.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;

export function getLists() {
    return data.lists.slice();
}

export function getListById(id: number) {
    return data.lists.find((l) => l.id === id) ?? null;
}

export function getTasksByList(listId: number) {
    return data.tasks.filter((t) => t.listId === listId).slice();
}

export function getAllTasks() {
    return data.tasks.slice();
}

export function createTask(payload: { name: string; description?: string; listId: number }) {
    const task: Task = {
        id: nextTaskId++,
        name: payload.name,
        description: payload.description ?? '',
        isFinished: false,
        listId: payload.listId,
    };
    data.tasks.push(task);
    return task;
}

export function toggleTaskFinished(taskId: number) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return null;
    t.isFinished = !t.isFinished;
    return t;
}

export function moveTask(taskId: number, toListId: number) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return null;
    t.listId = toListId;
    return t;
}

export function deleteTask(taskId: number) {
    const idx = data.tasks.findIndex((x) => x.id === taskId);
    if (idx === -1) return false;
    data.tasks.splice(idx, 1);
    return true;
}

export function editTask(taskId: number, updates: Partial<Omit<Task, 'id' | 'listId'>>) {
    const t = data.tasks.find((x) => x.id === taskId);
    if (!t) return null;
    if (updates.name !== undefined) t.name = updates.name;
    if (updates.description !== undefined) t.description = updates.description;
    if (updates.isFinished !== undefined) t.isFinished = updates.isFinished;
    return t;
}

export function getListsForBoard(boardId: number) {
    return data.lists.filter((l) => l.boardId === boardId).slice();
}