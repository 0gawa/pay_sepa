import { NextResponse } from 'next/server';

export async function POST(req: any){
  try{
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const name    = searchParams.get("name");

    const response = await fetch(process.env.API_BASE_URL + `groups/${groupId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        user: {
          name: name,
        }
      })
    });

    if(!response.ok){
      const errorText = await response.text();;
      throw new Error(errorText || `error: ${response.status}`);
    }
    
    return response;
  }catch(error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
