import { useState, useEffect } from 'react';

interface Task {
    id: string;
    title: string;
    isDone: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetch('/api/tasks')
            .then((res) => res.json())
            .then((data) => setTasks(data));
    }, []);

    return (
        <div>
            <h1>Seznam úkolů</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title} - {task.isDone ? 'Hotovo' : 'Nedokončeno'}
                    </li>
                ))}
            </ul>
        </div>
    );
}