import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

interface GetResponse {
  user: {
    id: number;
    name: string;
  }[];
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
      console.error("エラーが発生しました", e.message);
    }
  }
  const groupMembers = await fetchGroupMembers();

  return (
    <>
      <div>
        <Transactions groupId={ groupId } groupMembers={ groupMembers }/>
      </div>
      <div className="mt-6">
        <Users groupId={ groupId } groupMembers={ groupMembers }/>
      </div>
      <div>

      </div>
    </>
  );
}
