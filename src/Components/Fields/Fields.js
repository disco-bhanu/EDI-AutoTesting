import React from 'react';

import classes from './Fields.css';
import Field from './Field/Field.js';

let segCounter = 0;

const fields = (props) => {
    segCounter++;
    const fieldslist =  props.fields.map((f, idx) => {
        return <li key={f.name + '_' + segCounter}><Field field={f}></Field></li>
    })

    return (
        <div className={classes.Fields}>
        <small>
            <ul>
                <li style={{backgroundColor: "rgba(0, 0, 0, 0.03)"}}>
                    <span style={{width: "50%", fontWeight: 600}}>FIELD NAME</span>
                    <span style={{width: "15%", fontWeight: 600}}>REQUIRED</span>
                    <span style={{width: "15%", fontWeight: 600}}>DATATYPE</span>
                    <span style={{width: "15%", fontWeight: 600}}>MIN/MAX</span>
                    <span style={{width: "20%", fontWeight: 600}}>MANDATORY TEST</span>
                    <span style={{width: "20%", fontWeight: 600}}>CONDITIONAL TEST</span>
                </li>
                {fieldslist}
            </ul>
            </small>
        </div>
    )
}

export default fields;