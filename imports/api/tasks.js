import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {actionList} from './actionList'
import {logActivity} from "./activityLog";

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            deleted: {$ne: true},
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'({text, priority}) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        console.warn('INSERT BEFORE');
        // Meteor.call('activity_log.insert', 1, actionList.CREATE_TASK);
        //logActivity('1', actionList.CREATE_TASK)
        console.warn('INSERT AFTER');


        const newTaskId = Tasks.insert({
            text,
            priority,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
            deleted: false
        });

        logActivity(newTaskId, actionList.CREATE_TASK);
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        //Tasks.remove(taskId);
        Tasks.update(taskId, { $set: { deleted: true } });

        logActivity(taskId, actionList.DELETE_TASK);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });

        logActivity(taskId, (setChecked ? actionList.CHECK_TASK : actionList.UNCHECK_TASK));
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });

        logActivity(taskId, (setToPrivate ? actionList.MAKE_TASK_PRIVATE : actionList.MAKE_TASK_PUBLIC));
    },
});