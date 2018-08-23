import * as React from "react";

export interface StoreProps<T> {
  children?: (value: T, previousValue: T | undefined) => React.ReactNode;
}

function createContainer<VALUE, MSG>(
  containerName: string,
  initialValue: VALUE,
  onMessage: (value: VALUE, msg: MSG) => void
) {
  let previous: { value: VALUE } | null = null;
  let current: { value: VALUE } = { value: initialValue };
  const instances: Array<React.Component<StoreProps<VALUE>>> = [];

  class Container extends React.Component<StoreProps<VALUE>> {
    static get displayName() {
      return containerName;
    }

    static get value() {
      return current.value;
    }

    static set value(nextValue: VALUE) {
      previous = current;
      current = { value: nextValue };
      for (const instance of instances) {
        if (!instance) {
          throw new Error("Whisper expected non-null enlisted");
        }
        if (!instance.forceUpdate) {
          throw new Error("Whisper expected component enlisted");
        }
        instance.forceUpdate();
      }
    }

    constructor(props: StoreProps<VALUE>) {
      super(props);
      instances.push(this);
    }

    componentWillUnmount() {
      instances.splice(instances.indexOf(this), 1);
    }

    static next(action: MSG | ((prev: VALUE) => MSG)) {
      onMessage(
        current.value,
        typeof action === "function" ? action(current.value) : action
      );
    }

    render() {
      const { children } = this.props;
      if (!children) {
        return null;
      }
      if (typeof children !== "function") {
        throw new Error("Container child should be a function");
      }
      return children(current.value, previous ? previous.value : undefined);
    }
  }

  return Container;
}

function createStore<VALUE>(initialValue: VALUE) {
  const Container = createContainer<VALUE, VALUE>(
    "Store",
    initialValue,
    handleMessage
  );

  function handleMessage(value: VALUE, msg: VALUE) {
    Container.value = msg;
  }

  return Container;
}

function createReducer<VALUE, MSG>(
  initialValue: VALUE,
  reductor: (state: VALUE, action: MSG) => VALUE
) {
  const Container = createContainer<VALUE, MSG>(
    "Reducer",
    initialValue,
    handleMessage
  );

  function handleMessage(value: VALUE, msg: MSG) {
    Container.value = reductor(value, msg);
  }

  return Container;
}

function createActor<VALUE, MSG>(
  initialValue: VALUE,
  actor: (msgBox: AsyncIterable<MSG>, next: (value: VALUE) => void) => any
) {
  const queue: MSG[] = [];
  let releaseDispencer: Function | null = null;

  const Container = createContainer<VALUE, MSG>(
    "Actor",
    initialValue,
    handleMessage
  );

  function handleMessage(value: VALUE, msg: MSG) {
    queue.push(msg);
    if (releaseDispencer) {
      releaseDispencer();
    }
  }

  actor(
    (async function*() {
      while (true) {
        await new Promise(r => {
          releaseDispencer = r;
        });
        while (queue.length) {
          yield queue.splice(0, 1)[0];
        }
      }
    })(),
    v => {
      Container.value = v;
    }
  );

  return Container;
}

export { createStore, createReducer, createActor };
