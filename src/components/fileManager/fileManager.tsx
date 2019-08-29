import * as React from "react";
import { any } from "prop-types";
const dxf = require("dxf/dist/dxf.js");

export interface ViewerProps {
  onFileParsed: (fileParsed: { svg: any; parsed: any }) => void;
}

export interface ViewerState {}

class FileManager extends React.Component<ViewerProps, ViewerState> {
  state = {
    file: any,
    dxfString: any
  };

  fileReader: any;

  handleFileRead = (e: any) => {
    const content = this.fileReader.result;
    this.state.dxfString = content;
    const helper = new dxf.Helper(content);
    const parsedFile = {
      svg: helper.toSVG(),
      parsed: helper.parsed
    };
    this.drawSvgText(parsedFile);
    this.props.onFileParsed(parsedFile);
  };

  handleFileUpload = (event: any) => {
    const file = event.currentTarget.files[0];
    console.log("file upload");

    this.setState({ file: file });

    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  };

  drawSvgText(parsedFile: any) {
    const parser = new DOMParser();
    const xmlSerializer = new XMLSerializer();

    let xmlSvg = parser.parseFromString(parsedFile.svg, "text/html");

    let id = 100;

    let textEntities = parsedFile.parsed.entities
      .filter((e: any) => e.type === "MTEXT")
      .map((e: any) => {
        id = id + 2;
        let node = xmlSvg.createElement("text");
        node.setAttribute("writing-mode", "lr-tb"); // e.drawingDirection === 1 ? 'lr-tb'
        node.setAttribute("text-anchor", "start"); // e.attachmentPoint === 1 ? 'start'
        node.setAttribute("x", e.x);
        node.setAttribute("y", e.y);
        node.setAttribute("font-size", e.nominalTextHeight);
        node.setAttribute("fill", "currentColor");
        node.setAttribute("id", "ID_" + id);
        node.setAttribute("transform", "matrix(1 0 0 -1 0 " + e.y * 2 + ")");
        node.textContent = e.string;

        return node;
      });

    let svgContent = xmlSvg.body.children[0].children;
    // we need to return all the shapes inside the svg code, without the svg header.
    // the svg header needs to be defined in react DOM to control the zoom / pan
    xmlSvg.body.removeChild(xmlSvg.body.children[0]);
    const svgNodes = svgContent.length;
    for (let index = 0; index < svgNodes; index++) {
      // the elements are taken from the list when appended to the xmldocument. The element taken needs to be the one at the position 0 everytime.
      xmlSvg.body.appendChild(svgContent[0]);
    }

    textEntities.forEach((element: any) => {
      xmlSvg.body.children[0].appendChild(element);
    });

    // narrowing down the stroke-width for better visibility
    xmlSvg.body.children[0].setAttribute("stroke-width", "0.055%");

    const svgStringContent = xmlSerializer.serializeToString(xmlSvg);
    parsedFile.svg = svgStringContent;
    return svgStringContent;
  }

  prepareSVGForViewing(svg: string) {
    const parser = new DOMParser();
    const xmlSerializer = new XMLSerializer();

    let xmlSvg = parser.parseFromString(svg, "text/html");
    // we need to return all the shapes inside the svg code, without the svg header.
    // the svg header needs to be defined in react DOM to control the zoom / pan
    let svgContent = xmlSvg.body.children[0].children;
    xmlSvg.body.removeChild(xmlSvg.body.children[0]);
    const svgNodes = svgContent.length;
    for (let index = 0; index < svgNodes; index++) {
      // the elements are taken from the list when appended to the xmldocument. The element taken needs to be the one at the position 0 everytime.
      xmlSvg.body.appendChild(svgContent[0]);
    }

    // narrowing down the stroke-width for better visibility
    xmlSvg.body.children[0].setAttribute("stroke-width", "0.055%");

    const svgStringContent = xmlSerializer.serializeToString(xmlSvg);
    return svgStringContent;
  }

  render() {
    return (
      <div className="viewer">
        <input type="file" name="file" onChange={this.handleFileUpload} />
      </div>
    );
  }
}

export default FileManager;
