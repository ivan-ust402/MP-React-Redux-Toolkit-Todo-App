import { nanoid } from "nanoid"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { addTodo } from "../../store"

const New = () => {
  // Получаем диспетчер
  const dispatch = useDispatch()
  // Локальное состояние для текста новой задачи
  const [text, setText] = useState()

  // Функция для изменения тескта задачи
  const changeText = ({ target: { value } }) => {
    // Форматируем строку, встречающися пробелы отличные от одинарного приводим
    // к одинарным и убираем пробелы с начала и с конца строки
    const trimmed = value.replace(/\s{2,}/g, " ").trim()
    setText(trimmed)
  }

  // Функия для добавления задачи
  const onAddTodo = (e) => {
    e.preventDefault()

    if (!text) return

    const newTodo = {
      id: nanoid(5),
      text,
      done: false,
      edit: false,
    }

    // Отправляем операцию для добавления новой задачи
    dispatch(addTodo(newTodo))

    setText("")
  }

  return (
    <form onSubmit={onAddTodo} className="d-flex mb-4">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={changeText}
        className="form-control flex-grow-1"
      />
      <button className="btn btn-outline-success">
        <i className="bi bi-plus-square"></i>
      </button>
    </form>
  )
}

export default New
