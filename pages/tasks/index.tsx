import { useState, useEffect } from 'react';

interface Task {
    id: string;
    title: string;
    isDone: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    // Načtení při startu
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
    };

    // Přidání úkolu
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault(); // Aby se nestránka nepřenačetla
        if (!newTask.trim()) return;

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask }),
        });

        setNewTask(''); // Vymazat políčko
        fetchTasks(); // Znovu načíst seznam
    };

    return (
        <div className="p-10 font-sans max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">🚀 Můj Todolist</h1>

            {/* Formulář */}
            <form onSubmit={addTask} className="flex gap-2 mb-8">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded flex-grow focus:border-blue-500 outline-none"
                    placeholder="Co musíš udělat?"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition"
                >
                    Přidat
                </button>
            </form>

            {/* Seznam */}
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li key={task.id} className="border p-3 rounded flex justify-between items-center bg-gray-50">
                        <span>{task.title}</span>
                        <span className={task.isDone ? "text-green-600 font-bold" : "text-gray-400"}>
              {task.isDone ? 'Hotovo' : 'Čeká'}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}