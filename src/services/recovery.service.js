import prisma from "../prismaClient.js";
import { RecoveryModel } from "../models/recovery.model.js";

export const RecoveryService = {
  async createRecovery(data) {
    const { amountPaid, customerCreditId } = data;
    if (!customerCreditId) throw new Error("customerCreditId est requis");
    const amount = parseFloat(amountPaid);
    if (isNaN(amount) || amount <= 0) throw new Error("amountPaid invalide");

    return prisma.$transaction(async (tx) => {
      const credit = await tx.customerCredits.findUnique({
        where: { id: customerCreditId },
      });
      if (!credit) throw new Error("CustomerCredit introuvable");
      if(amountPaid + (credit.amountPaid ?? 0) > credit.totalAmountToPay) throw new Error("Montant total dépassé");
      const newAmountPaid = (credit.amountPaid ?? 0) + amount;
      const isPaid = newAmountPaid >= credit.totalAmountToPay;

      const recovery = await RecoveryModel.create(
        { amountPaid: amount, customerCreditId },
        tx
      );

      await tx.customerCredits.update({
        where: { id: customerCreditId },
        data: { amountPaid: newAmountPaid, isPaid },
      });

      return recovery;
    });
  },

  async getRecoveriesByCustomerCredit(customerCreditId) {
    if (!customerCreditId) throw new Error("customerCreditId est requis");
    return RecoveryModel.findByCustomerCredit(customerCreditId);
  },


  async updateRecovery(id, data) {
    if (!id) throw new Error("id est requis");

    return prisma.$transaction(async (tx) => {
      const existing = await RecoveryModel.findById(id, tx);
      if (!existing) throw new Error("Recovery introuvable");

      const credit = await tx.customerCredits.findUnique({
        where: { id: existing.customerCreditId },
      });
      if (!credit) throw new Error("CustomerCredit lié introuvable");

      if (data.amountPaid === undefined) {
        return RecoveryModel.update(id, data, tx);
      }

      const newAmount = parseFloat(data.amountPaid);
      if (isNaN(newAmount) || newAmount <= 0) throw new Error("amountPaid invalide");

      const delta = newAmount - existing.amountPaid;
      const updatedAmountPaid = (credit.amountPaid ?? 0) + delta;
      if (updatedAmountPaid < 0)
        throw new Error("Montant payé ne peut être négatif");

      const isPaid = updatedAmountPaid >= credit.totalAmountToPay;

      const updatedRecovery = await RecoveryModel.update(
        id,
        { amountPaid: newAmount },
        tx
      );

      await tx.customerCredits.update({
        where: { id: credit.id },
        data: { amountPaid: updatedAmountPaid, isPaid },
      });

      return updatedRecovery;
    });
  },

};
