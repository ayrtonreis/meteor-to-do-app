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
import Chip from '@material-ui/core/Chip';

import { Tasks } from '../api/tasks.js';

const styles = theme => ({
    textStrikedThrough: {
        textDecoration: 'line-through'
    },
    private: {
        backgroundColor: '#dedede'
    },
    chip: {
        marginLeft: '0',
        fontSize: '10px',
        width: '50px',
        height: '16px'
    },
    red: {
        backgroundColor: '#d07873',
    },
    green: {
        backgroundColor: '#a5e888',
    },
    gray: {
        backgroundColor: '#919191',
    }
});

// Task component - represents a single todo item
 class Task extends Component {
     constructor(props){
         super(props);
         this.task = props.task;
         this.taskOwner = this.task.owner;

         this.isUserOwner = this.isUserOwner.bind(this);
         this.classes = this.props.classes;
         this.priority = this.props.task.priority;
     }

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

    getUserId(){
        return Meteor.userId();
    }

    isUserOwner(ownerId){
        return Meteor.userId() === ownerId;
    }

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });

        const chipPriority = this.priority || 3;
        const chipColors = [this.classes.red, this.classes.gray, this.classes.green];
        const chipLabels = ['HIGH', 'MEDIUM', 'LOW'];
        const chipColor = chipColors[chipPriority-1];
        const chipLabel = chipLabels[chipPriority-1];

        const chipClassNames = classnames({
            [this.classes.chip]: true,
            [chipColor]: true,
        });

        //console.log(this.task);

        return (
            <div>
                <ListItem className={this.props.task.private ? this.props.classes.private : ''}>
                    <Chip label={chipLabel} className={chipClassNames} />

                    <Checkbox
                        checked={this.props.task.checked}
                        onChange={this.toggleChecked.bind(this)}
                        color="primary"
                        disabled={!this.isUserOwner(this.taskOwner)}
                    />

                    <ListItemText
                        className={this.props.task.checked ? this.props.classes.textStrikedThrough : ''}
                        primary={this.props.task.username +': '+ this.props.task.text}
                    />


                    <ListItemSecondaryAction>
                        { this.props.showPrivateButton ? (
                            <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                                { this.props.task.private ? 'Private' : 'Public' }
                            </button>
                        ) : ''}

                        {   this.isUserOwner(this.taskOwner) ? (
                            <ListItemIcon>

                                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                                    <Delete/>
                                </button>

                            </ListItemIcon>
                        ) : ''}
                    </ListItemSecondaryAction>
                </ListItem>
            </div>

        );
    }
}

Task = withStyles(styles)(Task);

 export default Task;