import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';
// TODO: layoutファイルの作成、useStateでmembersを管理
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // TODO: Fetch group data by id from API
  const members = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];

  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <div>
        <Transactions groupId={id} groupMembers={members}/>
      </div>
      <div className="mt-6">
        <Users groupId={id} groupMembers={members}/>
      </div>
      <div>

      </div>
    </div>
  );
}
