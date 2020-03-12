import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import Mock, { Random } from 'mockjs';

export class Park {
  @observable query: any = {
    parkName: '',
    current: 1,
    pageSize: 10
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  @action.bound
  paginationChange(page, pageSize) {
    console.log(page, pageSize);
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.getParkList();
  }

  @action.bound
  async deletePark(parkIds) {
    await POST('/park/deletePark', parkIds);
    await this.getParkList();
  }

  @action.bound
  editPark(record) {
    console.log(record)
  }

  @action.bound
  handleSearchSubmit(e) {
    console.log(e)
  }

  @action.bound
  handleSearchChange(e) {
    console.log(e)
    this.query = {
      ...this.query,
      parkName: e.target.value,
    }
  }

  @action.bound
  handleSearchReset(e) {
    console.log(e)
    this.query = {
      parkName: '',
      current: 1,
      pageSize: 20,
    }
  }
  
  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action
  async getParkList() {
    const { data }: any = await POST('/park/getParkListPage', {
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      parkName: this.query.parkName,
      size: this.query.pageSize,
    });

    // const res = Mock.mock({
    //   "current": this.query.current,
    //   "pages": 10,
    //   "records|10": [
    //     {
    //       "id|+1": 0,
    //       "parkName": "@ctitle",
    //       "parkNo": "@id",
    //       "remark": "@sentence(3, 5)",
    //       "scope": [
    //         {
    //           "id": 0,
    //           "latitude": "string",
    //           "longitude": "string",
    //           "parkId": 0,
    //           "scopeName": "string",
    //           "scopeOrder": 0
    //         }
    //       ]
    //     }
    //   ],
    //   "searchCount": true,
    //   "size": 10,
    //   "total": 100
    // });
    this.total = data.total;
    this.query.pageSize = data.size;
    this.query.current = data.current;
    this.dataSource = data.records;
  }

}
