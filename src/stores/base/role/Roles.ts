import { action, observable } from "mobx";
import moment from 'moment';
import { message } from "antd";
import { GET, POST } from "../../../utils/request";

export class Roles {
  
  @observable query: any = {
    name: '',
    size: 0,
    current: 1,
    pageSize: 10,
    total: 0,
    status: 0,
  };

  @observable roleList: any = [];
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
      name: '',
      current: 1,
      pageSize: 10,
    }

    this.getRoleList();
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
    this.getRoleList();
  }

  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action.bound
  async deleteRole(ids) {
    this.loading = true;

    try {
      await POST('/role/deleteRoles', { ids });
      await this.getRoleList();
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  handleSearchNameChange(e) {
    this.query = {
      ...this.query,
      name: e.target.value,
    }
  }

  @action.bound
  handleSearchStatusChange(val) {
    this.query = {
      ...this.query,
      status: val,
    }
  }

  @action.bound
  async getRoleList() {
    this.loading = true;
    try {
      const { data }: any = await POST('/role/getRoles', {
        current: this.query.current,
        pageNo: this.query.current,
        size: this.query.pageSize,
        name: this.query.name,
        status: this.query.status,
      });
  
      this.query.total = data.total;
      this.query.pageSize = data.size;
      this.query.current = data.current;
      this.roleList = data.records;
    } catch {

    }
    
    this.loading = false;
  }
}
