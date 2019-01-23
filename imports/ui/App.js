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

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    inputTask: {
        display: 'grid',
        gridTemplateColumns: 'auto 100px',
        gridGap: '10px',
        padding: '10px',
    },
    textSelectMenu: {
        fontSize: '12px',
    },
});


// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
            taskInputText: '',
            taskInputPriority: 3,
        };

        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleInputPriorityChange = this.handleInputPriorityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    resetTaskInput(){
        this.setState({taskInputText: '',
                taskInputPriority: 3,
        });
    }

    handleTextInputChange(event) {
        this.setState({taskInputText: event.target.value});
    }

    handleInputPriorityChange(event) {
        this.setState({taskInputPriority: event.target.value});
    }

    handleSubmit() {
        //event.preventDefault();

        // Find the text field via the React ref
        const text = this.state.taskInputText.trim();
        const priority = this.state.taskInputPriority;

        Meteor.call('tasks.insert', {text, priority});

        // Clear form
        this.resetTaskInput();
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
                        (
                            <div className={classes.inputTask}>
                                <form className="new-task" onSubmit={this.handleSubmit} >
                                    <input
                                        type="text"
                                        ref="textInput"
                                        placeholder="Type to add new tasks"
                                        value={this.state.taskInputText}
                                        onChange={this.handleTextInputChange}
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

                                </form>

                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-label-placeholder">
                                        Priority
                                    </InputLabel>
                                    <Select
                                        value={this.state.taskInputPriority}
                                        onChange={this.handleInputPriorityChange}
                                        displayEmpty
                                        className={classes.textSelectMenu}
                                    >
                                        <MenuItem value={1} className={classes.textSelectMenu}>High</MenuItem>
                                        <MenuItem value={2} className={classes.textSelectMenu}>Medium</MenuItem>
                                        <MenuItem value={3} className={classes.textSelectMenu}>Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                        ): ''
                    }

                </header>

                {/*<ul>*/}
                    {/*{this.renderTasks()}*/}
                {/*</ul>*/}

                <List component="nav">
                    {this.renderTasks()}
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