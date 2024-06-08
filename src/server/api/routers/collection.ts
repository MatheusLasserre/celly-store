import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const collectionRouter = createTRPCRouter({
  createCollection: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const isValidName = input.name.replaceAll(' ', '').length >= 1
        if (!isValidName) throw new Error('Nome inválido')
        if (!input.description) throw new Error('Descrição inválida')

        await ctx.prisma.collection.create({
          data: {
            name: input.name,
            description: input.description,
          },
        })

        return {
          message: 'Coleção criada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On collection Router. Error on createCollection',
          stack: errorMessage,
          info: 'createCollection',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getPublicCollection: publicProcedure.query(async ({ ctx }) => {
    try {
      const collections = await ctx.prisma.collection.findMany({
        where: {
          public: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      })
      return collections.map((collection) => ({
        ...collection,
        id: Number(collection.id),
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On collection Router. Error on getPublicCollection',
        stack: errorMessage,
        info: 'getPublicCollection',
        userId: ctx.session?.user.id,
      })
      throw error
    }
  }),

  getAllCollections: authProcedure.query(async ({ ctx }) => {
    try {
      const collections = await ctx.prisma.collection.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      })
      return collections.map((collection) => ({
        id: Number(collection.id),
        name: collection.name,
        description: collection.description,
        productsCount: collection._count.products,
        public: collection.public,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On collection Router. Error on getAllCollections',
        stack: errorMessage,
        info: 'getAllCollections',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar todas as coleções',
      })
    }
  }),

  getAllCollectionsDry: authProcedure.query(async ({ ctx }) => {
    try {
      const collections = await ctx.prisma.collection.findMany({
        select: {
          id: true,
          name: true,
        },
      })
      return collections.map((collection) => ({
        id: Number(collection.id),
        name: collection.name,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On collection Router. Error on getAllCollectionsDry',
        stack: errorMessage,
        info: 'getAllCollectionsDry',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar todas as coleções',
      })
    }
  }),

  updateCollection: authProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        id: z.number(),
        public: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        type dataObjectType = {
          name?: string
          public?: boolean
          description?: string
        }
        const dataObject: dataObjectType = {}

        if (input.name) {
          dataObject.name = input.name
        }
        if (input.public !== undefined) {
          dataObject.public = input.public
        }
        if (input.description !== undefined) {
          dataObject.description = input.description
        }
        if (
          dataObject.name === undefined &&
          dataObject.description === undefined &&
          dataObject.public === undefined
        ) {
          throw new Error('Pelo menos um dos campos deve ser preenchido')
        }
        await ctx.prisma.collection.update({
          where: {
            id: input.id,
          },
          data: dataObject,
        })

        return {
          message: 'Coleção atualizada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On collection Router. Error on updateCollection',
          stack: errorMessage,
          info: 'updateCollection',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getCollectionById: authProcedure
    .input(
      z.object({
        collectionId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const collection = await ctx.prisma.collection.findUnique({
          where: {
            id: input.collectionId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            public: true,
            products: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        })
        if (!collection) throw new Error('coleção não encontrada')

        return {
          ...collection,
          id: Number(collection.id),
          products: collection.products.map((product) => ({
            ...product,
            id: Number(product.id),
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On collection Router. Error on getCollectionById',
          stack: errorMessage,
          info: 'getCollectionById',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar coleção',
        })
      }
    }),

  getCollectionDisplayByName: publicProcedure
    .input(
      z.object({
        collectionName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const collection = await ctx.prisma.collection.findUnique({
          where: {
            name: input.collectionName,
            public: true,
          },
          select: {
            id: true,
            name: true,
            description: true,
            products: {
              select: {
                id: true,
                name: true,
                images: true,
                description: true,
                price: true,
                quantity: true,
              },
            },
          },
        })
        if (!collection) throw new Error('Coleção não encontrada')
        if (!collection.products) throw new Error('Coleção não possui produtos cadastrados')
        return {
          ...collection,
          id: Number(collection.id),
          products: collection.products.map((product) => ({
            ...product,
            id: Number(product.id),
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On collection Router. Error on getCollectionDisplayByName',
          stack: errorMessage,
          info: 'getCollectionDisplayByName',
          userId: ctx.session?.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar coleção',
        })
      }
    }),

  deleteCollectionById: authProcedure
    .input(
      z.object({
        collectionId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.collection.delete({
          where: {
            id: input.collectionId,
          },
        })

        return {
          message: 'Coleção deletada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On collection Router. Error on deleteCollectionById',
          stack: errorMessage,
          info: 'deleteCollectionById',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao deletar coleção',
        })
      }
    }),
})
