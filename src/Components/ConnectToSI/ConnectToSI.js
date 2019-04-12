import React from 'react';
import axios from 'axios';
import classes from './ConnectToSI.css';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';

function mapDispatchToProps(dispatch) {
    return {
        execute: () => dispatch(actions.executeTest())
    }
}

class ConnectToSI extends React.Component {

    form = new FormData();

    constructor(props) {
        super(props);

        this.state = {
            pdf: {
                filename: null,
                upload: null
            },
            txo: {
                filename: null,
                upload: null
            },
            data: {
                filename: null,
                upload: null
            },
            password: null
        }
    }

    onExecuteTestCasesHandler() {
        if(this.state.pdf.filename !== null && this.state.txo.filename !== null && this.state.data.filename !== null) {
            this.props.execute();
        } else {
            alert('Please upload files before proceeding further.')
        }
    }

    onUploadHandler() {
        axios.post('http://localhost:8080/upload', this.form)
        .then(res=> {
            console.log(res);
            this.props.data(res.data);
        })
        .catch(err => {
            console.log(err)
        }) 
    }

    onChangeHandler = (e) => {
        console.log(e.target);
        switch(e.target.name) {
            case "pdf":
                this.setState({ pdf: { filename: e.target.files[0].name, upload: false} });
                this.form.set('pdf', e.target.files[0]);
                this.form.set('filename', e.target.files[0].name);
                //this.onUploadHandler(form);
                break;
            case "txo":
                this.setState({ txo: { filename: e.target.files[0].name, upload: false} });
                this.form.set('txo', e.target.files[0]);
                this.form.set('txo_filename', e.target.files[0].name);
                //this.onUploadHandler(form);
                break;
            case "test":
                this.setState({ data: { filename: e.target.files[0].name, upload: false} });
                this.form.set('data', e.target.files[0]);
                this.form.set('data_filename', e.target.files[0].name);
                //this.onUploadHandler(form);
                break;
            default:
                console.log("Nothing");
        }
    }

    render() {
        return (
            <div className={classes.ConnectToSI} >
                <h5> UPLOAD FILES </h5>
                <hr/>
                <small>
                    <ul>
                        <li>
                            <input type="file" name="pdf" id="pdf" accept=".pdf" onChange={(e) => this.onChangeHandler(e)}/>
                            <label htmlFor="pdf" className={classes.UploadButton}>Browse PDF file </label>
                            <span>{this.state.pdf.filename}</span>
                            <span style={{flex: '1 1 auto'}}></span>
                            <span className={
                                this.state.pdf.upload !== null ? 
                                    this.state.pdf.upload ? classes.UploadSuccess : classes.UploadProgress : '' }
                            >{
                                this.state.pdf.upload !== null ? 
                                    this.state.pdf.upload ? 'Success' : 'Inprogress.' : ''                                 
                            }</span>
                        </li>
                        <li>
                            <input type="file" name="txo" id="txo" accept=".txo" onChange={(e) => this.onChangeHandler(e)}/>
                            <label htmlFor="txo" className={classes.UploadButton}>Browse TXO file </label>
                            <span>{this.state.txo.filename}</span>
                            <span style={{flex: '1 1 auto'}}></span>
                            <span className={
                                this.state.txo.upload !== null ? 
                                    this.state.txo.upload ? classes.UploadSuccess : classes.UploadProgress : '' }
                            >{
                                this.state.txo.upload !== null ? 
                                    this.state.txo.upload ? 'Success' : 'Inprogress.' : ''                                 
                            }</span>
                        </li>
                        <li>
                            <input type="file" name="test" id="test" accept=".txt,.data,.doc,.docx" onChange={(e) => this.onChangeHandler(e)}/>
                            <label htmlFor="test" className={classes.UploadButton}>Browse Test Data file </label>
                            <span>{this.state.data.filename}</span>
                            <span style={{flex: '1 1 auto'}}></span>
                            <span className={
                                this.state.data.upload !== null ? 
                                    this.state.data.upload ? classes.UploadSuccess : classes.UploadProgress : '' }
                            >{
                                this.state.data.upload !== null ? 
                                    this.state.data.upload ? 'Success' : 'Inprogress.' : ''                                 
                            }</span>
                        </li>
                    </ul>
                </small>
                <strong className={classes.Actions}>
                    <span style={{flex: '1 1 auto'}}></span>
                    <button type="button" onClick={() => this.onUploadHandler()}> Upload </button>
                    <button type="button" onClick={() => this.onExecuteTestCasesHandler()}> Generate Test Cases </button>
                </strong>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(ConnectToSI);