// this custom we are adding just to run a callback once the state has been updated

import { useCallback, useEffect, useRef, useState } from "react"

export const useStateWithCallBack = (initialState) => {

    const [state, setState] = useState(initialState);

    const cbRef = useRef(); // using this to prevent unnecessary re-render
    
    // using useCallback hook to prevent re-creation of the function
    const updateState = useCallback((newState, cb)=>{
        cbRef.current = cb; 

        setState((prevState)=>{
            return typeof newState === 'function' ? newState(prevState) : newState;
        })
    }, [])

    useEffect(()=>{
        if(cbRef.current){
            cbRef.current(state) // calling the callback(which we'd stored in cbRef reference variable) after the state has been updated
            cbRef.current = null; // after calling the callback make the reference to null
        }
    }, [state])

    return [state, updateState];
}