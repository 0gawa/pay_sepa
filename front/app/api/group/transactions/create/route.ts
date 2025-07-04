import { NextResponse } from 'next/server';

export async function POST(req: any){
  try{
    const { searchParams } = new URL(req.url);
    const groupId          = searchParams.get("groupId");
    const amount           = searchParams.get("amount");
    const description      = searchParams.get("description");
    const payerId          = searchParams.get("payerId");
    const stringArrayParticipantIds = searchParams.get("participants")?.split(',');;

    const participantIds: number[] | undefined = stringArrayParticipantIds?.map(Number);

    const response = await fetch(process.env.API_BASE_URL + `groups/${groupId}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        transaction: {
          amount: amount,
          description: description,
          payer_id: payerId,
          participant_ids: participantIds,
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
