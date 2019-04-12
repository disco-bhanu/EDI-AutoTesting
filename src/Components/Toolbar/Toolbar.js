import React from 'react';
import classes from './Toolbar.css';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <h3>Toolbar</h3>
            <nav>
                <ul>
                    <li> <a href="/">Logout</a> </li>
                </ul>
            </nav>
        </header>
    )
}

export default toolbar;