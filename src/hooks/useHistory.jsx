import { useReducer, useEffect, useCallback, useState } from 'react';
import useDebounce from '../hooks/useDebounce';

const reducer = (state, action) => {
  switch (action.type) {
    case 'undo': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'redo': {
      if (state.future.length === 0) return state;

      const future = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: future,
        future: newFuture,
      };
    }
    case 'set_new_text': {
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    }
    default:
      return state;
  }
};

const useHistory = () => {
  const [userInteracted, setUserInteracted] = useState(false);
  const initialPresent = localStorage.getItem('raw_text') || '';
  const [state, dispatch] = useReducer(reducer, {
    past: [],
    present: initialPresent,
    future: [],
  });

  const { debouncedValue } = useDebounce(state.present);

  const saveToLocalStorage = useCallback(value => {
    localStorage.setItem('raw_text', value);
  }, []);

  useEffect(() => {
    if (debouncedValue == null) return;
    if (!userInteracted && debouncedValue.trim() === '') return;
    saveToLocalStorage(debouncedValue);
  }, [debouncedValue, saveToLocalStorage]);

  const undo = () => {
    setUserInteracted(true);
    dispatch({ type: 'undo' });
  };
  const redo = () => {
    setUserInteracted(true);
    dispatch({ type: 'redo' });
  };

  const setText = payload => {
    setUserInteracted(true);
    dispatch({ type: 'set_new_text', payload });
  };

  return {
    ...state,
    undo,
    redo,
    setText,
  };
};

export default useHistory;
