import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // 1. (가장 중요) 서버 환경 변수에서 TTB 키를 *직접* 읽어옵니다.
  //    이 키는 클라이언트(브라우저)에서 온 것이 아닙니다!
  const ttbKey = process.env.ALADIN_TTB_KEY; 

  // 2. 클라이언트가 query를 안 보냈거나, 서버에 ttbKey가 설정 안 됐으면 에러
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
  if (!ttbKey) {
    console.error('ALADIN_TTB_KEY is not set in .env file');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  if (query.length !== 13) {
    return NextResponse.json({ error: 'This endpoint only supports ISBN-13 lookups' }, { status: 401 });
  }

  // 3. 서버가 비밀 키를 포함하여 알라딘에 요청을 보냅니다.
  const url = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${ttbKey}&itemIdType=ISBN13&ItemId=${query}&output=js&Version=20131101`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error looking up books:', error);
    return NextResponse.json({ error: 'Failed to looking up books' }, { status: 500 });
  }
}