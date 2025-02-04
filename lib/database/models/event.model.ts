import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document{
    // clerkId: string;
    // email: string;
    _id: string;
    title: string;
    description?: string; // Optional
    location?: string; // Optional
    createdAt?: Date; // Optional
    imageUrl: string;
    startDateTime?: Date; // Optional
    endDateTime?: Date; // Optional
    price?: string; // Optional
    isFree?: boolean; // Optional
    url?: string; // Optional
    category?: { _id: string, name: string}
    organizer?: { _id: string, firstName: string, lastName: string}
}

const EventSchema = new Schema({
    clerkId: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String},
    location: {type: String},
    createdAt: {type: Date, default: Date.now},
    imageUrl: {type: String, required: true},
    startDateTime: {type: Date, default: Date.now},
    endDateTime: {type: Date, default: Date.now},
    price: {type: String},
    isFree: {type:Boolean, default: false},
    url: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    organizer: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Event = models.Event || model('Event', EventSchema)

export default Event