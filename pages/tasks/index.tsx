import { useState, useEffect } from 'react';

interface Task {
    id: string;
    title: string;
    isDone: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask }),
        });

        setNewTask('');
        fetchTasks();
    };

    // NOVÉ: Funkce pro přepnutí stavu
    const toggleTask = async (task: Task) => {
        await fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDone: !task.isDone }),
        });
        fetchTasks();
    };

    // NOVÉ: Funkce pro smazání
    const deleteTask = async (id: string) => {
        if (!confirm('Opravdu smazat?')) return;

        await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10 font-sans flex flex-col items-center">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">✅ Todolist</h1>

                <form onSubmit={addTask} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        placeholder="Co je potřeba udělat?"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md"
                    >
                        Přidat
                    </button>
                </form>

                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`flex justify-between items-center p-4 rounded-lg border transition-all ${
                                task.isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:shadow-sm'
                            }`}
                        >
                            <div
                                onClick={() => toggleTask(task)}
                                className="flex items-center gap-3 cursor-pointer flex-1"
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                                    task.isDone ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                }`}>
                                    {task.isDone && <span className="text-white text-sm">✓</span>}
                                </div>
                                <span className={`text-lg transition ${task.isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </span>
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                                title="Smazat úkol"
                            >
                                🗑
                            </button>
                        </li>
                    ))}
                </ul>

                {tasks.length === 0 && (
                    <p className="text-center text-gray-400 mt-8">Vše hotovo! Dej si kafe. ☕️</p>
                )}
            </div>
        </div>
    );
}