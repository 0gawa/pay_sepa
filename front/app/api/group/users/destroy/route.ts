import { NextResponse } from 'next/server';

export async function DELETE(req: any) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId          = searchParams.get("groupId");
    const userId           = searchParams.get("userId");

    const data = await fetch(process.env.API_BASE_URL + `groups/${groupId}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
      },
    });

    if (!data.ok) {
      if (data.status === 404) {
        throw new Error('Group not found');
      }
      const errorData = await data.json();
      throw new Error(errorData.message || `error: ${data.status}`);
    }

    const post = await data.json();
    return NextResponse.json(post);
  } catch(error: any) {
    console.error('Error deleting external data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
