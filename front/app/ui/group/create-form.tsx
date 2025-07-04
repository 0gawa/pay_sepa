'use client';

import { useState } from 'react';
import { Form } from '@heroui/react';
import { useRouter } from 'next/navigation';
import Textarea from '@/app/ui/form/textarea-input';
import Button from '@/app/ui/button';
import Input from '@/app/ui/form/text-input'; 
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PostResponse {
  id: string;
  name: string;
  description: string;
}

export default function CreateForm() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState(['']);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleGroupNameChange = (e: any) => {
    setGroupName(e.target.value);
  };

  const handleGroupDescriptionChange = (e: any) => {
    setGroupDescription(e.target.value);
  };

  const handleMemberChange = (index: number, e: any) => {
    const newMembers = [...members];
    newMembers[index] = e.target.value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitMessage('');

    try{
      const responseGroup = await fetch(`/api/group/create?name=${groupName}&description=${groupDescription}`, {
        method: 'POST',
      });

      if (!responseGroup.ok) {
        const errorData = await responseGroup.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : 'グループ作成に失敗しました。');
      }

      const data: PostResponse = await responseGroup.json();
      setSubmitMessage(`グループのURL: ${process.env.NEXT_PUBLIC_FRONT_GROUP_URL}group/${data.id}`);

      if (data && data.id) {
        router.push(`/group/url?id=${data.id}`);
      } else {
        console.error("group作成後の遷移ができませんでした。");
      }
      
      // メンバーの作成
      const members_array = members.filter(member => member.trim() !== '');
      members_array.forEach(async (member: string) => {
        const responseMembers = await fetch(`/api/group/users/create?name=${encodeURIComponent(member)}&groupId=${data.id}`, {
          method: 'POST',
        });

        if (!responseMembers.ok) {
          await fetch(`/api/group/users/create?name=${encodeURIComponent(member)}&groupId=${data.id}`, {
            method: 'POST',
          });
        }
      })      

    }catch(e: any){
      console.error("エラーが発生しました")
      setSubmitMessage('入力が正しいか確認してください');
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form className="w-full max-w-xs" onSubmit={ handleSubmit }>
        {submitMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
            <span className="block sm:inline">{submitMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-700">グループを作成中...</p>
            <p className="text-lg text-gray-700">30秒以上かかることもございます。</p>
          </div>
        ) : (
          <>
            <Input
              id="groupName"
              label="グループ名"
              required
              value={groupName}
              onChange={handleGroupNameChange}
              className="w-full sm:text-sm"
              placeholder="例: 週末の飲み会"
            />

            <Textarea
              id="groupDescription"
              label="グループの説明 (任意)"
              value={groupDescription}
              onChange={handleGroupDescriptionChange}
              className="w-full mt-3 sm:text-sm"
              placeholder="このグループの目的や詳細を記入してください"
            />
            
            {members.map((member, index) => (
              <div key={index} className="flex items-center mt-2">
                <Input
                  id={`user${index + 1}`}
                  label={`メンバー${index + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(index, e)}
                  className="block w-full mt-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={`例: 太郎`}
                />
                {members.length > 1 && (
                  <Button
                    onClick={() => handleRemoveMember(index)}
                    color="danger"
                    className="ml-2 mt-2"
                    aria-label="メンバーを削除"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={handleAddMember}
              className= "flex items-center justify-center text-blue-700 bg-blue-100 hover:bg-blue-200 "
            >
              <PlusIcon className="h-5 w-5 mr-1"/>
              メンバーを追加
            </Button>

            <Button 
              type="submit"
              className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-3"
            >
              グループを作成
            </Button>
          </>
        )}
      </Form>
    </>
  )
}
