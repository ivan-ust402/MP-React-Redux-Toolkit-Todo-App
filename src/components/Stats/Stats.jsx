import React from "react"
import { useSelector } from "react-redux"
import { selectTodoStats } from "../../store"

export const Stats = () => {
  const stats = useSelector(selectTodoStats)

  /**
   * Логика рендеринга:
   * - перебираем ключи и формируем с их помощью колонки-заголовки (выполняем "капитализацию" ключей)
   * - перебираем значения и формируем с их помощью обычные колонки
   */
  return (
    <div className="row">
      <h3>Statistics</h3>
      <table className="table text-center">
        <thead>
          <tr>
            {Object.keys(stats).map(([first, ...rest], index) => (
              <th scope="col" key={index}>
                {`${first.toUpperCase()}${rest.join('').toLowerCase()}`}
              </th>
            ))}
          </tr>
          <tr>
            {Object.values(stats).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  )
}
