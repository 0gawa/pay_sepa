import Form from "@/app/ui/group/create-form";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          新しいグループを作成
        </h2>
        <div className='flex w-full justify-center'>
          <Form />
        </div>
      </div>
    </div>
  );
};
