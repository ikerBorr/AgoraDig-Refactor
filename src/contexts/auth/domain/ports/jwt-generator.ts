export interface JwtGenerator {
    encode(params: object): Promise<string>
    decode<T>(session: string): Promise<T>
}
