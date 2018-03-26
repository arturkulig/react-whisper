import * as React from 'react'

export interface StoreProps<T> {
  children?: (value: T, previousValue: T) => React.ReactNode
}

function createStore<V>(defaultState: V) {
  let previousValue: V = null
  let currentValue: V = defaultState
  const instances: Set<Store> = new Set()

  class Store extends React.Component<StoreProps<V>> {
    constructor(props) {
      super(props)
      instances.add(this)
    }

    componentWillUnmount() {
      instances.delete(this)
    }

    static get value() {
      return currentValue
    }

    static set value(nextValue: V) {
      previousValue = currentValue
      currentValue = nextValue
      for (const instance of instances) {
        instance.forceUpdate()
      }
    }

    static next(next: V | ((prev: V) => V)) {
      Store.value = typeof next === 'function' ? next(currentValue) : next
    }

    render() {
      const { children } = this.props
      return children(currentValue, previousValue)
    }
  }

  return Store
}

function createReducer<V, A>(
  defaultState: V,
  reductor: (state: V, action: A) => V
) {
  let previousValue: V = null
  let currentValue: V = defaultState
  const instances: Set<ReducedStore> = new Set()

  class ReducedStore extends React.Component<StoreProps<V>> {
    constructor(props) {
      super(props)
      instances.add(this)
    }

    componentWillUnmount() {
      instances.delete(this)
    }

    static get value() {
      return currentValue
    }

    static set value(nextValue: V) {
      previousValue = currentValue
      currentValue = nextValue
      for (const instance of instances) {
        instance.forceUpdate()
      }
    }

    static next(next: A) {
      ReducedStore.value = reductor(currentValue, next)
    }

    render() {
      const { children } = this.props
      return children(currentValue, previousValue)
    }
  }

  return ReducedStore
}

function createActor<V, MSG>(
  defaultState: V,
  actor: (msgBox: AsyncIterable<MSG>, next: (value: V) => void) => any
) {
  let previousValue: V = null
  let currentValue: V = defaultState
  const instances: Set<ActorStore> = new Set()

  const queue: MSG[] = []
  let releaseDispencer: Function = null

  class ActorStore extends React.Component<StoreProps<V>> {
    constructor(props) {
      super(props)
      instances.add(this)
    }

    componentWillUnmount() {
      instances.delete(this)
    }

    static get value() {
      return currentValue
    }

    static set value(nextValue: V) {
      previousValue = currentValue
      currentValue = nextValue
      for (const instance of instances) {
        instance.forceUpdate()
      }
    }

    static next(next: MSG) {
      queue.push(next)
      if (releaseDispencer) {
        releaseDispencer()
      }
    }

    render() {
      const { children } = this.props
      return children(currentValue, previousValue)
    }
  }

  actor(
    (async function*() {
      while (true) {
        await new Promise((r) => {
          releaseDispencer = r
        })
        while (queue.length) {
          yield queue.splice(0, 1)[0]
        }
      }
    })(),
    (v) => {
      ActorStore.value = v
    }
  )

  return ActorStore
}

export { createStore, createReducer, createActor }
