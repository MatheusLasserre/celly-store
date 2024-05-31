import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

type ErrorWithMessage = {
    message: string
  }
  
  function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    )
  }
  
  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError
  
    try {
      return new Error(JSON.stringify(maybeError))
    } catch {
      // fallback in case there's an error stringifying the maybeError
      // like with circular references for example.
      return new Error(String(maybeError))
    }
  }
  
  export function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message
  }

  export async function logOnDb(
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    error: {
      message: string
      stack: string
      info: string
      userId?: number
    },
  ) {
    await prisma.errorLogs.create({
      data: {
        message: error.message.slice(0, 180),
        stack: error.stack.slice(0, 180),
        info: error.info,
        userId: error.userId,
      },
    })
  }