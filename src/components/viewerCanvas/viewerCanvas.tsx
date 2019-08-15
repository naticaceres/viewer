import * as React from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { AutoSizer } from "react-virtualized";

export interface ViewerCanvasProps {
  drawing: any;
}

export interface ViewerCanvasState {}

class ViewerCanvas extends React.Component<
  ViewerCanvasProps,
  ViewerCanvasState
> {
  state = {
    tool: TOOL_NONE,
    value: INITIAL_VALUE
  };

  Viewer: any;

  componentDidMount() {
    //this.Viewer.fitToViewer();
  }

  changeTool(nextTool: any) {
    this.setState({ tool: nextTool });
  }

  changeValue(nextValue: any) {
    this.setState({ value: nextValue });
  }

  fitToViewer() {
    this.Viewer.fitToViewer();
  }

  fitSelection() {
    this.Viewer.fitSelection(40, 40, 200, 200);
  }

  zoomOnViewerCenter() {
    this.Viewer.zoomOnViewerCenter(1.1);
  }

  getSvgContent() {
    console.log(this.props.drawing);
    return this.props.drawing.svg;
  }

  getSvgPanZoomViewer() {
    if (this.props.drawing.svg) {
      return (
        <AutoSizer>
          {(e: { width: number; height: number }) =>
            e.width === 0 || e.height === 0 ? null : (
              <ReactSVGPanZoom
                width={e.width}
                height={e.height}
                ref={(Viewer: any) => (this.Viewer = Viewer)}
                tool={this.state.tool}
                onChangeTool={(tool: any) => this.changeTool(tool)}
                value={this.state.value}
                onChangeValue={(value: any) => this.changeValue(value)}
                onZoom={() => console.log("zoom")}
                onPan={() => console.log("pan")}
                onClick={(event: { x: any; y: any; originalEvent: any }) =>
                  console.log("click", event.x, event.y, event.originalEvent)
                }
              >
                {this.props.drawing.svg}
              </ReactSVGPanZoom>
            )
          }
        </AutoSizer>
      );
    }
  }

  render() {
    return (
      <div style={{ height: "100%", maxHeight: "55rem", width: "100%" }}>
        <button className="btn" onClick={() => this.zoomOnViewerCenter()}>
          Zoom in
        </button>
        <button className="btn" onClick={() => this.fitSelection()}>
          Zoom area 200x200
        </button>
        <button className="btn" onClick={() => this.fitToViewer()}>
          Fit
        </button>

        <hr />

        <div
          style={{ height: "100%", width: "100%", maxHeight: "50rem" }}
          dangerouslySetInnerHTML={{ __html: this.props.drawing.svg }}
        />
      </div>
    );
  }
}

export default ViewerCanvas;
