import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { authProcedure, createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getErrorMessage, logOnDb } from '~/utils/api/error'
import { encryptCookie } from '~/utils/security/encrypt'
import { hashPassword, validatePassWord } from '~/utils/security/password'

export const authRouter = createTRPCRouter({
  loginUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
        userPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // should return cookie
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: input.userEmail,
          },
        })

        if (!user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User not found',
          })
        }

        const isPasswordCorrect = await validatePassWord(input.userPassword, user.password)

        if (!isPasswordCorrect) {
          return {
            cookie: null,
            status: 400,
            error: 'Password is incorrect',
          }
        }

        const userWithoutPassword = {
          id: Number(user.id),
          name: user.name,
        }

        const createCookie = encryptCookie(userWithoutPassword)

        return {
          cookie: createCookie,
          status: 200,
          error: null,
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        await logOnDb(ctx.prisma, {
          message: 'On Auth Router. Error on loginUser',
          stack: errorMessage,
          info: 'Error on loginUser mutation',
          userId: ctx.session?.user.id,
        })
        throw error
      }
    }),

  updateUserPassword: authProcedure
    .input(
      z.object({
        userEmail: z.string(),
        userPassword: z.string(),
        userConfirmPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: input.userEmail,
          },
        })

        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User not found',
          })
        }

        const hashedPassword = await hashPassword(input.userConfirmPassword)

        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashedPassword,
          },
        })

        return {
          success: true,
          status: 200,
          error: null,
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        await logOnDb(ctx.prisma, {
          message: 'On Auth Router. Error on updateUserPassword',
          stack: errorMessage,
          info: 'Error on updateUserPassword mutation',
          userId: ctx.session?.user.id,
        })
        throw error
      }
    }),

  getSession: authProcedure.query(async ({ ctx }) => {
    const session = ctx.session
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No session found',
      })
    }

    return {
      user: session.user,
      status: 200,
      error: null,
    }
  }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
    ).mutation(async ({ input, ctx }) => {
      // also should return cookie
      if(input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Passwords do not match',
        })
      }
      const hashedPassword = await hashPassword(input.password)

      return await ctx.prisma.$transaction(
        async (prisma) => {
          try {
            const createUser = await prisma.user.create({
              data: {
                name: input.name,
                email: input.email,
                password: hashedPassword,
              },
            })

            const userWithoutPassword = {
              id: Number(createUser.id),
              name: createUser.name,
            }

            const createCookie = encryptCookie(userWithoutPassword)

            return {
              cookie: createCookie,
              status: 200,
              error: null,
            }
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            await logOnDb(ctx.prisma, {
              message: 'On Auth Router. Error on createUser',
              stack: errorMessage,
              info: 'Error on createUser mutation',
              userId: ctx.session?.user.id,
            })
            throw error
          }
        },
        {
          maxWait: 10000,
          timeout: 10000,
        },
      )
    }),
})
