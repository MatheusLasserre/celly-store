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
            orderDate: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                code: true,
                cost: true,
                profit: true,
                productId: true,
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
          orderDate: order.orderDate,
          products: order.products.map((product) => ({
            id: Number(product.id),
            name: product.name,
            price: Number(product.price),
            code: product.code,
            cost: Number(product.cost),
            profit: Number(product.profit),
            quantity: product.quantity,
            productId: product.productId,
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
            profit: true,
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
            profit: order.profit,
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

  createOrder: authProcedure
    .input(
      z.object({
        groupId: z.number().min(1),
        paymentMethodId: z.number().min(1),
        date: z.date(),
        products: z.array(
          z.object({
            id: z.number().min(1),
            name: z.string(),
            price: z.number(),
            cost: z.number(),
            code: z.string(),
            profit: z.number(),
            quantity: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentMethodTax = await ctx.prisma.payment_methods.findUnique({
          where: {
            id: input.paymentMethodId,
          },
          select: {
            taxRate: true,
          },
        })
        if (!paymentMethodTax) throw new Error('Erro ao buscar o meio de pagamento')
        const total = input.products.reduce(
          (acc, product) => acc + product.quantity * product.price,
          0,
        )
        const profit =
          input.products.reduce((acc, product) => acc + product.quantity * product.profit, 0) -
          Number(paymentMethodTax.taxRate)
        await ctx.prisma.order.create({
          data: {
            groupId: input.groupId,
            paymentMethodId: input.paymentMethodId,
            orderDate: input.date,
            paid: true,
            total: total,
            profit: profit,
            products: {
              create: input.products.map((product) => ({
                productId: product.id,
                name: product.name,
                price: product.price,
                cost: product.cost,
                code: product.code,
                profit: product.profit,
                quantity: product.quantity,
              })),
            },
          },
        })

        return {
          message: 'Ordem criada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on createOrder',
          stack: errorMessage,
          info: 'createOrder',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  editOrder: authProcedure
    .input(
      z.object({
        orderId: z.number().min(1),
        groupId: z.number().min(1),
        paymentMethodId: z.number().min(1),
        date: z.date(),
        products: z.array(
          z.object({
            id: z.number().optional(),
            name: z.string(),
            price: z.number(),
            cost: z.number(),
            code: z.string(),
            profit: z.number(),
            quantity: z.number(),
            productId: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentMethodTax = await ctx.prisma.payment_methods.findUnique({
          where: {
            id: input.paymentMethodId,
          },
          select: {
            taxRate: true,
          },
        })
        if (!paymentMethodTax) throw new Error('Erro ao buscar o meio de pagamento')
        const total = input.products.reduce(
          (acc, product) => acc + product.quantity * product.price,
          0,
        )
        console.log(input.products.reduce((acc, product) => acc + product.quantity * product.profit, 0) - Number(paymentMethodTax.taxRate))
        const profit =
          input.products.reduce((acc, product) => acc + product.quantity * product.profit, 0) -
          Number(paymentMethodTax.taxRate)
        const newOrder = await ctx.prisma.order.update({
          where: {
            id: input.orderId,
          },
          data: {
            groupId: input.groupId,
            paymentMethodId: input.paymentMethodId,
            orderDate: input.date,
            paid: true,
            total: total,
            profit: profit,
          },
          select: {
            products: true,
          },
        })

        const productsToRemove = newOrder.products.filter(
          (product) => !input.products.some((p) => p.id === product.id),
        )
        const productsToAdd = input.products.filter(
          (product) => !newOrder.products.some((p) => p.id === product.id),
        )
        const productsToUpdate = input.products.filter((product) =>
          newOrder.products.some((p) => p.id === product.id),
        )
        if (productsToRemove.length > 0) {
          await ctx.prisma.product_order.deleteMany({
            where: {
              id: {
                in: productsToRemove.map((product) => product.id),
              },
            },
          })
        }
        if (productsToAdd.length > 0) {
          await ctx.prisma.product_order.createMany({
            data: productsToAdd.map((product) => ({
              productId: product.productId,
              orderId: input.orderId,
              name: product.name,
              price: product.price,
              cost: product.cost,
              code: product.code,
              profit: product.profit,
              quantity: product.quantity,
            })),
          })
        }

        for (let i = 0; i < productsToUpdate.length; i++) {
          const product = productsToUpdate[i]
          if (!product) continue
          await ctx.prisma.product_order.update({
            where: {
              id: product.id,
            },
            data: {
              name: product.name,
              price: product.price,
              cost: product.cost,
              code: product.code,
              profit: product.profit,
              quantity: product.quantity,
              productId: product.productId,
            },
          })
        }

        return {
          message: 'Ordem editada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on createOrder',
          stack: errorMessage,
          info: 'createOrder',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),
})
