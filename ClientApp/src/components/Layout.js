import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu.jsx';
import { Footer } from './Footer.jsx';


export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <Container>
          {this.props.children}
            </Container>
            <Footer/>
            
      </div>
    );
  }
}
