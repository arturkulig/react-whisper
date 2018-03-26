import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, createReductor, createActor } from '../index'

const Store = createStore(0)
const Reductor = createReductor(
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
            <th>Reductor</th>
            <th>Actor</th>
          </tr>
          <tr>
            <td>
              <button onClick={() => Store.next(1)}>Store.next(1)</button>
            </td>
            <td>
              <button onClick={() => Reductor.next(1)}>Reductor.next(1)</button>
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
                {`const Reductor = createReductor(
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
              <pre>{`<Reductor>{v => 'State: ' + v}</Reductor>`}</pre>
              <Reductor>
                {(v) => <span style={{ fontSize: 30 }}>State: {v}</span>}
              </Reductor>
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
