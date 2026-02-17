import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

export interface Task {
    id: string;
    title: string;
    isDone: boolean;
}
export const getTasks = (): Task[] => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(fileData);
    } catch (e) {
        return [];
    }
};

export const saveTasks = (tasks: Task[]) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};