import { useSelector } from "react-redux"
import { selectTotal } from "./store"
import { New } from './components/Form'
import { Loader } from './components/Loader'
import { Stats } from './components/Stats'
import { Filters } from './components/Filters'
import { List } from './components/List'
import { Controls } from './components/Controls'
import './App.css'

export const App = () => {
  // Получаем общее количество задач
  const total = useSelector(selectTotal)
  // Получаем индикатор загрузки
  const status = useSelector(({ todos }) => todos.status)
  // Получаем сообщение
  const message = useSelector(({ todos }) => todos.message)

  /**
   * Логика рендеринга:
   * - компонент для добавления новой задачи (New) рендерится всегда
   * - если есть сообщение, оно рендерится
   * - если приложение находится в состоянии загрузки (status === 'loading'), рендерится только индикатор
   * - если в массиве есть хотя бы одна задача (total > 0),
   * рендерятся все остальные компоненты, в противном случае,
   * рендерится только кнопка для сохранения задач из компонента `Controls`
   */
  return (
    <div
      className="container d-flex flex-column text-center mt-2 mb-2"
      style={{ maxWidth: "600px" }}
    >
      <h1 className="mb-4">Modern Redux Todo App</h1>
      <New />
      {message.text ? (
        <div
          className={`alert ${
            message.type === 'success' ? 'alert-success' : 'alert-danger'
          } position-fixed top-50 start-50 translate-middle`}
          role="alert"
          style={{zInde: 1}}
        >
          {message.text}
        </div>
      ) : null}
      {status === 'loading' ? (
        <Loader />
      ) : total ? (
        <>
          <Stats />
          <div className="row">
            <Filters />
            <List />
            <Controls />
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-end">
          <Controls />
        </div>
      )}
    </div>
  )
}
