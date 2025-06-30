import { Group } from '@/lib/types/group';

export async function returnGroupName(groupId: string) {
  try {
    const response = await fetch(`${process.env.FRONT_GROUP_URL}/api/group/?groupId=${groupId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }
    
    const data: Group = await response.json();

    return data.name;
  }catch (e: any) {
    console.error("Server Component: データフェッチエラー:", e.message);
    return '';
  }
}
