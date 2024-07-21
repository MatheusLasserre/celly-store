import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const reportsRouter = createTRPCRouter({
  getReports: authProcedure.input(z.object({
    from: z.date(),
    to: z.date(),
    paymentMethodsIds: z.array(z.number()).optional(),
    groupIds: z.array(z.number()).optional(),
    limit: z.number().optional(),
    page: z.number().optional(),
  })).query(async ({ ctx, input }) => {
    try {
        const limit = input.limit || 10
        const page = input.page || 1
      const orders = await ctx.prisma.order.findMany({
        where: {
            orderDate: {
                gte: input.from,
                lte: input.to,
            },
            ...(input.groupIds && {
                groupId: {
                    in: input.groupIds,
                },
            }),
            ...(input.paymentMethodsIds && {
                paymentMethodId: {
                    in: input.paymentMethodsIds,
                },
            }),
            paid: true,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          group: {
            select: {
                id: true,
                name: true,
            }
          },
          paymentMethod: {
            select: {
                id: true,
                name: true,
                taxRate: true,
            }
          },
          paid: true,
          total: true,
          profit: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      })
      const ordersCount = orders.length
      const totalSales = orders.reduce((acc, order) => acc + Number(order.total), 0)
      const totalTaxes = orders.reduce((acc, order) => acc + Number(order.total) - Number(order.paymentMethod.taxRate), 0)
      const totalProfit = orders.reduce((acc, order) => acc + Number(order.profit), 0)
      const totalProductsSold = orders.reduce((acc, order) => acc + order._count.products, 0)
      const nextPage = orders.length > limit ? true : false
     const ordersToDisplay = orders.map((order) => ({
        id: Number(order.id),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        groupName: order.group.name,
        paymentMethod: order.paymentMethod.name,
        paid: order.paid,
        total: order.total,
        profit: order.profit,
        productsCount: order._count.products,
      })).slice(page * limit - limit, page * limit)
      return {
        ordersCount: ordersCount,
        totalSales: totalSales,
        totalTaxes: totalTaxes,
        totalProfit: totalProfit,
        totalProductsSold: totalProductsSold,
        nextPage: nextPage,
        orders: ordersToDisplay,
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On report Router. Error on getReports',
        stack: errorMessage,
        info: 'getReports',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao gerar relatório',
      })
    }
  }),

 
})
