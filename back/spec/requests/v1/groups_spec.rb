RSpec.describe V1::GroupsController, type: :controller do
  let!(:group) { create(:group) }
  # 存在しないグループid
  let(:non_existent_group_id) { group.id + "non_existent" }

  describe 'GET #show' do
    context 'グループが存在する場合' do
      it 'グループの詳細をJSONで返し、ステータス200を返すこと' do
        get :show, params: { id: group.id }
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(group.id)
        expect(json_response['name']).to eq(group.name)
        expect(json_response['description']).to eq(group.description)
      end
    end

    context 'グループが存在しない場合' do
      it 'ステータス404を返すこと' do
        get :show, params: { id: non_existent_group_id }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST #create' do
    context '有効なパラメータの場合' do
      let(:valid_params) { { group: { name: 'New Group', description: 'Description for new group' } } }

      it '新しいグループを作成し、ステータス201を返すこと' do
        expect {
          post :create, params: valid_params
        }.to change(Group, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq('New Group')
        expect(json_response['description']).to eq('Description for new group')
      end
    end

    context '無効なパラメータの場合' do
      let(:invalid_params) { { group: { name: '', description: 'Invalid group' } } }

      it 'グループを作成せず、ステータス422とエラーメッセージを返すこと' do
        expect {
          post :create, params: invalid_params
        }.not_to change(Group, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Name can't be blank")
      end

      let(:missing_name_params) { { group: { description: 'Group with no name' } } }

      it 'nameがない場合もグループを作成せず、ステータス422とエラーメッセージを返すこと' do
        expect {
          post :create, params: missing_name_params
        }.not_to change(Group, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end
  end

  describe 'PUT #update' do
    context 'グループが存在し、有効なパラメータの場合' do
      let(:new_attributes) { { name: 'Updated Group Name', description: 'Updated description' } }

      it 'グループを更新し、ステータス200を返すこと' do
        put :update, params: { id: group.id, group: new_attributes }
        expect(response).to have_http_status(:ok)
        group.reload
        expect(group.name).to eq('Updated Group Name')
        expect(group.description).to eq('Updated description')

        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq('Updated Group Name')
      end
    end

    context 'グループが存在し、無効なパラメータの場合' do
      let(:invalid_attributes) { { name: '' } }

      it 'グループを更新せず、ステータス422とエラーメッセージを返すこと' do
        original_name = group.name
        put :update, params: { id: group.id, group: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        group.reload
        expect(group.name).to eq(original_name)

        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end

    context 'グループが存在しない場合' do
      let(:valid_attributes) { { name: 'Non Existent Update' } }

      it 'ステータス404を返すこと' do
        put :update, params: { id: non_existent_group_id, group: valid_attributes }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'グループが存在する場合' do
      it 'グループを削除し、ステータス200を返すこと' do
        expect {
          delete :destroy, params: { id: group.id }
        }.to change(Group, :count).by(-1)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['message']).to eq('Group deleted successfully')
        expect(Group.exists?(group.id)).to be_falsey
      end
    end

    context 'グループが存在しない場合' do
      it 'ステータス404を返すこと' do
        delete :destroy, params: { id: non_existent_group_id }
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
