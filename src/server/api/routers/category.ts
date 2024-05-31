import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const categoryRouter = createTRPCRouter({
  createCategory: authProcedure
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

        await ctx.prisma.category.create({
          data: {
            name: input.name,
            description: input.description,
          },
        })

        return {
          message: 'Categoria criada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On category Router. Error on createCategory',
          stack: errorMessage,
          info: 'createCategory',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar categoria',
        })
      }
    }),

  getPublicCategories: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.prisma.category.findMany({
        where: {
          public: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      })
      return categories.map((category) => ({
        ...category,
        id: Number(category.id),
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On category Router. Error on getCategories',
        stack: errorMessage,
        info: 'getCategories',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar categorias',
      })
    }
  }),

  getAllCategories: authProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      })
      return categories.map((category) => ({
        id: Number(category.id),
        name: category.name,
        description: category.description,
        productsCount: category._count.products,
        public: category.public,
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On category Router. Error on getAllCategories',
        stack: errorMessage,
        info: 'getAllCategories',
        userId: ctx.session?.user.id,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao buscar todas as categorias',
      })
    }
  }),

  updateCategory: authProcedure
    .input(
      z.object({
        categoryName: z.string().optional(),
        categoryDescription: z.string().optional(),
        categoryId: z.number(),
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

        if (input.categoryName) {
          dataObject.name = input.categoryName
        }
        if (input.public !== undefined) {
          dataObject.public = input.public
        }
        if (input.categoryDescription) {
          dataObject.description = input.categoryDescription
        }
        await ctx.prisma.category.update({
          where: {
            id: input.categoryId,
          },
          data: dataObject,
        })

        return {
          message: 'Categoria atualizada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On category Router. Error on updateCategory',
          stack: errorMessage,
          info: 'updateCategory',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao atualizar categoria',
        })
      }
    }),

  getCategoryById: authProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findUnique({
          where: {
            id: input.categoryId,
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
        if (!category) throw new Error('Categoria não encontrada')

        return {
          ...category,
          id: Number(category.id),
          products: category.products.map((product) => ({
            ...product,
            id: Number(product.id),
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On category Router. Error on getCategoryById',
          stack: errorMessage,
          info: 'getCategoryById',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar categoria',
        })
      }
    }),

  getCategoryDisplayByName: publicProcedure
    .input(
      z.object({
        categoryName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findUnique({
          where: {
            name: input.categoryName,
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
        if (!category) throw new Error('Categoria não encontrada')
        if (!category.products) throw new Error('Categoria não possui produtos cadastrados')
        return {
          ...category,
          id: Number(category.id),
          products: category.products.map((product) => ({
            ...product,
            id: Number(product.id),
          })),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On category Router. Error on getCategorDisplayByName',
          stack: errorMessage,
          info: 'getCategorDisplayByName',
          userId: ctx.session?.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao buscar categoria',
        })
      }
    }),

  deleteCategoryById: authProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.category.delete({
          where: {
            id: input.categoryId,
          },
        })

        return {
          message: 'Categoria deletada com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On category Router. Error on deleteCategory',
          stack: errorMessage,
          info: 'deleteCategory',
          userId: ctx.session.user.id,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao deletar categoria',
        })
      }
    }),
})
