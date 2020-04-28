import { useState, useEffect } from 'react';
import API from './../../utils/API';
import {store} from "react-notifications-component";


export default function ForgotPassword(props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        function activeAccount() {
            API.activeAccount(props.match.params.token)
                .then((res=> {
                    if (res.status === 200) {
                        store.addNotification({
                            message: "Your account was successfully activated",
                            insert: "top",
                            type: 'success',
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                        props.history.push('/');
                    }
                    else
                        store.addNotification({
                            message: "An error occurred with the token",
                            insert: "top",
                            type: 'success',
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });
                }));
            props.history.push('/')
        }
        if (!mounted && props && props.match.params && props.match.params.token){
            activeAccount();
            setMounted(true);
        }
    }, [props, mounted]);

    return null;
}