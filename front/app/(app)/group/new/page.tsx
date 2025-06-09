import Form from "@/app/ui/group/create-form";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-lg shadow-xl border">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          新しいグループを作成
        </h2>

        <div className='flex w-fill justify-center'>
          <Form />
        </div>
      </div>
    </div>
  );
};
