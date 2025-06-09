import Transactions from '@/app/ui/group/transactions';
import Users from '@/app/ui/group/users';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const group_id = params.id

  return (
    <div className="min-h-screen justify-center p-4 sm:p-6 lg:p-8">
      <div>
        <Transactions groupId={group_id} />
      </div>
      <div>
        <Users groupId={group_id} />
      </div>
      <div>

      </div>
    </div>
  );
}
