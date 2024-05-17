import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"

import axios from "axios"

const SERVER_URL = "http://localhost:4000/todos"

// Создаем адаптер сущностей для задач
const todoAdapter = createEntityAdapter()

//Инициализируем начальное состояние для задач
const initialTodoState = todoAdapter.getInitialState({
  // Индикатор загрузки
  status: "idle",
  // Сообщение
  message: {},
})

// Создаем и экспортируем преобразователь для получения задач от сервера
export const fetchTodo = createAsyncThunk("todos/fetchTodos", async () => {
  try {
    // Получаем данные
    const { data: todos } = await axios(SERVER_URL)
    // Возвращаем задачи и сообщение об успехе операции
    return {
      todos,
      message: {
        type: "success",
        text: "Todos has been loaded",
      },
    }
  } catch (err) {
    console.error(err.toJSON())
    // Возращаем сообщение о провале операции
    return {
      message: {
        type: "error",
        text: "Something went wrong. Try again later",
      },
    }
  }
})

// Создаем и экспортируем преобразователь для сохранения задач в БД.
export const saveTodos = createAsyncThunk(
  "todos/saveTodos",
  async (newTodos) => {
    try {
      // Получаем данные - существующие задачи
      const { data: existingTodos } = await axios(SERVER_URL)

      // Перебираем существующие задачи
      for (const todo of existingTodos) {
        // Формируем URL текущей задачи
        const todoURL = `${SERVER_URL}/${todo.id}`

        // Пытаемся найти общую задачу
        const commonTodo = newTodos.find((_todo) => _todo.id === todo.id)

        // Если получилось
        if (commonTodo) {
          // Определяем наличие изменений
          if (
            !Object.entries(commonTodo).every(([key, value]) => {
              return value === todo[key]
            })
          ) {
            // Если изменения есть, обновляем задачу на сервере,
            // в противном случае ничего не делаем
            await axios.put(todoURL, commonTodo)
          }
        } else {
            // Если общая задача отсутствует, удаляем задачу на сервере
            await axios.delete(todoURL)
        }
      }

      // Перебираем новые задачи и сравниваем их с существующими
      for (const todo of newTodos) {
        if (!existingTodos.find((_todo) => _todo.id === todo.id)) {
          // Сохраняем ее на сервере
          await axios.post(SERVER_URL, todo)
        }
      }
      // Возвращаем сообщение об успехе
      return { type: 'success', text: 'Todos has been saved' }
    } catch (error) {
      console.error(error.toJSON())
      // Возвращаем сообщение об ошибке
      return {
        type: 'error',
        text: 'Something went wrong. Try again later'
      }
    }
  }
)

// Создание и экспорт преобразователя для задержки в 2 секунды

export const giveMeSomeTime = createAsyncThunk(
  '',
  async () => {
    await new Promise((resolve) => {
      const timerId = setTimeout(() => {
        resolve()
        clearTimeout(timerId)
      }, 2000)
    })
  }
)

// Создание части состояния для задач

