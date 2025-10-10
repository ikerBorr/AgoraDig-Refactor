export abstract class Exception<T> extends Error {
    abstract override readonly name: string
    abstract readonly code: T

    protected constructor(message: string) {
        super(message)
    }

    toPrimitives() {
        return {
            name: this.name,
            message: this.message
        }
    }
}
