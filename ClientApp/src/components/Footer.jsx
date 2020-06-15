import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';


export class Footer extends Component {
    render() {
        return (
            <Segment>
                <div className="row">
                    <div className="column"><footer id="footer"><b>&copy;  - Resmi Jose</b></footer></div>
                </div>
            </Segment>
            )
    }
}