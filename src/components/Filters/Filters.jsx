import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store';

export const Filters = () => {
  // Получаем диспетчер
  const dispatch = useDispatch()
  // Получаем текущее значение фильтра
  const status = useSelector((state) => state.filter)

  return (
    <div className='col-3'>
      <h3>Filters</h3>
      {['all', 'active', 'completed'].map(filter => (
        <div key={filter} className='form-check' style={{textAlign: 'left'}}>
          <input 
            id={filter}
            type="radio"
            checked={filter === status}
            onChange={() => dispatch(setFilter(filter))}
            className='form-check-input'
          />
          <label htmlFor={filter} className='form-check-label'>
            {filter.toUpperCase()}
          </label>
        </div>
      ))}
    </div>
  );
}

