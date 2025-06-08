import { NextResponse } from 'next/server';

export async function Post(req: any){
  try{
    const { searchParams } = new URL(req.url);
    const name        = searchParams.get("name");
    const description = searchParams.get("description");

    const data = await fetch(process.env.API_BASE_URL + "groups", {
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

    if(!data.ok){
      const errorData = await data.json();
      throw new Error(errorData.message || `error: ${data.status}`);
    }

    const post = await data.json();
    return NextResponse.json(post);
  }catch(error: any){
    console.error('Error fetching external data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
