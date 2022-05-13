import React from "react";

import { OverlayPickerProps } from "./OverlayPicker.models";
import OverlayView from "../OverlayView/OverlayView";
import ViewList from "../ViewList/ViewList";

const PickView: React.FC<OverlayPickerProps> = (props) => {
  const { onItemClick = () => null, name = "" } = props;

  return (
    <OverlayView title={props.title}>
      <ViewList
        onItemClick={(index, item) => onItemClick(name, index, item)}
        items={props.items}
        searchable={!!props.searchable}
        indexSelected={props.indexSelected}
      />
    </OverlayView>
  );
};

export default PickView;
