import React from 'react';
import {useObserver} from "mobx-react-lite";

export const LocationDisplay = () => {

  return useObserver(() => (
      <div className="leading-5 flex-1 flex items-end mr-4">
        <div className="head-right text-center">
          <div>武汉 蔡甸区</div>
        </div>
      </div>
    )
  );
}

