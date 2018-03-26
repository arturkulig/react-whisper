# React Render Prop Store

React and TypeScript -enabled shared state distributors leveraging `render prop` pattern for ease of access to data.

> type annotations in examples are TypeScript feature. TypeScript is optional, but recommended.

## Install

```bash
npm i react-rp-store
```

## Store

This one is most basic. It is **just** a state distributor.

### Create Store
```tsx
import { createStore } from 'react-rp-store'
const Store = createStore<number>(0)
```

### Read Store

```tsx
const StoreAsString = () => <Store>{value => value.toString()}</Store>
```

### Write to Store

```tsx
const newValue = 5
Store.next(newValue)
```

## Reducer

This quite close to what reducer in Redux is. You provide it with values that are not directly put to storage, but *reduced* and then broadcasted.

### Create Reducer
```tsx
import { createReducer } from 'react-rp-store'
const Reducer = createReducer<number, { op: 'add' | 'mult', value: number }>(
    0,
    (state, { op, value }) => ({ add: state + value, mult: state * value}[op])
)
```

### Read Reducer

```tsx
const ReducerAsString = () => <Reducer>{value => value.toString()}</Reducer>
```

### Write to Reducer

```tsx
const newValue = 5
Reducer.next({ op: 'add', value: newValue })
```

## Actor

This is an asynchronous reducer for most advanced usages. Get a message and release new state.
There is no requirement that amount of incoming and outgoing messages must match.

To make it easier to understand, example is as synchronous as possible.

### Create Actor
```tsx
import { createActor } from 'react-rp-store'
const Actor = createActor<number, { op: 'add' | 'mult', value: number }>(
    0,
    async (mailbox, next) => {
        let state = 0
        for await (const { op, value } of mailbox) {
            next(state = ({ add: state + value, mult: state * value }[op]))
        }
    }
)
```

### Read Actor

```tsx
const ActorAsString = () => <Actor>{value => value.toString()}</Actor>
```

### Write to Actor

```tsx
const newValue = 5
Actor.next({ op: 'add', value: newValue })
```