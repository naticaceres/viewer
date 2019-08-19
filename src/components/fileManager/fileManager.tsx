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

  handleTransform() {
    console.log("transform clicked");
  }

  handleFileUpload = (event: any) => {
    const file = event.currentTarget.files[0];
    console.log("file upload");
    console.log(file);
    this.setState({ file: file });

    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  };

  drawSvgText(parsedFile: any) {
    let id = 100;
    let textEntities = parsedFile.parsed.entities
      .filter((e: any) => e.type === "MTEXT")
      .map((e: any) => {
        id = id + 2;
        return (
          `<text writing-mode="lr-tb" text-anchor="start" x="` +
          e.x +
          `" y="` +
          e.y +
          `" font-size="` +
          e.nominalTextHeight +
          `" fill="currentColor" id="` +
          "ID_" +
          id +
          `" transform="matrix(1 0 0 -1 0 ` +
          e.y * 2 +
          `)">
     <tspan font-size="` +
          e.nominalTextHeight +
          `" baseline-shift="-100%">` +
          e.string +
          `</tspan>
    </text>
        `
        );
      })
      .join("");
    const textLayer =
      `<g id="draft" transform="matrix(1 0 0 -1 0 -5.93)" stroke-width="0.0042925">
      <g id="ID_0" color="rgb(0,0,0)" stroke="currentColor" fill="none" stroke-width="0.0042925">` +
      textEntities +
      `</g>
      </g>`;
    parsedFile.svg = parsedFile.svg.replace("</svg>", textLayer + " </svg>");
    const svgContent = this.prepareSVGForViewing(parsedFile.svg);
    parsedFile.svg = svgContent;
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
    xmlSvg.body.children[0].setAttribute('stroke-width', '0.055%');

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
