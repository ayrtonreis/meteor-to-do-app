import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/DeleteOutlined';

import { Tasks } from '../api/tasks.js';

const styles = theme => ({
    textStrikedThrough: {
        textDecoration: 'line-through'
    },
    private: {
        backgroundColor: '#dedede'
    }
});

// Task component - represents a single todo item
 class Task extends Component {
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });

        return (
            <ListItem className={this.props.task.private ? this.props.classes.private : ''}>

                <Checkbox
                    checked={this.props.task.checked}
                    onChange={this.toggleChecked.bind(this)}
                    color="primary"
                />

                { this.props.showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                        { this.props.task.private ? 'Private' : 'Public' }
                    </button>
                ) : ''}

                <ListItemText
                    className={this.props.task.checked ? this.props.classes.textStrikedThrough : ''}
                    primary={this.props.task.username +': '+ this.props.task.text}
                />

                <ListItemSecondaryAction>

                    <ListItemIcon>
                        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                            <Delete/>
                        </button>
                    </ListItemIcon>

                </ListItemSecondaryAction>

            </ListItem>
        );
    }
}

Task = withStyles(styles)(Task);

 export default Task;