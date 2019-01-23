import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Activity = new Mongo.Collection('activity_log');

export function logActivity(taskId, action) {
    check(taskId, String);
    check(action, String);

    Activity.insert({
        userId: this.userId,
        taskId,
        createdAt: new Date(),
        action
    });
    
    console.log('LOG created')
}