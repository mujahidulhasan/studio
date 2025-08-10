
"use client";

import { useState, useCallback, useRef } from 'react';

type HistoryState<T> = {
    past: T[];
    present: T;
    future: T[];
}

export function useHistoryState<T>(initialState: T): [T, (newState: T | ((prevState: T) => T)) => void, { undo: () => void, redo: () => void, canUndo: boolean, canRedo: boolean }] {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        if (canUndo) {
            setState((currentState) => {
                const newFuture = [currentState.present, ...currentState.future];
                const newPresent = currentState.past[currentState.past.length - 1];
                const newPast = currentState.past.slice(0, currentState.past.length - 1);
                return {
                    past: newPast,
                    present: newPresent,
                    future: newFuture,
                };
            });
        }
    }, [canUndo]);

    const redo = useCallback(() => {
        if (canRedo) {
            setState((currentState) => {
                const newPast = [...currentState.past, currentState.present];
                const newPresent = currentState.future[0];
                const newFuture = currentState.future.slice(1);
                return {
                    past: newPast,
                    present: newPresent,
                    future: newFuture,
                };
            });
        }
    }, [canRedo]);

    const set = useCallback((newState: T | ((prevState: T) => T)) => {
        setState((currentState) => {
            const resolvedState = typeof newState === 'function' ? (newState as (prevState: T) => T)(currentState.present) : newState;
            
            // If the new state is the same as the present, do nothing.
            if (resolvedState === currentState.present) {
                return currentState;
            }

            const newPast = [...currentState.past, currentState.present];
            return {
                past: newPast,
                present: resolvedState,
                future: [],
            };
        });
    }, []);

    return [state.present, set, { undo, redo, canUndo, canRedo }];
}
