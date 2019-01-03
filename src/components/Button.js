import React from 'react';
import '../styles/Button.styl';

class Button extends React.Component {

    onClick = (e) => {
        this.btn.classList.toggle('Button-active');
        this.props.btnClicked(this.props.name);
    }
    render() {
        return (
            <div
                className="Button"
                ref={(btn) => { this.btn = btn }}
                onClick={this.onClick}
                style={{ top: `${this.props.top}%`, left: `${this.props.left}%` }}
            >
                <h1>{ this.props.name }</h1>
            </div>
        );
    }
}

export default Button;
