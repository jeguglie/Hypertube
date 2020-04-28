import axios from "axios";
const headers = { 'Content-Type': 'application/json' };
const server_port = process.env.REACT_APP_SERVER_PORT;
const burl = process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production' ? `http://localhost:${server_port}/api`: `https://hypertube.jv-g.fr/api`;

export default {
    withAuth: () => {
        return axios.get(
            `${burl}/users/checkToken`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    register: (firstname, lastname, email, username, password, password_confirm) => {
        return axios.post(
            `${burl}/users/register`,
            {firstname, lastname, email, username, password, password_confirm},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    login: (username, password) => {
        return axios.post(
            `${burl}/users/login`,
            {username, password},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    logout: () => {
        return axios.get(
            `${burl}/users/logout`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    stream: (stream, quality, imdb_id) => {
        return axios.get(
            `${burl}/movies/${stream}/${quality}/${imdb_id}`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    getMovieSources: (imdb_id) => {
        return axios.get(
            `${burl}/movies/${imdb_id}`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    facebookAuth: () => {
        window.location.href = `${burl}/auth/facebook/callback`
        /* return axios.get(
            `${burl}/auth/facebook`,
            {
                headers: headers
            }
        ) */
    },
    fortyTwoAuth: () => {
        window.location.href = `${burl}/auth/42/callback`
        /* return axios.get(
            `${burl}/auth/facebook`,
            {
                headers: headers
            }
        ) */
    },
    getWatchlist: () => {
        return axios.get(
            `${burl}/watchlist`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getHistory: () => {
        return axios.get(
            `${burl}/history`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    likeWatchlist: (movieID) => {
        return axios.get(
            `${burl}/movies/${movieID}/watchlist`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getComments: (movieID) => {
        return axios.get(
            `${burl}/infos/${movieID}`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    addComment: (movieID, comment) => {
        return axios.post(
            `${burl}/comment/${movieID}`,
            {comment},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    deleteComment: (movieID, commentID) => {
        return axios.get(
            `${burl}/delete/comment/${movieID}/${commentID}`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getUserProfile: () => {
        return axios.get(
            `${burl}/users`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getUserProfilePublic: (username) => {
        return axios.get(
            `${burl}/users/${username}`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    updateUserProfil: (firstname, lastname, username, email, password, passwordconfirm, defaultImg, editPassword) => {
        return axios.post(
            `${burl}/user/update`,
            {firstname, lastname, username, email, password, passwordconfirm, defaultImg, editPassword},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    updatePicture: (formData, token) => {
        return axios.post(
            `${burl}/picture/add/${token}`,
            formData,
            {
                headers: headers
            }
        )
    },
    activeAccount: (token) => {
        return axios.get(
            `${burl}/users/active/${token}`,
            { headers: headers }
        )
    },
    resetPassword: (token, password, password_confirm, username) => {
        return axios.post(
            `${burl}/users/reset/${token}`,
            {token, password, password_confirm, username},
            { headers: headers }
        )
    },
    sendResetMail: (email) => {
        return axios.post(
            `${burl}/users/reset/send`,
            {email},
            { headers: headers }
        )
    },
    resendMail: (username) => {
        return axios.post(
            `${burl}/users/active/resend`,
            {username},
            { headers: headers }
        )
    },
}
