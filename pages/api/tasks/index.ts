import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, saveTasks, Task } from '../../../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const tasks = getTasks();

    // GET: Výpis
    if (req.method === 'GET') {
        return res.status(200).json(tasks);
    }

    // POST: Nový úkol
    if (req.method === 'POST') {
        const { title } = req.body;

        // Validace (pro lepší známku)
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'Název úkolu je povinný!' });
        }

        const newTask: Task = {
            id: uuidv4(), // Vygeneruje unikátní ID
            title: title.trim(),
            isDone: false,
        };

        tasks.push(newTask);
        saveTasks(tasks); // Uloží do souboru

        return res.status(201).json(newTask);
    }

    return res.status(405).json({ message: 'Method not allowed' });
}