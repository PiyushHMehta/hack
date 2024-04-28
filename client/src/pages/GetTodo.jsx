import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../UserContext'
import axios from 'axios'

export default function GetTodo() {
    const { user } = useContext(UserContext)
    const [todoTasks, setTodoTasks] = useState([])
    useEffect(() => {
        axios.get('/get-todo').then(res => {
            setTodoTasks(res.data)
        })
    }, [user])

    // console.log(todoTasks);
    const formatDeadline = (deadlineString) => {
        const deadline = new Date(deadlineString);
        return deadline.toLocaleString(); // Adjust the format as needed
    };

    const handleDelete = async  (id) => {
           const res = await axios.post('/delete-Todo' , { id })
           setTodoTasks(prev => prev.filter(task => task._id !== id)) ; 
    }

    return (
        <div className='mt-20 flex flex-col items-center justify-center gap-2'>
            {todoTasks.length > 0 ? (
                todoTasks.map((todoTask) => (
                    <div key={todoTask._id} className='bg-blue-400 py-2 px-4 rounded-md text-white'>
                        <p><strong>Work:</strong> {todoTask.work}</p>
                        <p><strong>Deadline:</strong> {formatDeadline(todoTask.deadline)}</p>
                        <button onClick={(e) => handleDelete(todoTask._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No todo tasks found</p>
            )}
        </div>
    )
}
