import { NextResponse } from 'next/server';

export async function POST(req: any){
  try{
    const { searchParams } = new URL(req.url);
    const name        = searchParams.get("name");
    const description = searchParams.get("description");

    const response = await fetch(process.env.API_BASE_URL + "groups", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        group: {
          name: name,
          description: description,
        }
      })
    });

    if(!response.ok){
      const errorText = await response.text();;
      throw new Error(errorText || `error: ${response.status}`);
    }
    
    const post = await response.json();
    return NextResponse.json(post);
  }catch(error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
