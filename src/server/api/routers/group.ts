import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const groupRouter = createTRPCRouter({
  createGroup: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        phone: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const isValidName = input.name.replaceAll(' ', '').length >= 1
        if (!isValidName) throw new Error('Nome inválido')
        if (!input.description) throw new Error('Descrição inválida')

        await ctx.prisma.groups.create({
          data: {
            name: input.name,
            description: input.description,
            phone: input.phone.replace(/[^0-9]/g, '') === '' ? 'Não informado' : input.phone.replace(/[^0-9]/g, ''),
          },
        })

        return {
          message: 'Cliente criado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On group Router. Error on createCode',
          stack: errorMessage,
          info: 'createGroup',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getAllGroups: authProcedure.query(async ({ ctx }) => {
    try {
      const groups = await ctx.prisma.groups.findMany({
        include: {
          _count: {
            select: {
              order: true,
            },
          },
        },
      })
      return groups.map((group) => ({
        id: Number(group.id),
        name: group.name,
        orders: group._count.order,
        description: group.description,
        phone: group.phone,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On group Router. Error on getAllGroups',
        stack: errorMessage,
        info: 'getAllGroups',
        userId: ctx.session.user.id,
      })
      throw error
    }
  }),

  getAllGroupsDry: authProcedure.query(async ({ ctx }) => {
    try {
      const groups = await ctx.prisma.groups.findMany({
        include: {
          _count: {
            select: {
              order: true,
            },
          },
        },
      })
      return groups.map((group) => ({
        id: Number(group.id),
        name: group.name,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On group Router. Error on getAllGroupsDry',
        stack: errorMessage,
        info: 'getAllGroupsDry',
        userId: ctx.session.user.id,
      })
      throw error
    }
  }),
  getAllGroupsDrySearch: authProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const groups = await ctx.prisma.groups.findMany({
          where: {
            name: {
              contains: input.query,
            },
          },
          take: 10,
        })
        return groups.map((group) => ({
          id: Number(group.id),
          name: group.name,
        }))
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On group Router. Error on getAllGroupsDry',
          stack: errorMessage,
          info: 'getAllGroupsDry',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  updateGroup: authProcedure
    .input(
      z.object({
        groupName: z.string().optional(),
        groupDescription: z.string().optional(),
        groupId: z.number(),
        groupPhone: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!input.groupName && !input.groupDescription && !input.groupPhone)
          throw new Error('É necessário informar um nome ou uma descrição')
        const dataObject: {
          name?: string
          description?: string
          phone?: string
        } = {}
        if (input.groupName) {
          dataObject.name = input.groupName
        }

        if (input.groupDescription) {
          dataObject.description = input.groupDescription
        }

        if (input.groupPhone) {
          dataObject.phone = input.groupPhone
        }

        await ctx.prisma.groups.update({
          where: {
            id: input.groupId,
          },
          data: dataObject,
        })

        return {
          message: 'Cliente atualizado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On group Router. Error on updateGroup',
          stack: errorMessage,
          info: 'updateGroup',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getGroupById: authProcedure
    .input(
      z.object({
        groupId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const group = await ctx.prisma.groups.findUnique({
          where: {
            id: input.groupId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            phone: true,
            order: {
              select: {
                id: true,
                total: true,
                createdAt: true,
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
          },
        })
        if (!group) throw new Error('Grupo não encontrado')

        return {
          id: Number(group.id),
          name: group.name,
          description: group.description,
          phone: group.phone,
          orders: group.order.map((order) => ({
            id: Number(order.id),
            total: order.total,
            createdAt: order.createdAt,
            products: order._count.products,
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On group Router. Error on getGroupById',
          stack: errorMessage,
          info: 'getGroupById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  deleteGroupById: authProcedure
    .input(
      z.object({
        groupId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.groups.delete({
          where: {
            id: input.groupId,
          },
        })

        return {
          message: 'Grupo deletado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On group Router. Error on deleteGroupById',
          stack: errorMessage,
          info: 'deleteGroupById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),
})
