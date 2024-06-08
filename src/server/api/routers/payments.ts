import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const paymentsRouter = createTRPCRouter({
  createPayment: authProcedure
    .input(
      z.object({
        name: z.string(),
        value: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const isValidName = input.name.replaceAll(' ', '').length >= 1
        if (!isValidName) throw new Error('Nome inválido')
        if (!input.value && typeof input.value !== 'number') throw new Error('Valor inválido')

        await ctx.prisma.payment_methods.create({
          data: {
            name: input.name,
            taxRate: input.value,
          },
        })

        return {
          message: 'Pagamento criado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On payment Router. Error on createPayment',
          stack: errorMessage,
          info: 'createPayment',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getAllPayments: authProcedure.query(async ({ ctx }) => {
    try {
      const payments = await ctx.prisma.payment_methods.findMany({
        select: {
          id: true,
          name: true,
          taxRate: true,
          _count: {
            select: {
              order: true,
            },
          },
        },
      })
      return payments.map((payment) => ({
        id: Number(payment.id),
        name: payment.name,
        orders: payment._count.order,
        value: Number(payment.taxRate),
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On payment Router. Error on getAllPayments',
        stack: errorMessage,
        info: 'getAllPayments',
        userId: ctx.session.user.id,
      })
      throw error
    }
  }),

  getAvailablePayments: authProcedure.query(async ({ ctx }) => {
    try {
      const payments = await ctx.prisma.payment_methods.findMany({
        where: {
          enabled: true,
        },
        select: {
          id: true,
          name: true,
          taxRate: true,
          _count: {
            select: {
              order: true,
            },
          },
        },
      })
      return payments.map((payment) => ({
        id: Number(payment.id),
        name: payment.name,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On payment Router. Error on getAllPayments',
        stack: errorMessage,
        info: 'getAllPayments',
        userId: ctx.session.user.id,
      })
      throw error
    }
  }),

  updatePayment: authProcedure
    .input(
      z.object({
        paymentName: z.string().optional(),
        paymentValue: z.number().optional(),
        paymentId: z.number(),
        enabled: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!input.paymentName && !input.paymentName && typeof input.paymentValue !== 'number')
          throw new Error('É necessário informar um nome ou valor')
        const dataObject: {
          name?: string
          taxrate?: number
          enabled?: boolean
        } = {}
        if (input.paymentName) {
          dataObject.name = input.paymentName
        }

        if (typeof input.paymentValue === 'number') {
          dataObject.taxrate = input.paymentValue
        }

        if (typeof input.enabled === 'boolean') {
          dataObject.enabled = input.enabled
        }

        await ctx.prisma.payment_methods.update({
          where: {
            id: input.paymentId,
          },
          data: dataObject,
        })

        return {
          message: 'Pagamento atualizado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On payment Router. Error on updatePayment',
          stack: errorMessage,
          info: 'updatePayment',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getPaymentById: authProcedure
    .input(
      z.object({
        paymentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const payment = await ctx.prisma.payment_methods.findUnique({
          where: {
            id: input.paymentId,
          },
          select: {
            id: true,
            name: true,
            taxRate: true,
            enabled: true,
          },
        })
        if (!payment) throw new Error('Grupo não encontrado')

        return {
          id: Number(payment.id),
          name: payment.name,
          value: Number(payment.taxRate),
          enabled: payment.enabled,
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On payment Router. Error on getPaymentById',
          stack: errorMessage,
          info: 'getPaymentById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  disablePaymentById: authProcedure
    .input(
      z.object({
        paymentId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.payment_methods.update({
          where: {
            id: input.paymentId,
          },
          data: {
            enabled: false,
          },
        })

        return {
          message: 'Pagamento desativado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On payment Router. Error on deletePaymentById',
          stack: errorMessage,
          info: 'deletePaymentById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),
})
