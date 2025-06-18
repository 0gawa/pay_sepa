import { Member }   from '@/app/type/member';
import GroupMembersClientWrapper from './_components/group-members-client-wrapper'; 

interface GetResponse {
  user: Member[];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const groupId = params.id;
  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/users?groupId=${groupId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '取得に失敗しました。');
      }

      const data: GetResponse = await response.json();

      console.log(data);
      return data.user;
    }catch (e: any) {
      console.error("Server Component: データフェッチエラー:", e.message);
      return [];
    }
  }
  const groupMembers: Member[] = await fetchGroupMembers();

  return (
    <>
      <GroupMembersClientWrapper groupId={groupId} initialGroupMembers={groupMembers} />
    </>
  );
}
