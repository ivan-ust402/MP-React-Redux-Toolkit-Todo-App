import React from 'react';
import { useDispatch } from 'react-redux';
import { removeTodo, updateTodo } from '../../../store';

export const Regular = ({ todo }) => {
  // Получаем диспетчер
  const dispatch = useDispatch()
  // Получаем все свойства задачи
  const {id, text, done, edit} = todo

  return (
    <li className='list-group-item d-flex g-1 align-items-center'>
      <input 
        className='form-check-input'
        type="checkbox" 
        checked={done}
        onChange={() => dispatch(updateTodo({ id, changes: { done: !done } }))}
      />
      <p
        className={`flex-grow-1 m-0 text-start ${
          done ? 'text-muted text-decortion-line-through' : ''
        }`}
      >
        { text }
      </p>
      <button
        onClick={() => dispatch(updateTodo({ id, changes: { edit: !edit } }))}
        className='btn btn-outline-info'
        disabled={done}
      >
        <i className='bi bi-pencil'></i>
      </button>
      <button
        onClick={() => dispatch(removeTodo(id))}
        className='btn btn-outline-danger'
      >
        <i className="bi bi-trash"></i>
      </button>
    </li>
  );
}

