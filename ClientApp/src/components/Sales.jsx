import React, { Component } from 'react';
import { Button, Form, Modal, Icon, ModalActions, Dropdown,Table,Label } from 'semantic-ui-react';

import { DateInput } from 'semantic-ui-calendar-react';
import Moment from 'react-moment';
import moment from 'moment/moment.js'
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



export class Sales extends Component {


    constructor(props) {
        super(props);
        this.state = {
            customerData: [],
            customers: [],
            customer: {},
            product: {},
            selectedCustomer: "",
            productData: [],
            products: [],
            storeData: [],
            store: '',
            dateSold: '',
            id: 0,
            error: null,
            isLoaded: false,
            items: [],
            activePage: 1,
            todosPerPage: 5,
            createModalOpen: false,
            deleteModalOpen: false,
            editModalOpen: false,
            data: {
                list: [],


            },


            dropdownValue: '10'

        };
    }

    componentDidMount() {
        this.loadData();
        this.getCustomerList();
        this.getProductList();
        this.getStoreList();


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

    getCustomerList = () => {
        fetch("/api/customer")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    
                    .map((list, index) => { return { key: index, text: list.name, value: list.customerID } })
                //console.log(this.state.list)
                this.setState({
                    customerData: [{ key: '', value: '', display: '(Select Store)' }].concat(thisList),
                    isLoading: true
                });
            }

            )

            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }
    getProductList = () => {
        fetch("/api/product")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    
                    .map((list, index) => { return { key: index, text: list.name, value: list.productID } })
                this.setState({
                    productData: [{ key: '', value: '', display: '(Select product)' }].concat(thisList),
                    isLoading: true
                });
            })

            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }
    getStoreList = () => {
        fetch("/api/store")
            .then(res => res.json())
            .then((data) => {
                let thisList = data
                    
                    .map((list, index) => { return { key: index, text: list.name, value: list.storeID } })
                //console.log(this.state.list)
                this.setState({
                    storeData: [{ key: '', value: '', display: '(Select Store)' }].concat(thisList),
                    isLoading: true
                });
            }

            )

            .catch(error => {
                if (error.response) {
                    console.log(error.responderEnd);
                }
            })
    }



 


    loadData = () => {
        fetch("/api/sale")
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
    }
    createSales = () => {
        console.log("date " + this.state.dateSold + " cust " + this.state.customer + " product " + this.state.product + "store" + this.state.store)
        console.log("testing moment - " + moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"))
        fetch("/api/sale", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DateSold: moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"),
                Customerid: this.state.customer,
                Productid: this.state.product,
                Storeid: this.state.store
            })
        })
            .then(res => {
                if (res.ok) {
                    this.setState({ createModalOpen: false, dateSold: '', customer: '', product: '', store: '' });
                    this.loadData();
                    console.log(res);
                } else {
                    alert("ALERT!!!\n\nPlease check all fields and try again")
                }
            }).catch(err => err);
    }


    editSale = (id) => {
        console.log("date " + this.state.dateSold + " cust " + this.state.customer + " store " + this.state.store + " product " + this.state.product)
        fetch("/api/sale/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                DateSold: moment(this.state.dateSold, "DD-MM-YYYY").format("MM-DD-YYYY"),
                Customerid: this.state.customer,
                Productid: this.state.product,
                Storeid: this.state.store
            })
        }).then((res) => {
            this.setState({ editModalOpen: false, dateSold: '', customer: '', store: '', product: '' });
            this.loadData();
            console.log(res);
        }).catch(err => err);
    }
    deleteSale = (id) => {
        fetch("/api/sale/" + id, {
            method: 'DELETE'
        })
            .then(res => {
                this.setState({ deleteModalOpen: false });
                this.loadData();
                console.log(res);
            }).catch(err => err);
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
        }
        else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        else {
            return (
                <div className="ui container">
                    {/*New customer Modal*/}
                    <Modal open={this.state.createModalOpen} size={'tiny'} trigger={<Button primary onClick={() => this.setState({ createModalOpen: true })}>New Sales</Button>}>
                        <Modal.Header>Create New Sales</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field>
                                    <label>Date Sold</label>
                                    <DateInput
                                        name="dateSold"
                                        placeholder="Date Sold"

                                        value={this.state.dateSold}

                                        iconPosition="right"
                                        onChange={(event, { name, value }) => this.setState({ dateSold: value })}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label>Customer</label>
                                    <Dropdown

                                        placeholder='Select Customer'
                                        scrolling
                                        fluid
                                        selection
                                        //id={this.state.customer.key}
                                        options={this.state.customerData}
                                        value={this.state.customer.value}
                                       onChange={(event, { name, value }) => this.setState({ customer: value })}
                                    />
                                </Form.Field>


                                <Form.Field>
                                    <label>Product</label>
                                    <Dropdown
                                        placeholder='Select Product'
                                        scrolling
                                        fluid
                                        selection
                                        options={this.state.productData}
                                        value={this.state.product.value}
                                        name='cst'
                                        onChange={(event, { name, value }) => this.setState({ product: value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Store</label>
                                    <Dropdown
                                        placeholder='Select Store'
                                        scrolling
                                        fluid
                                        selection
                                        options={this.state.storeData}
                                        value={this.state.store.value}
                                        onChange={(event, { name, value }) => this.setState({ store: value })}
                                    />
                                </Form.Field>




                            </Form>
                        </Modal.Content>
                        <ModalActions>
                            <Button secondary onClick={() => this.setState({ createModalOpen: false })}>Cancel</Button>
                            <Button className="ui green button" onClick={() => this.createSales()} >Create &nbsp;<Icon name='check' /></Button>
                        </ModalActions>
                    </Modal>

                    {/*New customer Modal Ends*/}
                    <Table sortable celled fixed>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={column === 'customer.name' ? direction : null}
                                    onClick={this.handleSort('name')}>Customer</Table.HeaderCell >
                                <Table.HeaderCell
                                    sorted={column === 'product.name' ? direction : null}
                                    onClick={this.handleSort('name')}>Product</Table.HeaderCell >
                                <Table.HeaderCell
                                    sorted={column === 'store.name' ? direction : null}
                                    onClick={this.handleSort('name')}>Store</Table.HeaderCell >
                               
                                <Table.HeaderCell
                                    sorted={column === 'dateSold' ? direction : null}
                                    onClick={this.handleSort('dateSold')}>DateSold</Table.HeaderCell >
                                <Table.HeaderCell>Actions</Table.HeaderCell >
                                <Table.HeaderCell>Actions</Table.HeaderCell >

                                </Table.Row>
                            </Table.Header>
                        <Table.Body>
                            {currentTodos.map(item => (
                                <Table.Row key={item.salesID}>
                                    
                                    <Table.Cell>
                                        {item.customer.name}
                                    </Table.Cell>
                                    <Table.Cell> {item.product.name}</Table.Cell>
                                    <Table.Cell> {item.store.name}</Table.Cell>
                                    <Table.Cell><Moment format="DD/MM/YYYY">{item.dateSold}</Moment></Table.Cell>
                                    <Table.Cell>

                                        <Modal open={this.state.editModalOpen} size={'tiny'} trigger={<Button icon color='yellow' labelPosition='left' onClick={() => this.setState({ editModalOpen: true, id: item.salesID, dateSold: moment(item.dateSold, "YYYY-DD-MM").format("MM-DD-YYYY"), customer: item.customer.name, product: item.product.name, store: item.store.name })}><Icon name='edit' />EDIT</Button>}>
                            <Modal.Header>Edit sale</Modal.Header>
                            <Modal.Content>
                                <Form>
                                                    <Form.Field>
                                                        <label>Date Sold</label>
                                                        <DateInput
                                                            name="dateSold"
                                                            placeholder="Date Sold"
                                                            value={this.state.dateSold}
                                                            iconPosition="right"
                                                            onChange={(event, { name, value }) => this.setState({ dateSold: value })}
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Customer</label>
                                                        <Dropdown
                                                            placeholder='Select Customer'
                                                            scrolling
                                                            fluid
                                                            selection

                                                            options={this.state.customerData}
                                                            value={this.state.customer.value}
                                                            onChange={(event, { name, value }) => this.setState({ customer: value })}
                                                        />
                                                    </Form.Field>
                                                    
                                                    <Form.Field>
                                                        <label>Product</label>
                                                        <Dropdown
                                                            placeholder='Select Product'
                                                            fluid
                                                            selection
                                                            options={this.state.productData}
                                                            value={this.state.product.value}
                                                            onChange={(event, { name, value }) => this.setState({ product: value })}
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Store</label>
                                                        <Dropdown
                                                            placeholder='Select Store'
                                                            fluid
                                                            selection
                                                            options={this.state.storeData}
                                                            value={this.state.store.value}
                                                            onChange={(event, { name, value }) => this.setState({ store: value })}
                                                        />
                                                    </Form.Field>




                                </Form>
                            </Modal.Content>
                            <ModalActions>
                                                <Button secondary onClick={() => this.setState({ editModalOpen: false, dateSold: '', customer: '', store: '', product: '' })}>Cancel</Button>
                                <Button onClick={() => { this.editSale(this.state.id) }} icon positive type='submit' labelPosition='right'><Icon name='check' />Edit</Button>
                            </ModalActions>
                        </Modal>


                                    </Table.Cell>


                                    <Table.Cell>
                                        {/*Delete Modal*/}
                                        <Modal open={this.state.deleteModalOpen} size={'tiny'} trigger={<Button icon color='red' labelPosition='left' onClick={() => this.setState({ deleteModalOpen: true, id: item.salesID })}> <Icon name='trash' />DELETE</Button>}>
                                            <Modal.Header>Delete sale</Modal.Header>
                                            <Modal.Content>
                                                <Form>
                                                    <Form.Field>
                                                        <h4>Are you sure?</h4>
                                                    </Form.Field>
                                                </Form>
                                            </Modal.Content>
                                            <ModalActions>
                                                <Button secondary onClick={() => this.setState({ deleteModalOpen: false })}>Cancel</Button>
                                                <Button icon onClick={(id) => this.deleteSale(this.state.id)} color='red' labelPosition='right' type='submit'><Icon name='cancel' />Delete</Button>
                                            </ModalActions>
                                        </Modal>
                                    </Table.Cell>
                                    </Table.Row>))}




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
