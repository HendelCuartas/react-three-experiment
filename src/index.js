import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.styl';

const App = () => {

    return (
        <div className="Home">
            <p>Hello there!</p>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
);

module.hot.accept();