import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks } from '../../../lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Načteme úkoly
    const tasks = getTasks();

    // Pokud je to GET, vrátíme je
    if (req.method === 'GET') {
        return res.status(200).json(tasks);
    }

    // Cokoliv jiného zatím odmítneme
    return res.status(405).json({ message: 'Method not allowed' });
}