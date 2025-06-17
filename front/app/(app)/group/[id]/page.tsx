import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

interface GetResponse {
  users: {
    id: number;
    name: string;
  }[];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const groupId = params.id;
  // TODO: Fetch group data by id from API
  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`/api/group/users?groupId=${groupId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '取得に失敗しました。');
      }

      const data: GetResponse = await response.json();
      if (data.users.length === 0) {
        throw new Error('グループにメンバーがいません。');
      }

      console.log(data);
      return data.users;
    }catch (e: any) {
      console.error("エラーが発生しました", e.message);
    }
  }
  const groupMembers = await fetchGroupMembers();
  //const members = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];

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
