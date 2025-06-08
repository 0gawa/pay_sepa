"use client";

import { useState } from 'react';
import { Form, Textarea, Input, Button } from '@heroui/react';

export default function CreateForm() {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState(['']);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleGroupNameChange = (e: any) => {
    setGroupName(e.target.value);
  };

  const handleGroupDescriptionChange = (e: any) => {
    setGroupDescription(e.target.value);
  };

  const handleMemberChange = (index: any, e: any) => {
    const newMembers = [...members];
    newMembers[index] = e.target.value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index: any) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ

    try{
      const response = await fetch(`/api/group/create?name=${groupName}&description=${groupDescription}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : '投稿に失敗しました。');
      }

      const data = await response.json();
      setSubmitMessage('グループのURL: https://localhost/group/' + data.group.name);
      console.log('グループ名:', groupName);
      console.log('グループ説明:', groupDescription);
      console.log('メンバー:', members.filter(member => member.trim() !== '')); // 空のメンバーを除外
    }catch(e: any){
      setGroupName('');
      setGroupDescription('');
      setMembers(['']);
      console.error("エラーが発生しました")
      setSubmitMessage('入力が正しいか確認してください');
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

        <Input
          id="groupName"
          label="グループ名"
          labelPlacement="outside"
          isRequired
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
          <div key={index} className="flex items-center mt-3">
            <Input
              id={`user${index + 1}`}
              label={`メンバー${index + 1}`}
              labelPlacement="outside"
              value={member}
              onChange={(e) => handleMemberChange(index, e)}
              className="appearance-none block w-full mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`例: 太郎`}
              variant="bordered"
            />
            {members.length > 1 && (
              <Button
                onPress={() => handleRemoveMember(index)}
                className="appearance-none text-red-600 hover:text-red-800 rounded-full py-1 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-2"
                aria-label="メンバーを削除"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            )}
          </div>
        ))}
        <Button
          onPress={handleAddMember}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 "
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          メンバーを追加
        </Button>

        <Button 
          type="submit"
          variant="bordered"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-3"
        >
          グループを作成
        </Button>
      </Form>
    </>
  )
}
