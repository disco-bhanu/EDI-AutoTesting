import React from 'react';
import classes from './Notifier.css';

class Notifier extends React.Component {

    constructor(props) {
        super(props);
        this.state = {show: true}
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState(state => ({
            show: !state.show
        }));
    }

    render() {

        return (
            <div>
            { this.state.show ? (
            <div className={classes.overlay}>
                <div className={classes.alert}>
                    <strong> Invalid </strong>
                    <span className={classes.close} onClick={this.onClick}>&times;</span>
                </div>
            </div>) : ('')
            }
            </div>
        )
    }

}

export default Notifier;