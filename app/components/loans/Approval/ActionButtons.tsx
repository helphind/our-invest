export const ActionButtons = ({
    member,
    loanRequestId,
    approveReject,
}: {
    member: any;
    loanRequestId: string;
    approveReject: (data: any) => void;
}) => {
    if (member.approvals.length > 0) return null;

    return (
        <div className="flex gap-2 justify-end">
            <form action={approveReject}>
                <input
                    type="hidden"
                    name="loanRequestId"
                    value={loanRequestId}
                />
                <input type="hidden" name="memberId" value={member.id} />
                <input type="hidden" name="actionType" value="approve" />

                <button className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Approve
                </button>
            </form>

            <form action={approveReject}>
                <input
                    type="hidden"
                    name="loanRequestId"
                    value={loanRequestId}
                />
                <input type="hidden" name="memberId" value={member.id} />
                <input type="hidden" name="actionType" value="reject" />

                <button className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Reject
                </button>
            </form>
        </div>
    );
};
