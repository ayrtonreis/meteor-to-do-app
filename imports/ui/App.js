import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
});


// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        //event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('tasks.insert', text);

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;

        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }

        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return (
                <Task
                    key={task._id}
                    task={task}
                    showPrivateButton={showPrivateButton}
                />
            );
        });
    }

    renderTasks2() {
        let filteredTasks = this.props.tasks;

        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }

        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return (
                <Task
                    key={task._id}
                    task={task}
                    showPrivateButton={showPrivateButton}
                />
            );
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper />

                    { this.props.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new tasks"
                            />

                            {/*<TextField*/}
                                {/*id="outlined-with-placeholder"*/}
                                {/*label="Type to add new tasks"*/}
                                {/*placeholder="New Task"*/}
                                {/*className={classes.textField}*/}
                                {/*margin="normal"*/}
                                {/*variant="outlined"*/}
                                {/*onKeyPress={(ev) => {*/}
                                    {/*console.log(`Pressed keyCode ${ev.key}`);*/}
                                    {/*if (ev.key === 'Enter') {*/}
                                        {/*ev.preventDefault();*/}
                                        {/*this.handleSubmit.bind(this)();*/}
                                    {/*}*/}
                                {/*}}*/}
                            {/*/>*/}

                        </form>  : ''
                    }
                </header>

                {/*<ul>*/}
                    {/*{this.renderTasks()}*/}
                {/*</ul>*/}

                <List component="nav">
                    {this.renderTasks2()}
                </List>
            </div>
        );
    }
}

App = withStyles(styles)(App);

export default withTracker(() => {
    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
        currentUser: Meteor.user(),
    };
})(App);