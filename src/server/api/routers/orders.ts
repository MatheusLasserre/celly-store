import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const ordersRouter = createTRPCRouter({
  getAllOrders: authProcedure.query(async ({ ctx }) => {
    try {
      const orders = await ctx.prisma.order.findMany({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          groupId: true,
          paymentMethodId: true,
          paid: true,
          total: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      })
      const groups = await ctx.prisma.groups.findMany({
        where: {
          id: {
            in: orders.map((order) => order.groupId).filter((id) => id !== null),
          },
        },
        select: {
          id: true,
          name: true,
        },
      })
      return orders.map((order) => ({
        id: Number(order.id),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        groupId: order.groupId,
        groupName: groups.find((group) => group.id === order.groupId)!.name,
        paymentMethodId: order.paymentMethodId,
        paid: order.paid,
        total: order.total,
        productsCount: order._count.products,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On product Router. Error on getAllOrders',
        stack: errorMessage,
        info: 'getAllOrders',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar produtos',
      })
    }
  }),

  getOrderById: authProcedure
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.prisma.order.findUnique({
          where: {
            id: input.orderId,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            groupId: true,
            paymentMethodId: true,
            paid: true,
            total: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                code: true,
                cost: true,
                profit: true,
              },
            },
          },
        })
        if (!order) throw new Error('order não encontrada')
        const group = await ctx.prisma.groups.findUnique({
          where: {
            id: order.groupId,
          },
          select: {
            id: true,
            name: true,
          },
        })
        if (!group) throw new Error('group não encontrada')
        return {
          id: Number(order.id),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          groupId: order.groupId,
          groupName: group.name,
          paymentMethodId: order.paymentMethodId,
          paid: order.paid,
          total: order.total,
          products: order.products.map((product) => ({
            id: Number(product.id),
            name: product.name,
            price: Number(product.price),
            code: product.code,
            cost: Number(product.cost),
            profit: Number(product.profit),
            quantity: product.quantity,
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on getOrderById',
          stack: errorMessage,
          info: 'getOrderById',
          userId: ctx.session?.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar produtos',
        })
      }
    }),

  getAllOrdersSearch: authProcedure
    .input(
      z.object({
        groupId: z.number(),
        limit: z.number().optional(),
        page: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const page = input.page || 1
      const limit = input.limit || 10
      try {
        const orders = await ctx.prisma.order.findMany({
          ...(input.groupId && {
            where: {
              groupId: input.groupId,
            },
          }),
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            groupId: true,
            paymentMethodId: true,
            paid: true,
            total: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                code: true,
                cost: true,
                profit: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit + 1,
        })
        const groups = await ctx.prisma.groups.findMany({
          where: {
            id: {
              in: orders.map((order) => order.groupId).filter((id) => id !== null),
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
        return {
          orders: orders.map((order) => ({
            id: Number(order.id),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            groupId: order.groupId,
            groupName: groups.find((group) => group.id === order.groupId)!.name,
            paymentMethodId: order.paymentMethodId,
            paid: order.paid,
            total: order.total,
            productsCount: order.products.reduce((acc, product) => acc + product.quantity, 0),
            profit: order.products.reduce((acc, product) => acc + Number(product.profit), 0),
          })),
          nextPage: orders.length > limit ? true : false,
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on getAllOrdersSearch',
          stack: errorMessage,
          info: 'getAllOrdersSearch',
          userId: ctx.session?.user.id,
        })
        throw error
      }
    }),
})
