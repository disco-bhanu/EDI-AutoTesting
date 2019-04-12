import React from 'react';
import Segment from './Segment/Segment';
//import testsegments from './edi.json';

const segments = (props) => {
    console.log("Segments......");
    console.log(props.data)
    return props.data.map((seg, idx) => {
        if(seg.name !== 'ISA' && seg.name !== 'GS' && seg.name !== 'ST' && seg.name !== 'IEA' && seg.name !== 'GE' && seg.name !== 'SE') {
            return (
                <Segment key={idx} segment={seg}/>
            )
        } else {
            return null;
        }
    })
}

export default segments;