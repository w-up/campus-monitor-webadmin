import { Button, Form, Popconfirm, Table, InputNumber } from 'antd';
import React from 'react';

import { EditableCell } from './MyEditableCell';

export const EditableContext = React.createContext(Form);


export interface TableData {
  id: number;
  paramDesc: string;
  paramValue: number;
}

interface Props {
  skuId: string;
}
interface State {
  editingKey: string;
}

const data = [
  {
    id: 1,
    paramValue: 33,
    paramDesc: '参数说明'
  }
]
export class EditableTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editingKey: '',
    };
  }

  isEditing = (id: string) => {
    console.log(id, 'compare', id === this.state.editingKey)
    return id === this.state.editingKey
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form: any, record: any) {
    form.validateFields(async (error: any, row: { turns: number }) => {
      if (error) {
        return;
      }
    });
  }

  edit(key: string) {
    this.setState({ editingKey: key });
  }

  render() {
    const columnsOrigin = [
      {
        title: '参数代码',
        dataIndex: 'id',
      },
      {
        title: '参数说明',
        dataIndex: 'paramDesc',
        key: 'teacherName',
      },
      {
        title: '参数值',
        // dataIndex: 'paramValue',
        width: '30%',
        editable: true,
        render: (record: {id: string, editing: boolean}) => {
          const editable = this.isEditing(record.id);
          console.log('editable, id', editable, )
          return  editable ? (
            <td><InputNumber /></td>
          ) : (<td>aaaa</td>)
        }
      },
      {
        title: '操作',
        dateIndex: 'actions',
        render: (record: { id: string }) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record.id);
          console.log(editable, 'ssss')
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    type="primary"
                    size="small"
                    onClick={async () => {
                      this.save(form, record);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel()}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <Button size="small" type="primary" disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
              编辑
            </Button>
          );
        },
      },
    ];

    const columns = columnsOrigin.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: { id: number }) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(String(record.id)),
        }),
      };
    });

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    console.log('columns', columns)
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowKey={record => `${record.id}`}
          bordered
          pagination={false}
          columns={columns}
          dataSource={data}
        />
      </div>
    );
  }
}
