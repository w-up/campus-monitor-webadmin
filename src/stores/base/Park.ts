import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import Mock, { Random } from "mockjs";

export class Park {
  @observable query: any = {
    parkName: "",
    current: 1,
    pageSize: 10,
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];
  @observable loading: boolean = false;

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
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
    await POST("/park/deletePark", parkIds);
    await this.getParkList();
  }

  @action.bound
  handleSearchSubmit(e) {
    console.log(e);
  }

  @action.bound
  handleSearchChange(e) {
    console.log(e);
    this.query = {
      ...this.query,
      parkName: e.target.value,
    };
  }

  @action.bound
  handleSearchReset(e) {
    console.log(e);
    this.query = {
      parkName: "",
      current: 1,
      pageSize: 10,
    };
    this.getParkList();
  }

  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action.bound
  async getParkList(param = {}) {
    this.loading = true;
    const res: any = await POST("/park/getParkListPage", {
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      parkName: this.query.parkName,
      size: this.query.pageSize,
      ...param,
    });
    if (res.data) {
      this.total = res.data.total;
      this.query.pageSize = res.data.size;
      this.query.current = res.data.current;
      this.dataSource = res.data.records;
      this.loading = false;
    }
  }
}
