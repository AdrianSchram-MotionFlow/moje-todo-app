import { useState, useEffect } from 'react';
import Head from 'next/head';

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

    const toggleTask = async (task: Task) => {
        await fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDone: !task.isDone }),
        });
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-12 px-4">
            <Head>
                <title>Můj Todolist</title>
            </Head>

            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="p-8 bg-gray-800 border-b border-gray-700">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center">
                        🚀 Todolist
                    </h1>
                </div>

                <div className="p-6">
                    <form onSubmit={addTask} className="flex gap-3 mb-8">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                            placeholder="Co máš v plánu?"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
                        >
                            Přidat
                        </button>
                    </form>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                    task.isDone
                                        ? 'bg-gray-900 border-gray-800 opacity-50'
                                        : 'bg-gray-750 border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                                }`}
                            >
                                <div
                                    onClick={() => toggleTask(task)}
                                    className="flex items-center gap-4 cursor-pointer flex-1 select-none"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            task.isDone
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-400 group-hover:border-blue-400'
                                        }`}
                                    >
                                        {task.isDone && <span className="text-white text-xs font-bold">✓</span>}
                                    </div>
                                    <span
                                        className={`text-lg font-medium transition-all ${
                                            task.isDone ? 'line-through text-gray-500' : 'text-gray-100'
                                        }`}
                                    >
                    {task.title}
                  </span>
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-800 transition"
                                    title="Smazat"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                <p className="text-lg">Vše hotovo! 🎉</p>
                                <p className="text-sm">Dej si kafe nebo přidej úkol.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}