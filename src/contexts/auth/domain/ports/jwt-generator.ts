export interface JwtGenerator {
    execute(params: object): Promise<string>
}
