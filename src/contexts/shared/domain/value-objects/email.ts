import { ValueObject } from './value-object'
import { EmailErrors } from '../exceptions/email.exceptions'

const EMAIL_MAX_LENGTH = 254
const LOCAL_MAX_LENGTH = 64
const LABEL_MAX_LENGTH = 63

const LOCAL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i
const LABEL_REGEX = /^[a-z0-9-]+$/i
const TLD_REGEX = /^[a-z]{2,}$/i

export class Email extends ValueObject<string> {
    constructor(raw: string) {
        const normalized = Email.normalize(raw)
        super(normalized)
        this.ensureIsValid(normalized)
    }

    get local(): string {
        return this.value.split('@')[0] || ''
    }

    get domain(): string {
        return this.value.split('@')[1] || ''
    }

    private static normalize(value: string): string {
        return (value ?? '').trim().toLowerCase()
    }

    private ensureIsValid(email: string): void {
        this.ensureLength(email)
        this.ensureSingleAt(email)

        const [local, domain] = email.split('@')
        this.ensureLocal(local)
        this.ensureDomain(domain)
    }

    private ensureLength(email: string): void {
        if (email.length < 3 || email.length > EMAIL_MAX_LENGTH) {
            throw new EmailErrors.EmailLengthOutOfRangeError(3, EMAIL_MAX_LENGTH, email.length)
        }
    }

    private ensureSingleAt(email: string): void {
        const atCount = (email.match(/@/g) || []).length
        if (atCount === 0) throw new EmailErrors.EmailMissingAtError()
        if (atCount > 1) throw new EmailErrors.EmailMultipleAtError(atCount)
    }

    private ensureLocal(local: string | undefined): void {
        if (!local || local.length === 0 || local.length > LOCAL_MAX_LENGTH) {
            throw new EmailErrors.EmailLocalPartLengthError(LOCAL_MAX_LENGTH, local?.length || 0)
        }
        if (local.startsWith('.') || local.endsWith('.')) {
            throw new EmailErrors.EmailLocalPartDotPositionError()
        }
        if (local.includes('..')) {
            throw new EmailErrors.EmailLocalPartConsecutiveDotsError()
        }
        if (!LOCAL_REGEX.test(local)) {
            throw new EmailErrors.EmailLocalPartInvalidCharsError()
        }
    }

    private ensureDomain(domain: string | undefined): void {
        const labels = domain?.split('.')
        if (!labels || labels.length < 2) {
            throw new EmailErrors.EmailDomainMissingTldError()
        }

        for (const label of labels) {
            if (label.length === 0 || label.length > LABEL_MAX_LENGTH) {
                throw new EmailErrors.EmailDomainLabelLengthError(LABEL_MAX_LENGTH)
            }
            if (!LABEL_REGEX.test(label)) {
                throw new EmailErrors.EmailDomainLabelInvalidCharsError()
            }
            if (label.startsWith('-') || label.endsWith('-')) {
                throw new EmailErrors.EmailDomainLabelHyphenPositionError()
            }
        }

        const tld = labels[labels.length - 1] || ''
        if (!TLD_REGEX.test(tld)) {
            throw new EmailErrors.EmailTldInvalidError()
        }
    }
}
