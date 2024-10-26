import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTasks = tasks.map(task => {
                if (task.time && new Date(task.time) <= new Date()) {
                    if (!task.expired) {
                        toast.error(`"${task.name}" vazifasi muddati tugadi!`);
                    }
                    return { ...task, expired: true };
                }
                return task;
            });
            setTasks(updatedTasks);
        }, 1000);

        return () => clearInterval(interval);
    }, [tasks]);

    function handleInputChange(e) {
        setNewTask(e.target.value);
    }

    function handleTimeChange(e) {
        setNewTaskTime(e.target.value);
    }

    function addTask() {
        if (newTask) {
            const task = {
                name: newTask,
                completed: false,
                time: newTaskTime ? new Date(newTaskTime).toISOString() : null,
                expired: false
            };
            setTasks([...tasks, task]);
            setNewTask('');
            setNewTaskTime('');
            toast.success('Vazifa qo‘shildi!');
        }
    }

    function deleteTask(i) {
        const updatedTasks = tasks.filter((_, index) => index !== i);
        setTasks(updatedTasks);
        toast.info("Vazifa o'chirib tashlandi!");
    }

    function toggleTaskCompletion(i) {
        const updatedTasks = tasks.map((task, index) =>
            index === i ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        toast.success('Vazifa muvaffaqiyatli bajarildi!');
    }

    function moveTaskUp(i) {
        if (i > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[i], updatedTasks[i - 1]] = [updatedTasks[i - 1], updatedTasks[i]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(i) {
        if (i < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[i], updatedTasks[i + 1]] = [updatedTasks[i + 1], updatedTasks[i]];
            setTasks(updatedTasks);
        }
    }

    function formatTime(time) {
        return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric', 
            month: '2-digit', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        }).format(new Date(time));
    }

    return (
        <div className='max-w-[400px] w-full bg-green-400 p-3 rounded-md shadow-md mx-auto mt-6'>
            <h1 className='text-lg font-bold mb-3 text-white text-center'>VAZIFALAR RO'YXATI</h1>
            
            <div className='flex flex-col gap-2 mb-3'>
                <input
                    type="text"
                    placeholder='Vazifa kiriting...'
                    onChange={handleInputChange}
                    value={newTask}
                    className='input input-bordered w-full text-sm'
                />
                <input
                    type="datetime-local"
                    onChange={handleTimeChange}
                    value={newTaskTime}
                    className='input input-bordered w-full text-sm'
                />
                <button onClick={addTask} className='btn btn-neutral w-full text-sm'>
                    Vazifa qo‘shish
                </button>
            </div>

            <ol className='space-y-2 text-sm'>
                {tasks.map((task, i) => (
                    <li key={i} className={`flex flex-col gap-2 p-2 ${task.completed ? 'line-through text-gray-500' : 'text-black'} ${task.expired ? 'bg-red-200' : 'bg-gray-100'} rounded-lg shadow`}>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(i)}
                                    className='checkbox checkbox-xs checkbox-success'
                                />
                                <span className='text-base'>{task.name}</span>
                            </div>
                            {task.time && !task.expired && (
                                <span className='text-xs text-gray-600'>{formatTime(task.time)}</span>
                            )}
                        </div>
                        <div className='flex gap-2 justify-end text-xs'>
                            <button onClick={() => moveTaskUp(i)} className='btn btn-xs bg-green-600 w-8'>👆</button>
                            <button onClick={() => moveTaskDown(i)} className='btn btn-xs bg-blue-600 w-8'>👇</button>
                            <button onClick={() => deleteTask(i)} className='btn btn-xs bg-red-600 w-8 text-white'>❌</button>
                        </div>
                    </li>
                ))}
            </ol>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    )
}

export default ToDoList;
