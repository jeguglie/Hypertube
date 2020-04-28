import React from 'react';
import { Redirect } from 'react-router-dom';
import API from './API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

// Middleware who check if cookies exists, then call API.withAuth for check token server side
// If API return 200, return component else redirect to /login

function withAuth(ComponentToProtect) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true,
                redirect: false,
            };
            this._mounted = false;
        }

        componentWillUnmount() { this._mounted = false }
        componentDidMount() {
            this._mounted = true;
            if (cookies.get('token')) {
                API.withAuth()
                    .then(res => {
                        if (res.status === 200) this._mounted && this.setState({loading: false});
                        else throw new Error(res.error);
                    })
                    .catch(() => {
                        this._mounted && this.setState({loading: false, redirect: true})
                    });
            }
            else this._mounted && this.setState({loading: false, redirect: true});
        }
        render () {
            const { loading, redirect } = this.state;
            if (loading)
                return null;
            if (redirect)
                return <Redirect to="/login" />;
            return <ComponentToProtect {...this.props} />
        }
    }
}

export default withAuth;

