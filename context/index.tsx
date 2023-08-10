import React, {createContext, useContext, useReducer} from 'react';
import {reducer} from './reducer';

const initialState = {
  auth: false,
  profile: null,
};

export const Context = createContext(initialState as any);

export const ContextProvider = ({children}: any) => (
  <Context.Provider value={useReducer(reducer, initialState)}>
    {children}
  </Context.Provider>
);

export const useStateValue = () => useContext(Context);
