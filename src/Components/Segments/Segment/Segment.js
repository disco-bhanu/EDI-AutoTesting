import React from 'react';
import classes from './Segment.css';
import Fields from '../../Fields/Fields';
//import TestScenerios from '../../TestScenerios/TestScenerios';

const segment = (props) => {
    //let seg = props.segment;
    return (
        <div className={classes.Segment} draggable>
            <h5>{props.segment.name} - {props.segment.description}</h5>
            <hr />
            <Fields fields={props.segment.list}></Fields>
            <section>
            { /* <TestScenerios list={props.segment.list}/> */}
            </section>
        </div>
    )
}

export default segment;