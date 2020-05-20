import { action, observable } from "mobx";
import moment from 'moment';
import { message } from "antd";
import { GET, POST } from "../../../utils/request";

export class UserManagement {
  
  @observable query: any = {
    userName: '',
    size: 0,
    current: 1,
    pageSize: 10,
    total: 0,
    status: 0,
  };

  @observable userList: any = [];
  @observable loading: any = true;

  @observable selectedRowKeys: any = [];

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  @action.bound
  handleSearchReset(e) {
    this.query = {
      userName: '',
      current: 1,
      pageSize: 10,
    }

    this.getUsers();
  }

  @action.bound
  paginationChange(page, pageSize) {
    console.log(page, pageSize);
    this.query = {
      ...this.query,
      current: page,
      pageSize,
      size: pageSize,
    };
    this.getUsers();
  }

  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action.bound
  async deleteUser(ids) {
    this.loading = true;

    try {
      await POST('/user/deleteUsers', { ids });
      message.success('删除成功');
      await this.getUsers();
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  handleSearchUsernameChange(e) {
    this.query = {
      ...this.query,
      userName: e.target.value,
    }
  }

  @action.bound
  handleSearchStatusChange(val) {
    this.query = {
      ...this.query,
      status: val,
    };
    this.resetSelectedRowKeys();
  }

  @action.bound
  async resetPwds(ids) {
    this.loading = true;
    const { data }: any = await POST('/user/resetPwds', { ids });
    this.loading = false;
  }

  @action.bound
  async getUsers(param = {}) {
    this.loading = true;
    try {
      const { data }: any = await POST('/user/getUsers', {
        current: this.query.current,
        pageNo: this.query.current,
        size: this.query.pageSize,
        status: this.query.status,
        username: this.query.userName,
        ...param,
      });
  
      this.query.total = Number(data.total);
      this.query.pageSize = Number(data.size);
      this.query.current = Number(data.current);
      this.userList = data.records;
    } catch {

    }
    
    this.loading = false;
  }
}
