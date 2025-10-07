export abstract class ApplicationException extends Error {
    abstract override readonly name: string
    protected constructor(message: string) {
        super(message)
    }
}
