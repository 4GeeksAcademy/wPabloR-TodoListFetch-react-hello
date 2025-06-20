import React, { useState, useEffect } from "react";
import './TodoList.css';


const Fetch = () => {

    const [input, setInput] = useState("");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/wPabloR")
            .then(resp => {
                if (resp.status == 404) {
                    return fetch("https://playground.4geeks.com/todo/users/wPabloR", {
                        method: "POST",
                        body: JSON.stringify({ todos: [] }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                }
                return Promise.resolve();
            })
            .then(() => {
                return fetch("https://playground.4geeks.com/todo/users/wPabloR")
            })
            .then(resp => resp.json())
            .then( data => {
                setTasks(data.todos || []);
            })
            .catch(error => console.error("Error al crear usuario:", error));
    }, []);


    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/wPabloR")
            .then(resp => resp.json())
            .then(data => {
                const tareas = data.todos;
                setTasks(tareas)
            })
            .catch(error => console.error("error al obtener tareas", error))
    }, [])

    const addInput = (e) => {
        setInput(e.target.value)
    }

    const validateInput = () => {
        if (!input.trim()) {
            alert("Debes añadir una nueva tarea")
        } else {
            fetch("https://playground.4geeks.com/todo/todos/wPabloR", {
                method: "POST",
                body: JSON.stringify({ label: input, done: false }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    if (!resp.ok) throw new Error("Error al añadir tarea");
                    return resp.json()
                })
                .then(() => {
                    return fetch("https://playground.4geeks.com/todo/users/wPabloR")
                })
                .then(resp => resp.json())
                .then(data => {
                    setTasks(data.todos);
                    setInput("")
                })
                .catch(error => {
                    console.error(error);
                    alert("Se ha producido un error al añadir la tarea")
                })
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            validateInput()
        }
    }

    const deleteTask = (idToDelete) => {
        fetch(`https://playground.4geeks.com/todo/todos/${idToDelete}`, {
            method: "DELETE",
        })
            .then(resp => {
                if (!resp.ok) throw new Error("Error al actualizar las tareas");
                setTasks(prevTask => prevTask.filter(task => task.id !== idToDelete))
            })
            .catch(error => {
                console.error("Error al eliminar tarea", error);
                alert("Hubo un problema al eliminar la tarea");
            })
    }

    const deleteAll = () => {
        fetch('https://playground.4geeks.com/todo/users/wPabloR', {
            method: "DELETE"
        })
            .then(resp => {
                if (!resp.ok && resp.status !== 404) {
                    throw new Error("Error al eliminar el usuario");
                }

                return fetch('https://playground.4geeks.com/todo/users/wPabloR', {
                    method: "POST",
                    body: JSON.stringify({ todos: [] }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
            .then(resp => resp.json())
            .then(() => {
                setTasks([])
            })
            .catch(error => console.error("Error al eliminar las tareas", error))
    }


    return (
        <div className="container">
            <h1 className="title">To Do List</h1>

            <div className="todo-box">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={input}
                    onChange={addInput}
                    onKeyDown={handleKeyDown}
                />

                <ul className="todo-list">
                    {tasks.map((task) => (
                        <li key={task.id} className="todo-item">
                            <span>{task.label}</span>
                            <span className="delete-btn" onClick={() => deleteTask(task.id)}>×</span>
                        </li>
                    ))}
                </ul>

                <div className="footer">
                    {tasks.length} item{tasks.length !== 1 && 's'} left
                </div>
                <button className="deleteAll-btn" onClick={deleteAll}>Delete All</button>
            </div>
        </div>
    );
};

export default Fetch;