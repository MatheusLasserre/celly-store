import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const businessRouter = createTRPCRouter({
  getBusinessInfo: authProcedure.query(async ({ ctx }) => {
    try {
      const business = await ctx.prisma.business.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          whatsapp: true,
        },
      })
      if (!business) {
        const newBusiness = await ctx.prisma.business.create({
          data: {
            name: 'Atualize o nome da empresa',
            email: 'Atualize este email',
            phone: 'Atualize este telefone',
            whatsapp: 'Atualize o número do whatsapp',
          },
        })

        return {
          ...newBusiness,
          id: Number(newBusiness.id),
        }
      }

      return {
        ...business,
        id: Number(business.id),
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On business Router. Error on getBusinessInfo',
        stack: errorMessage,
        info: 'getBusinessInfo',
        userId: ctx.session.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar informações da empresa',
      })
    }
  }),

  updateBusiness: authProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        whatsapp: z.string(),
        featuredCollectionId: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        type dataObjectType = {
          name?: string
          email?: string
          phone?: string
          whatsapp?: string
          featuredCollectionId?: number
        }
        const dataObject: dataObjectType = {}

        if (input.email) {
          dataObject.email = input.email
        }
        if (input.name) {
          dataObject.name = input.name
        }
        if (input.phone) {
          dataObject.phone = input.phone
        }
        if (input.whatsapp) {
          dataObject.whatsapp = input.whatsapp
        }
        if (input.featuredCollectionId) {
          dataObject.featuredCollectionId = input.featuredCollectionId
        }
        const businessId = await ctx.prisma.business.findFirst({
          select: {
            id: true,
          },
        })
        if (!businessId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao buscar informações da empresa',
          })
        }
        await ctx.prisma.business.update({
          where: {
            id: businessId.id,
          },
          data: dataObject,
        })
        return {
          message: 'Empresa atualizada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On business Router. Error on updateBusiness',
          stack: errorMessage,
          info: 'updateBusiness',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getPublicBusinessInfo: publicProcedure.query(async ({ ctx }) => {
    try {
      const business = await ctx.prisma.business.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          whatsapp: true,
        },
      })
      if (!business) {
        throw new Error('Empresa não encontrada')
      }

      return {
        ...business,
        id: Number(business.id),
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On business Router. Error on getPublicBusinessInfo',
        stack: errorMessage,
        info: 'getPublicBusinessInfo',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar informações públicas da empresa',
      })
    }
  }),
})
