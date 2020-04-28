import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer/Footer';

ReactDOM.render(
    <BrowserRouter>
            <App />
            <Footer />
    </BrowserRouter>, document.getElementById('root')

);