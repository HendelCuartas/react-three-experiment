import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.styl';
import { TweenMax, Power2 } from "gsap/all";

class App extends React.Component {
    constructor(props){
        super(props);
        // logo container
        this.title = null;
    }

    componentDidMount(){
        TweenMax.fromTo(this.title, 0.5, {opacity: 0, y: -40}, {opacity: 1, y: 0, ease: Power2.easeIn})
    }

    render() {
        return (
            <div className="Home">
                <h1 ref={ h1 => this.title = h1 }>Hello there!</h1>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
);

module.hot.accept();