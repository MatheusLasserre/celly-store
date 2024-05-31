export const getPagination = (input: { page?: number; limit?: number; [key: string]: any }) => {
  const page = input.page || 1
  const limit = input.limit ? (input.limit > 50 ? 50 : input.limit) : 10
  const offset = (page - 1) * limit
  return {
    page,
    limit,
    offset,
  }
}
