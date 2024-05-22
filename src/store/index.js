import {
  configureStore,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"

import axios from "axios"

const SERVER_URL = "http://localhost:4000/todos"

// Функция для имитации задержки в две секунды
const simulateDelay = async (fn) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return fn();
}

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
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  try {
    // Получаем данные
    const { data: todos } = await simulateDelay(() => axios(SERVER_URL))
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
      const { data: existingTodos } = await simulateDelay(() => axios(SERVER_URL))

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
            await simulateDelay(() => axios.put(todoURL, commonTodo))
          }
        } else {
          // Если общая задача отсутствует, удаляем задачу на сервере
          await simulateDelay(() => axios.delete(todoURL))
        }
      }

      // Перебираем новые задачи и сравниваем их с существующими
      for (const todo of newTodos) {
        if (!existingTodos.find((_todo) => _todo.id === todo.id)) {
          // Сохраняем ее на сервере
          await simulateDelay(() => axios.post(SERVER_URL, todo))
        }
      }
      // Возвращаем сообщение об успехе
      return { type: "success", text: "Todos has been saved" }
    } catch (error) {
      console.error(error.toJSON())
      // Возвращаем сообщение об ошибке
      return {
        type: "error",
        text: "Something went wrong. Try again later",
      }
    }
  }
)

// Создание и экспорт преобразователя для задержки в 2 секунды
export const giveMeSomeTime = createAsyncThunk("", async () => {
  await new Promise((resolve) => {
    const timerId = setTimeout(() => {
      resolve()
      clearTimeout(timerId)
    }, 2000)
  })
})

// Создание части состояния для задач
const todoSlice = createSlice({
  name: "todos",
  // Начальное состояние в виде нормализованной структуры
  initialState: initialTodoState,
  // Обычные редьюсеры
  reducers: {
    // Для добавления задачи
    addTodo: todoAdapter.addOne,
    // Для обновления задачи
    updateTodo: todoAdapter.updateOne,
    // Для удаления задачи
    removeTodo: todoAdapter.removeOne,
    // Для завершения всех активных задач
    completeAllTodos(state) {
      Object.values(state.entities).forEach((todo) => (todo.done = true))
    },
    // Для удаления всех завершенных задач
    clearCompletedTodos(state) {
      const completedTodosIds = Object.values(state.entities)
        .filter((todo) => todo.done)
        .map((todo) => todo.id)
      todoAdapter.removeMany(state, completedTodosIds)
    },
  },
  // Дополнительные редьюсеры для обработки результатов асинхронных операций
  extraReducers: (builder) => {
    builder
      //  Запрос на получение задач от сервера находится в процессе выполнения
      .addCase(fetchTodos.pending, (state) => {
        // Обновляем индикатор загрузки
        state.status = "loading"
      })
      // Запрос выполнен
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        if (payload.todos) {
          // Обновление состояние задач
          todoAdapter.setAll(state, payload.todos)
          // Записываем сообщение
          state.message = payload.message
          // Обновляем индикатор загрузки
          state.status = "idle"
        }
      })

      // Запрос на сохранение задач в БД находится в процессе выполнения
      .addCase(saveTodos.pending, (state) => {
        // Обновляем индикатор загрузки
        state.status = "loading"
      })
      // Запрос выполнен
      .addCase(saveTodos.fulfilled, (state, { payload }) => {
        // Записываем сообщение 
        state.message = payload
        // Обновляем индикатор загрузки
        state.status = 'idle'
      })

      // Запрос на задержку в 2 секунды выполнен
      .addCase(giveMeSomeTime.fulfilled, (state) => {
        // Очищаем сообщение
        state.message = {}
      })

  },
})

// Экспортируем операции для работы с задачами
export const {
  addTodo,
  updateTodo,
  removeTodo,
  completeAllTodos,
  clearCompletedTodos
} = todoSlice.actions

// Определяем начальное состояние, часть состояния для фильтра и экспортируем операцию для работы с ним
const initialFilterState = {
  status: 'all'
}

// Часть состояния для фильтра
const filterSlice = createSlice({
  // Наименование
  name: 'filter',
  // Начальное состояние
  initialState: initialFilterState,
  // Обычные редьюсеры
  reducers: {
    // Для установки фильтра 
    setFilter(state, action) {
      state.status = action.payload
    }
  }
})

// Экспортируем операцию для установки фильтра
export const { setFilter } = filterSlice.actions

// Создаем и экспортируем селекторы
// Встроенные селекторы для выборки всех задач и общего количества задач
export const { selectAll, selectTotal } = todoAdapter.getSelectors(
  (state) => state.todos
)

// Кастомный селектор для выборки задач на основе текущего состояния фильтра
export const selectFilteredTodos = createSelector(
  // встроенный селектор
  selectAll,
  // Селектор для выборки значения фильтра
  (state) => state.filter,
  // Функция для вычичления конечного результата
  (todos, filter) => {
    const { status } = filter
    // Значением фильтра может быть "all", "active" или "completed"
    // в принципе, возможные значения фильтра можно определить в виде констант
    if (status === 'all') return todos
    return status === 'active'
      ? todos.filter((todo) => !todo.done) 
      : todos.filter((todo) => todo.done)
  }
)

// Селектор для выборки статистики
export const selectTodoStats = createSelector(
  // встроенный селектор
  selectAll,
  // встроенный селектор
  selectTotal,
  // Функция для вычисления конечного результата
  (todos, total) => {
    // Нас интересует общее количество, количество активных и количество
    // завершенных задач, а также процент активных задач
    const completed = todos.filter(( todo ) => todo.done).length
    const active = total - completed
    const percent = total === 0 ? 0 : Math.round((active / total) * 100)

    return {
      total, 
      completed,
      active,
      percent
    }
  }
)

// Создаем и экспортируем хранилище
export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,
    filter: filterSlice.reducer
  }
}) 