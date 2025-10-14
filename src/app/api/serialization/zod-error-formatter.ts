import type { z } from 'zod/index'

export function zodErrorFormatter(error: z.ZodError): string {
    if (!error?.issues?.length) {
        return 'Invalid request body.'
    }

    const fields = Array.from(new Set(error.issues.map((i) => i.path.join('.') || 'field')))

    const fieldList =
        fields.length === 1
            ? fields[0]
            : `${fields.slice(0, -1).join(', ')} and ${fields.at(fields.length - 1)}`

    return `The ${fieldList} ${fields.length > 1 ? 'are' : 'is'} invalid input.`
}
