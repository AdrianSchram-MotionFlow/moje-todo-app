import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, saveTasks } from '../../../lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query; // Získáme ID z URL
    let tasks = getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Úkol nenalezen' });
    }

    if (req.method === 'GET') {
        return res.status(200).json(tasks[taskIndex]);
    }

    if (req.method === 'PUT') {
        const { isDone } = req.body;

        if (isDone !== undefined) {
            tasks[taskIndex].isDone = isDone;
        }

        saveTasks(tasks);
        return res.status(200).json(tasks[taskIndex]);
    }

    if (req.method === 'DELETE') {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks(tasks);
        return res.status(200).json({ message: 'Úkol smazán' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}