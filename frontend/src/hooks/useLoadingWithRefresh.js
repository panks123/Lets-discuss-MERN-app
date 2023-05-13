import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export const useLoadingWithRefresh = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        // an IIFE
        (async function () {
            try {
                // const { data } = await axios.get('http://localhost:5500/api/refresh', {
                const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh`, {
                    withCredentials: true
                })
                // console.log(data)
                // set the data to store
                dispatch(setAuth(data));
                // set loading to false now to stop loading indicator
                setLoading(false)
            }
            catch (err) {
                console.log(err.message)
                setLoading(false)
            }
        })()
        // eslint-disable-next-line
    }, [])

    return {loading}
}

