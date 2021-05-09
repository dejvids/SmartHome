import { render } from '@testing-library/react';
import * as React from 'react';
import './AlertBar.scss';

const AlertBar = (props:any)=> {

    const onRefreshClicked = ()=>{
        props.onRefreshClicked();
    }
    return(
        <div className="alert alert-danger" role="alert">
            <span>Connection lost</span>
            <a className="btn-alert noselect" href="#" onClick={onRefreshClicked}>Refresh</a>
        </div>
    );
}

export default AlertBar;