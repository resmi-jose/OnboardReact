import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import './NavMenu.css';
export class NavMenu extends Component {
render () {
    return (
        <Segment inverted>
            <Menu inverted pointing secondary>
                <Menu.Item as={NavLink} exact to='/'
                    name='home'
                />
                
                <Menu.Item as={NavLink} to='/customer'
                    name='customer'
                />
                <Menu.Item as={NavLink} to='/product'
                    name='product'
                />
                <Menu.Item as={NavLink} to='/store'
                    name='store'
                />
                <Menu.Item as={NavLink} to='/sales'
                    name='sales'
                />
              
            </Menu>
             
             
        </Segment>
      

          


          
      )
  }
}
