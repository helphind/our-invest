import { getAllMembers } from "../services/member.service";
import MembersList from "../components/members/MembersList";

export default async function Members() {
    const members = await getAllMembers();

    return <MembersList members={members} />;
}
