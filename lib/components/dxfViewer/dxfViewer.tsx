import * as React from "react";
import FileManager from "../fileManager/fileManager";
import ViewerCanvas from "../viewerCanvas/viewerCanvas";
import { string, any } from "prop-types";

export interface DxfViewerProps {}

export interface DxfViewerState {}

class DxfViewer extends React.Component<DxfViewerProps, DxfViewerState> {
  state = {
    fileParsed: {
      svg: (
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="green"
            stroke-width="4"
            fill="yellow"
          />
        </svg>
      ),
      parsed: null
    },
    canvasKey: 1
  };

  handleFileParsed = (fileParsed: any) => {
    this.setState({ fileParsed, canvasKey: this.state.canvasKey++ });
  };

  render() {
    return (
      <div style={{ height: "100%", maxHeight: "55rem" }}>
        <FileManager
          onFileParsed={fileParsed => this.handleFileParsed(fileParsed)}
        />
        <ViewerCanvas
          key={this.state.canvasKey}
          drawing={this.state.fileParsed}
        />
      </div>
    );
  }
}

export default DxfViewer;
