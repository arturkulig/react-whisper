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
          <tbody>
            <tr>
              <th style={{ width: '30%' }}>Store</th>
              <th style={{ width: '30%' }}>Reducer</th>
              <th style={{ width: '30%' }}>Actor</th>
            </tr>

            <tr>
              <td>
                <p>what's send to store is broadcasted though the store</p>
              </td>
              <td>
                <p>
                  given current state and sent message conclude new store state
                </p>
              </td>
              <td>
                <p>
                  given a stream of messages you can update store whenever you
                  wish
                </p>
              </td>
            </tr>

            <tr>
              <th colSpan={3} className="section">
                Instantiation
              </th>
            </tr>

            <tr>
              <td>
                <pre>{`import {
  createStore
} from 'react-whisper'

const initialValue = 0
const Store = createStore(
  initialValue
)`}</pre>
              </td>
              <td>
                <pre>
                  {`import {
  createReducer
} from 'react-whisper'

const initialValue = 0
const Reducer = createReducer(
  initialValue,
  (state, action) => state + action
)`}
                </pre>
              </td>
              <td>
                <pre>{`import {
  createActor
} from 'react-whisper'

const initialValue = 0
const Actor = createActor(
  initialValue,
  async (msgs, next) => {
    let t = Date.now()

    for await (const m of msgs) {
      next(Date.now() - t)
      t = Date.now()
    }
  }
)`}</pre>
              </td>
            </tr>

            <tr>
              <th colSpan={3} className="section">
                Reading from container
              </th>
            </tr>

            <tr>
              <td>
                <pre>{`<Store>
  {v => 'State is now' + v}
</Store>`}</pre>
                <Store>
                  {(v) => <span className="state">State is now {v}</span>}
                </Store>
              </td>
              <td>
                <pre>{`<Reducer>
  {v => 'State is reduced to ' + v}
</Reducer>`}</pre>
                <Reducer>
                  {(v) => (
                    <span className="state">State is reduced to {v}</span>
                  )}
                </Reducer>
              </td>
              <td>
                <pre>{`<Actor>
  {v =>
    v +
    'ms since last update'
  }
</Actor>`}</pre>
                <Actor>
                  {(v) => (
                    <span className="state">{v} ms since last update</span>
                  )}
                </Actor>
              </td>
            </tr>

            <tr>
              <th colSpan={3} className="section">
                Modyfing a container
              </th>
            </tr>

            <tr>
              <td>
                <button
                  onClick={() => Store.next(1)}
                >{`( ) => Store.next(1)`}</button>
              </td>
              <td>
                <button
                  onClick={() => Reducer.next(1)}
                >{`( ) => Reducer.next(1)`}</button>
              </td>
              <td>
                <button
                  onClick={() => Actor.next(1)}
                >{`( ) => Actor.next(1)`}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
