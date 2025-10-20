import { ApplicationException } from '@/contexts/shared-kernel/application/exceptions/application.exception'
import { ApplicationExceptionCode } from '@/contexts/shared-kernel/application/exceptions/application-code.exception'

export class AccountAlreadyAssociatedWithActiveMemberError extends ApplicationException {
    readonly name = 'ACCOUNT_ALREADY_ASSOCIATED_WITH_ACTIVE_MEMBER'
    readonly code = ApplicationExceptionCode.OPERATION_NOT_ALLOWED

    constructor(uid?: string) {
        super(
            uid
                ? `Account is already associated with an active member (uid=${uid}).`
                : 'Account is already associated with an active member.',
        )
    }
}

export * as CreateMemberErrors from './create-member.expection'
