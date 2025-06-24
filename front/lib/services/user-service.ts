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
