import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { rootReducer, rootMiddleware, sagaMiddleware, rootSaga } from './features';

export const store = configureStore({
  reducer: rootReducer,
  middleware: rootMiddleware,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

sagaMiddleware.run(rootSaga);
