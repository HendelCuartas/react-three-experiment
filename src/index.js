import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.styl';
import ThreeScene from './threeScene';

class App extends React.Component {
    constructor(props){
        super(props);
        // logo container
        this.title = null;
    }

    render() {
        return (
            <div className="Home">
                <ThreeScene></ThreeScene>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
);

module.hot.accept();