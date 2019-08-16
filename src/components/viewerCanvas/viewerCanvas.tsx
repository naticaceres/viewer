import * as React from "react";

export interface ViewerCanvasProps {
  drawing: any;
}

export interface ViewerCanvasState {}

class ViewerCanvas extends React.Component<
  ViewerCanvasProps,
  ViewerCanvasState
> {
  state = {
    viewBox: { x: 0, y: 0, w: 14, h: 14 },
    svgSize: { w: 0, h: 0 },
    isPanning: false,
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
    scale: 100
  };

  divElement: any;

  componentDidMount() {
    let svgElement = this.divElement.children[1];
    this.setState({
      svgSize: { w: svgElement.clientWidth, h: svgElement.clientHeight },
      viewBox: { x: 0, y:0, w: 14, h: 14}
    });
  }

  getViewBoxValue() {
    return (
      this.state.viewBox.x +
      " " +
      this.state.viewBox.y +
      " " +
      this.state.viewBox.w +
      " " +
      this.state.viewBox.h
    );
  }

  getZoomValue() {
    return Math.round(this.state.scale * 100) / 100;
  }

  handleOnMouseWheel(event: any) {    
    let w = this.state.viewBox.w;
    let h = this.state.viewBox.h;
    let mx = event.clientX;
    let my = event.clientY;
    let dw = w*Math.sign(event.deltaY)*0.05;
    let dh = h*Math.sign(event.deltaY)*0.05;
    let dx = dw*mx/this.state.svgSize.w;
    let dy = dh*my/this.state.svgSize.h;
    let viewBox = {x: this.state.viewBox.x+dx, y: this.state.viewBox.y + dy, w: this.state.viewBox.w-dw, h: this.state.viewBox.h - dh};
    let scale = this.state.svgSize.w / viewBox.w;
    this.setState({
      viewBox,
      scale
    });
    console.log('mousewheel dx:' + dx + ', dy:' + dy, ', scale:' + scale);
  }

  handleOnMouseDown(event: any) {
    let startPoint = { x: event.clientX, y: event.clientY };
    this.setState({
      isPanning: true,
      startPoint
    });
    console.log('mousedown x:'+ startPoint.x + ', y:' + startPoint.y);
  }

  handleOnMouseMove(event: any) {
    if (!this.state.isPanning) {
      return;
    }
    let endPoint = { x: event.clientX, y: event.clientY };
    let viewBox = this.getDistance(endPoint);
    this.setState({
      endPoint,
      viewBox
    });
    console.log('mousemove');
  }

  handleOnMouseUp(event: any) {
    if (!this.state.isPanning) {
      return;
    }
    let endPoint = { x: event.clientX, y: event.clientY };
    let viewBox = this.getDistance(endPoint);
    this.setState({
      endPoint,
      viewBox,
      isPanning: false
    });
    console.log('mouseup');
  }

  getDistance(endPoint: any)  {
        let dx = (this.state.startPoint.x - endPoint.x) / this.state.scale * 0.05;
    let dy = (this.state.startPoint.y - endPoint.y) / this.state.scale * 0.05;
    let viewBox = {
      x: this.state.viewBox.x + dx,
      y: this.state.viewBox.y + dy,
      w: this.state.viewBox.w,
      h: this.state.viewBox.h
    };
    console.log('moved distance dx:' + dx + ', dy:' + dy + ', endpoint{ x:' + endPoint.x + ', y:' + endPoint.y + '}');
    return viewBox;
  }

  handleOnMouseLeave(event: any) {
    this.setState({
      isPanning: false
    });
    console.log('mouseleave');
  }

  render() {
    return (
      <div
        style={{ height: "100%", maxHeight: "55rem", width: "100%" }}
        ref={divElement => (this.divElement = divElement)}
      >
        <div>Zoom value: {this.getZoomValue()}</div>
        {/* <div>Scale: {this.state.scale}</div> */}
        <div
          className="svg-container"
          onWheel={e => this.handleOnMouseWheel(e)}
          onMouseDown={e => this.handleOnMouseDown(e)}
          onMouseMove={e => this.handleOnMouseMove(e)}
          onMouseUp={e => this.handleOnMouseUp(e)}
          onMouseLeave={e => this.handleOnMouseLeave(e)}
          style={{height:'100%', width:'100%'}}
        >
          <svg
            viewBox={this.getViewBoxValue()}
            //preserveAspectRatio={"xMinYMin meet"}
            height="900px"
            width="900px"            
            dangerouslySetInnerHTML={{ __html: this.props.drawing.svg }}
            style={{userSelect: 'none'}}
          />
        </div>
      </div>
    );
  }
}

export default ViewerCanvas;
