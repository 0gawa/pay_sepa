export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const group_id = params.id;
  return (
    <>
      sss
    </>
  )
}
