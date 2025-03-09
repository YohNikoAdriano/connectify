'use server'

// lib
import { connectToDB } from '../database';
import Order from '../database/models/order.model';
import User from '../database/models/user.model';
import Event from '../database/models/event.model';
import { handleError } from '../utils';
import type { CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from './../../types/index';

// mongoDB
import { ObjectId } from 'mongodb';

// CREATE
export const createOrder = async (order : CreateOrderParams) => {
  try {
    await connectToDB()

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId
    })

    return JSON.stringify(newOrder)
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY EVENT
// DISPLAY ALL ORDERS IN SPESIFIC EVENT THAT USER ORGANIZED
export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDB();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
}

// GET ORDERS BY USER
// DISPLAY ALL ORDERS THAT USER BOUGHT
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDB();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    const orders = await Order.distinct("event._id")
      .find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount =
      await Order.distinct("event._id").countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}