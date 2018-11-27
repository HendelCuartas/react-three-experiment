import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.styl';
import { TweenMax } from "gsap/all";

class App extends React.Component {
    constructor(props){
        super(props);
        // logo container
        this.title = null;
    }

    componentDidMount(){
        TweenMax.fromTo(this.title, 0.5, {opacity: 0, y: -40}, {opacity: 1, y: 0})
    }

    render() {
        return (
            <div className="Home">
                <p ref={ p => this.title = p }>Hello there!</p>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
);

module.hot.accept();