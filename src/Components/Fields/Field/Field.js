import React from 'react';

import classes from './Field.css';

import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
        execute: state.executeTestRun
    }
}

const field = (props) => {

    let mandatoryCheck = null;
    let conditionalCheck = null;

    switch(props.field.required) {
        case "M":
            mandatoryCheck = <input type="checkbox" defaultChecked/>;
            break;
        case "O":
        case "X":
            conditionalCheck = <input type="checkbox" defaultChecked/>;
            break;
        default:
    }

    if(props.execute){
        switch(props.field.required) {
            case "M":
                mandatoryCheck = 'checking';
                conditionalCheck = null;
                break;
            case "O":
            case "X":
                conditionalCheck = 'checking';
                mandatoryCheck = null;
                break;
            default:
        }
    }
    return (
        <div className={classes.Field}>
            <span style={{width: "50%"}}>{props.field.name} - {props.field.desc}</span>
            <span style={{width: "15%"}}>{props.field.required}</span>
            <span style={{width: "15%"}}>{props.field.datatype}</span>
            <span style={{width: "15%"}}>{props.field.limit}</span>
            <span style={{width: "20%"}}>{mandatoryCheck}</span>
            <span style={{width: "20%"}}>{conditionalCheck}</span>
        </div>
    )
}

export default connect(mapStateToProps)(field);