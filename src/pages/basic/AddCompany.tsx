import React from "react";
import { useObserver} from "mobx-react-lite";
import { Card } from "antd";

export const AddNewParks = () => {

  return useObserver(() => <div>
    <Card title="test">
      
    </Card>
  </div>)
};
