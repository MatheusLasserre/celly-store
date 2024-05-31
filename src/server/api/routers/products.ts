import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, authProcedure, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'

export const productsRouter = createTRPCRouter({
  createProduct: authProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        quantity: z.number(),
        available: z.boolean(),
        cost: z.number(),
        code: z.string(),
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const isValidName = input.name.replaceAll(' ', '').length >= 1
        if (!isValidName) throw new Error('Nome inválido')
        if (!input.description) throw new Error('Descrição inválida')

        await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
            price: input.price,
            quantity: input.quantity,
            available: input.available,
            cost: input.cost,
            code: input.code,
            categoryId: input.categoryId,
            profit: input.price - input.cost,
          },
        })

        return {
          message: 'Produto criado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on createProduct',
          stack: errorMessage,
          info: 'createProduct',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getAvailableProducts: publicProcedure.query(async ({ ctx }) => {
    try {
      const products = await ctx.prisma.product.findMany({
        where: {
          available: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
        },
      })
      return products.map((collection) => ({
        ...collection,
        id: Number(collection.id),
      }))
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On product Router. Error on getAvailaableProducts',
        stack: errorMessage,
        info: 'getAvailaableProducts',
        userId: ctx.session?.user.id,
      })
      throw error
    }
  }),

  getAllProducts: authProcedure.query(async ({ ctx }) => {
    try {
      const products = await ctx.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
          available: true,
          images: true,
          categoryId: true,
          code: true,
          cost: true,
          profit: true,
        },
      })
      const categories = await ctx.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      })
      return products.map((product) => {
        const categoryName = categories.find((category) => category.id === product.categoryId)?.name
        if (!categoryName) throw new Error('Erro ao buscar categoria')
        return {
          id: Number(product.id),
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantity: product.quantity,
          available: product.available,
          images: product.images,
          categoryId: product.categoryId,
          categoryName: categoryName,
          code: product.code,
          cost: Number(product.cost),
          profit: Number(product.profit),
        }
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      await logOnDb(ctx.prisma, {
        message: 'On product Router. Error on getAllProducts',
        stack: errorMessage,
        info: 'getAllProducts',
        userId: ctx.session?.user.id,
      })
      throw error
    }
  }),

  updateProduct: authProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        id: z.number(),
        available: z.boolean().optional(),
        categoryId: z.number().optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
        cost: z.number().optional(),
        code: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        type dataObjectType = {
          name?: string
          available?: boolean
          description?: string
          categoryId?: number
          price?: number
          quantity?: number
          cost?: number
          profit?: number
          code?: string
        }
        const dataObject: dataObjectType = {}

        if (input.name) {
          dataObject.name = input.name
        }
        if (input.available !== undefined) {
          dataObject.available = input.available
        }
        if (input.description !== undefined) {
          dataObject.description = input.description
        }
        if (input.categoryId !== undefined) {
          dataObject.categoryId = input.categoryId
        }
        if (input.price !== undefined) {
          dataObject.price = input.price
        }
        if (input.quantity !== undefined) {
          dataObject.quantity = input.quantity
        }
        if (input.cost !== undefined) {
          dataObject.cost = input.cost
        }
        if (input.code !== undefined) {
          dataObject.code = input.code
        }
        if (input.cost || input.price) {
          const currentPrice = await ctx.prisma.product.findUnique({
            where: {
              id: input.id,
            },
            select: {
              price: true,
              cost: true,
            },
          })
          if (!currentPrice) throw new Error('Erro ao buscar o preço')
          dataObject.profit =
            (input.price || Number(currentPrice.price)) - (input.cost || Number(currentPrice.cost))
        }
        if (
          dataObject.name === undefined &&
          dataObject.description === undefined &&
          dataObject.available === undefined &&
          dataObject.categoryId === undefined &&
          dataObject.price === undefined &&
          dataObject.quantity === undefined &&
          dataObject.cost === undefined &&
          dataObject.code === undefined
        ) {
          throw new Error('Pelo menos um dos campos deve ser preenchido')
        }
        await ctx.prisma.product.update({
          where: {
            id: input.id,
          },
          data: dataObject,
        })

        return {
          message: 'Produto atualizado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on updateProduct',
          stack: errorMessage,
          info: 'updateProduct',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  getProductById: authProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.prisma.product.findUnique({
          where: {
            id: input.productId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            available: true,
            images: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            code: true,
            cost: true,
          },
        })
        if (!product) throw new Error('coleção não encontrada')

        return {
          id: Number(product.id),
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantity: product.quantity,
          available: product.available,
          images: product.images,
          categoryId: product.category.id,
          categoryName: product.category.name,
          code: product.code,
          cost: Number(product.cost),
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on getProductById',
          stack: errorMessage,
          info: 'getProductById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),

  deleteProductById: authProcedure
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.product.delete({
          where: {
            id: input.productId,
          },
        })

        return {
          message: 'Produto deletado com sucesso',
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        await logOnDb(ctx.prisma, {
          message: 'On product Router. Error on deleteProductById',
          stack: errorMessage,
          info: 'deleteProductById',
          userId: ctx.session.user.id,
        })
        throw error
      }
    }),
})
