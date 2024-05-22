import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTodos } from '../../store';
import { Regular } from './Regular'
import { Edit } from './Edit'

export const List = () => {
  // Получаем отфильтрованные задачи
  const filteredTodos = useSelector(selectFilteredTodos)

  /**
  * Логика рендеринга:
  * - рендерим только отфильтрованные задачи
  * - и в зависимости от индикатора редактирования задачи,
  * рендерим тот или иной элемент списка
  */

  return (
    
    <div className=' col-6'>
      <h3>Todos</h3>
      <ul className='list-group'>
        {filteredTodos.map((todo) =>
          todo.edit ? (
            <Edit key={todo.id} todo={todo} />
          ) : (
            <Regular key={todo.id} todo={todo} />
          )
        )}
      </ul>
    </div>
  )
}
