import { Form, InputNumber } from 'antd';
import React from 'react';

import { EditableContext, TableData } from './MyEditableTable';

interface Props {
  record: TableData[];
  dataIndex: string;
  title: string;
  children: '';
  editable: boolean;
  restProps: '';
  editing: boolean;
}
interface State {
  editing: boolean;
  turns: number;
  isUpdate: boolean;
}

export class EditableCell extends React.Component<Props, State> {
  public form: any;
  public input: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false,
      turns: -1,
      isUpdate: false,
    };
  }

  getMuTurns = (value: number) => {
    this.setState({ turns: value, isUpdate: true });
  };

  renderCell = (form: any) => {
    this.form = form;
    const { getFieldDecorator } = form;
    const { children, dataIndex, record, title, editing } = this.props;
    console.log('props from father', editing)
    return editing && dataIndex === 'paramValue' ? (
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          // initialValue: record[dataIndex],
        })(<InputNumber />)}
      </Form.Item>
    ) : (
      children
    );
  };

  render() {
    const { editable, dataIndex, editing,  title, record, children, ...restProps } = this.props;
    console.log(editable, dataIndex,record,restProps, editing,  111111)
    return <td {...restProps}>{<EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>}</td>;
  }
}
