export const clx = (...classes: (string | undefined)[]): string => {
    return classes.filter(Boolean).join(' ')
}