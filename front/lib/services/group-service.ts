import { Group } from '@/lib/types/group';

export async function returnGroup(groupId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONT_GROUP_URL}/api/group/?groupId=${groupId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }
    
    const data: Group = await response.json();

    return data;
  }catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return {
      id: '',
      name: '',
      description: '',
    };
  }
}
