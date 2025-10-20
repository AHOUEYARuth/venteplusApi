// models/ActivityHistoricModel.js
import prisma from "../prismaClient.js";

export const ActivityHistoricModel = {
  async create(data) {
    return prisma.activityHistoric.create({ data });
  },

  async findById(id) {
    return prisma.activityHistoric.findUnique({ where: { id } });
  },

  async update(id, data) {
    return prisma.activityHistoric.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.activityHistoric.delete({ where: { id } });
  },

  async findAll() {
    return prisma.activityHistoric.findMany({
      orderBy: {
        date: 'desc'
      }
    });
  },

  async findByAction(action) {
    return prisma.activityHistoric.findMany({
      where: { action },
      orderBy: {
        date: 'desc'
      }
    });
  },

  async findByDateRange(startDate, endDate) {
    return prisma.activityHistoric.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
};