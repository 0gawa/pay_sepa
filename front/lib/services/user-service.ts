import { GetResponse } from '@/lib/types/member';

export const deleteUser = async (groupId: string, userId: number) => {  
  try {
    const response = await fetch(`/api/group/users/destroy?groupId=${groupId}&userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : '削除に失敗しました。');
    }
  }catch (e: any) {
    console.error('Error deleting user:', e);
  }
}

export const returnGroupMemberData = async (groupId: string) => {
  try {
    const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/users?groupId=${groupId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : '取得に失敗しました。');
    }

    const data: GetResponse = await response.json();
    return data.user;
  }catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return [];
  }
}
