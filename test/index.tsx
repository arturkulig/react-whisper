import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, createReducer, createActor } from '../index'

const Store = createStore(0)
const Reducer = createReducer(
  0,
  (state: number, action: number) => state + action
)
const Actor = createActor(0, async (msgs, next) => {
  let t = Date.now()

  for await (const msg of msgs) {
    next(Date.now() - t)
    t = Date.now()
  }
})

class App extends React.Component {
  render() {
    return (
      <div className="flex column">
        <table>
          <tr>
            <th>Store</th>
            <th>Reducer</th>
            <th>Actor</th>
          </tr>
          <tr>
            <td>
              <button onClick={() => Store.next(1)}>Store.next(1)</button>
            </td>
            <td>
              <button onClick={() => Reducer.next(1)}>Reducer.next(1)</button>
            </td>
            <td>
              <button onClick={() => Actor.next(1)}>Actor.next(1)</button>
            </td>
          </tr>
          <tr>
            <td>
              <pre>const Store = createStore(0)</pre>
            </td>
            <td>
              <pre>
                {`const Reducer = createReducer(
  0,
  (state: number, action: number) => state + action
)`}
              </pre>
            </td>
            <td>
              <pre>{`const Actor = createActor(0, async (msgs, next) => {
  let t = Date.now()

  for await (const msg of msgs) {
    next(Date.now() - t)
    t = Date.now()
  }
})`}</pre>
            </td>
          </tr>

          <tr>
            <td>
              <pre>{`<Store>{v => 'State: ' + v}</Store>`}</pre>
              <Store>
                {(v) => <span style={{ fontSize: 30 }}>State: {v}</span>}
              </Store>
            </td>
            <td>
              <pre>{`<Reducer>{v => 'State: ' + v}</Reducer>`}</pre>
              <Reducer>
                {(v) => <span style={{ fontSize: 30 }}>State: {v}</span>}
              </Reducer>
            </td>
            <td>
              <pre>{`<Actor>{v => 'State: ' + v}</Actor>`}</pre>
              <Actor>
                {(v) => <span style={{ fontSize: 30 }}>State: {v}</span>}
              </Actor>
            </td>
          </tr>
        </table>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
