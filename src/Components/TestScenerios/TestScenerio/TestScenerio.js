import React from 'react';

import classes from './TestScenerio.css';

const testScenerio = (props) => {
    return (
        <div className={classes.TestScenerio}>
            <span style={{width: "2%"}}>
                <input type="checkbox" defaultChecked onChange={(e) => onChangeHandler(e)}/>
            </span>
            <span style={{width: "15%"}}>Missing {props.field.name} field</span>
        </div>
    )
}

let onChangeHandler = (e) => {
    console.log(e.target.checked)
}
export default testScenerio;