---
title: Follow Redux Official Style Guide
impact: MEDIUM
impactDescription: avoids mutation/side-effect bugs, enables DevTools and maintainability
tags: advanced, redux, state-management, redux-toolkit, nextjs
---

## Follow Redux Official Style Guide

When using Redux, follow the [official Redux Style Guide](https://redux.js.org/style-guide/) Priority A (Essential) and key Priority B rules to prevent bugs and keep state debuggable.

**Essential (Priority A):** Do not mutate state; reducers must have no side effects; do not put non-serializable values in state or actions; use only one Redux store per app.

**Strongly recommended (Priority B):** Use Redux Toolkit (RTK) and Immer for immutable updates; structure by feature with slice files; put logic in reducers; keep state minimal and derive values.

**Incorrect (mutation in reducer, non-serializable state):**

```typescript
// Mutating state breaks re-renders and time-travel debugging
function itemsReducer(state = [], action) {
  if (action.type === 'items/add') {
    state.push(action.payload)
    return state
  }
  return state
}

// Non-serializable values break DevTools and persistence
const store = configureStore({
  reducer: { items: itemsReducer },
  preloadedState: { items: [], cachedPromise: somePromise }
})
```

**Correct (immutable updates, RTK + Immer, serializable state):**

```typescript
import { createSlice } from '@reduxjs/toolkit'

const itemsSlice = createSlice({
  name: 'items',
  initialState: [] as Item[],
  reducers: {
    addItem(state, action) {
      state.push(action.payload) // Immer allows "mutating" draft
    }
  }
})

export const { addItem } = itemsSlice.actions
export default itemsSlice.reducer
```

**Single store, passed via Provider:** One store per app; pass it via `<Provider>`. Avoid importing the store in logic files; use hooks (e.g. `useAppSelector`, `useAppDispatch`) instead.

**With Next.js (App Router):** Do not use a global singleton store. Follow [Redux + Next.js](https://redux.js.org/usage/nextjs): export a `makeStore()` function that returns a new store; in a client `StoreProvider`, create the store once with `useRef` and `makeStore()` so it is per-request safe on the server and stable on the client. Export pre-typed hooks (`useAppDispatch`, `useAppSelector`, `useAppStore`) from e.g. `lib/hooks.ts` and use those in client components instead of plain `useDispatch`/`useSelector`.

Reference: [Redux Style Guide](https://redux.js.org/style-guide/), [Redux Toolkit Setup with Next.js](https://redux.js.org/usage/nextjs)
