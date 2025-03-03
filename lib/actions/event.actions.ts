"use server";

// next
import { revalidatePath } from "next/cache";

// lib
import { connectToDB } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";
import type {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

// GET CATEGORY BY NAME
const getCategoryByName = async (name: string) => {
  return Category.findOne({ 
    name: { 
      // Searching 'SELECT ... LIKE name'
      $regex: name,
      // Not Case Sensitive 
      $options: "i" 
    } 
  });
};

// POPULATE -> GET SELECTED FIELD FROM REFERENCED MODEL
const populateEvent = (query: any) => {
  return query
  .populate({
    path: "organizer",
    model: User,
    select: "_id firstName lastName",
  })
  .populate({ 
    path: "category", 
    model: Category, 
    select: "_id name" 
  });
};

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDB();

    // Check if Organizer/User Available in MongoDB
    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");

    // Make New Event
    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET ONE EVENT BY EVENT ID
export async function getEventById(eventId: string) {
  try {
    await connectToDB();

    // Check if Event Available in MongoDB
    const event = await populateEvent(Event.findById(eventId));
    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDB();

    // Check if Event Available in MongoDB
    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    // Update Selected Event
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { 
        ...event, 
        category: event.categoryId 
      },
      { 
        // Return Updated Data
        new: true 
      },
    );
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDB();

    // Find and Delete Event By ID
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDB();

    // Define Title Condition
    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    
    // Define Category Condition
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    // Make Condition by Title and Category
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    // Pagination
    const skipAmount = (Number(page) - 1) * limit;

    // Find Event by Condition Defined
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDB();

    // Make Condition by Organizer/User ID
    const conditions = { organizer: userId };

    // Pagination
    const skipAmount = (page - 1) * limit;

    // Find Event by Condition Defined
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({ categoryId, eventId, limit = 3, page = 1 }: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDB();

    // Pagination
    const skipAmount = (Number(page) - 1) * limit;

    // Make Condition by Category and Event Id
    const conditions = {
      $and: [
        { category: categoryId }, 
        // Exclude Events with Certain Event Id
        { _id: { $ne: eventId } }
      ],
    };

    // Find Event by Condition Defined
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}