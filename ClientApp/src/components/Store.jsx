import React, { Component } from 'react';
import { Button, Modal, Icon, ModalActions, Form, Table, Dropdown, Label } from 'semantic-ui-react';
import _ from 'lodash';
const itemsPerPage = [
    {
        key: '0',
        text: '5',
        value: '5'
    },
    {
        key: '1',
        text: '10',
        value: '10'
    },
    {
        key: '2',
        text: '20',
        value: '20'
    },
    {
        key: '3',
        text: '50',
        value: '50'
    },
    {
        key: '4',
        text: '100',
        value: '100'
    },

]
export class Store extends Component {
   

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            storeID: 0,
            error: null,
            isLoaded: false,
            items: [],
            activePage: 1,
            todosPerPage: 5,
            createModalOpen: false,
            deleteModalOpen: false,
            editModalOpen: false,
        };
        
    }
    componentDidMount() {

        this.loadData();
    }

    handleClick = (event) => {
        this.setState({
            activePage: Number(event.target.id)
        });
    }
    handleSort = (clickedColumn) => () => {
        const { column, items, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                items: _.sortBy(items, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            items: items.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    dropdownClick = (e, data) => {
        console.log(data.value);
        this.setState({ todosPerPage: data.value });
    }

    loadData = () => {
        fetch("/api/store")
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
    }

    async createStore() {
        try {
            let result = await fetch("/api/store", {
                method: 'POST',
                //mode: 'no-cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    Name: this.state.name,
                    Address: this.state.address
                })
            })
                .then(res => {
                    if (res.ok) {
                        this.setState({
                            createModalOpen: false, name: '', address: '',
                            isLoaded: true,
                            //items: json,
                        });
                        this.loadData();
                        console.log(result);
                    } else {
                        alert("ALERT!!!\n\nPlease check fields and try again\n\n\n\nName field: Max number of characters is 50\n\Address field: Max number of characters is 250 ")
                    }
                }).catch(err => err);

            console.log(result)

        }
        catch (e) {
            console.log(e)
        }
    }

    async editStore(id) {

        try {
            console.log(this.state.id + " " + this.state.name + " " + this.state.address)
            let editResult = await fetch("/api/store/" + id, {
                method: 'PUT',
                //mode: 'no-cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    Name: this.state.name,
                    Address: this.state.address
                })
            })
                .then(res => {
                    if (res.ok) {
                        this.setState({
                            editModalOpen: false,
                            name: '', address: '',
                            isLoaded: true,

                        });
                        this.loadData();
                        console.log(editResult);
                    }
                    else {
                        alert("ALERT!!!\n\nPlease check fields and try again\n\n\n\nName field: Max number of characters is 50\n\Address field: Max number of characters is 250 ")
                    }
                }).catch(err => err);

            console.log(editResult)

        }
        catch (e) {
            console.log(e)
        }

    }





   
    async deleteStore(id) {
        try {
            fetch("/api/store/" + id, {
                method: 'DELETE'
            })
                .then(res => {
                    this.setState({ deleteModalOpen: false });
                    this.loadData();
                    console.log(res);
                }).catch(err => err);

        }
        catch (e) {
            console.log(e)
        }

    }




    render() {
        var { error, isLoaded, items, activePage, todosPerPage, column, direction } = this.state;
        // Logic for displaying current todos
        const indexOfLastTodo = activePage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = items.slice(indexOfFirstTodo, indexOfLastTodo);
        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(items.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}

                >
                    {number}
                </li>
            );
        });
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="ui container">
                    {/*New customer Modal*/}
                    <Modal open={this.state.createModalOpen} size={'tiny'} trigger={<Button primary onClick={() => this.setState({ createModalOpen: true })}>New Store</Button>}>
                        <Modal.Header>Create Store</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>NAME</label>
                                    <input value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder='Name' />
                                </Form.Field>
                                <Form.Field>
                                    <label>ADDRESS</label>
                                    <input value={this.state.address} onChange={(event) => this.setState({ address: event.target.value })} placeholder='Address' />
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <ModalActions>
                            <Button secondary onClick={() => this.setState({ createModalOpen: false, name: '', address: '' })}>Cancel</Button>
                            <Button className="ui green button" onClick={() => this.createStore()} >Create &nbsp;<Icon name='check' /></Button>
                        </ModalActions>
                    </Modal>

                    {/*New customer Modal Ends*/}



                    <Table sortable celled fixed>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={column === 'name' ? direction : null}
                                    onClick={this.handleSort('name')}
                                >Name</Table.HeaderCell >
                                <Table.HeaderCell
                                    sorted={column === 'address' ? direction : null}
                                    onClick={this.handleSort('address')}
                                >Address</Table.HeaderCell >
                                        <Table.HeaderCell >Actions</Table.HeaderCell >
                                            <Table.HeaderCell >Actions</Table.HeaderCell >

                                </Table.Row>
                            </Table.Header>
                        <Table.Body>


                            {currentTodos.map(item => (
                                <Table.Row key={item.storeID}>
                                    <Table.Cell>
                                        {item.name}
                                        </Table.Cell>
                                            <Table.Cell>
                                        {item.address}
                                                </Table.Cell>
                                    <Table.Cell>
                                        <Modal open={this.state.editModalOpen} size={'tiny'} trigger={<Button icon color='yellow' labelPosition='left' onClick={() => this.setState({ editModalOpen: true, id: item.storeID, name: item.name, address: item.address })}><Icon name='edit' />EDIT</Button>}>
                                            <Modal.Header>Edit Store</Modal.Header>
                                            <Modal.Content>
                                                <Form>
                                                    <Form.Field>
                                                        <label>NAME</label>
                                                        <input value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} placeholder='Name' />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>ADDRESS</label>
                                                        <input value={this.state.address} onChange={(event) => this.setState({ address: event.target.value })} placeholder='Address' />
                                                    </Form.Field>
                                                </Form>
                                            </Modal.Content>
                                            <ModalActions>
                                                <Button secondary onClick={() => this.setState({ editModalOpen: false, name: '', address: '' })}>Cancel</Button>
                                                <Button onClick={() => { this.editStore(this.state.id) }} icon positive type='submit' labelPosition='right'><Icon name='check' />Edit</Button>
                                            </ModalActions>

                                        </Modal>
                                        </Table.Cell>
                                    <Table.Cell>
                                        <Modal open={this.state.deleteModalOpen} size={'tiny'}  trigger={<Button icon color='red' labelPosition='left' onClick={() => this.setState({ deleteModalOpen: true, id: item.storeID })}> <Icon name='trash' />DELETE</Button>}>
                                            <Modal.Header>Delete customer</Modal.Header>
                                            <Modal.Content>
                                                <Form>
                                                    <Form.Field>
                                                        <h4>Are you sure?</h4>
                                                    </Form.Field>
                                                </Form>
                                            </Modal.Content>

                                            <ModalActions>
                                                <Button secondary onClick={() => this.setState({ deleteModalOpen: false })}>Cancel</Button>
                                                <Button icon onClick={() => this.deleteStore(this.state.id)} color='red' labelPosition='right' type='submit'><Icon name='cancel' />Delete</Button>

                                            </ModalActions>
                                        </Modal>
                                        </Table.Cell>
                                    </Table.Row>
                            ))}


                            </Table.Body>
                    </Table>
                    <div className="dropFloatRight">
                        <Dropdown
                            placeholder='Items per page'
                            compact
                            selection
                            defaultValue='5'
                            options={itemsPerPage}
                            //value={selected}
                            onChange={this.dropdownClick}
                        />&emsp;
        <Label as='a' color='teal' tag>
                            Items per page
        </Label>
                    </div>

                    <div id="page-numbers">
                        <ul >
                            {renderPageNumbers}
                        </ul>
                    </div> 






                </div>
            );
        }
    }
}
