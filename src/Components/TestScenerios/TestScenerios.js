import React from 'react';

import classes from './TestScenerios.css';
import TestScenerio from './TestScenerio/TestScenerio';
import Aux from '../../hoc/Auxilary';

const testScenerios = (props) => {
    console.log(props.list);
    let negativeTitle = null;
    let testCaseTitle = null;

    let scenerios = props.list.filter(f => {
        return f.required === "M"
    }).map((s, idx) => {
        return <li key={idx}><TestScenerio field={s}/></li>
    })

    if(scenerios.length > 0) {
        negativeTitle = <h4> NEGATIVE </h4>;
        testCaseTitle = <h5> TEST CASES </h5>
    }

    return (
        <Aux>
            {testCaseTitle}
            <small className={classes.TestScenerios}>
                {negativeTitle}
                <ul>
                    {scenerios}
                </ul>
            </small>
        </Aux>
    )
}

export default testScenerios;