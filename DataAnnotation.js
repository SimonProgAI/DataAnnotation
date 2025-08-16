/*import jsdom from "jsdom";
const { JSDOM } = jsdom;*/
const urlDoc =
  "https://docs.google.com/document/d/e/2PACX-1vTER-wL5E8YC9pxDx43gk8eIds59GtUUk4nJo_ZWagbnrH0NFvMXIw6VWFLpf5tWTZIT9P9oLIoFJ6A/pub";

function getHtmlData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        //console.log(typeof(response));
        const responseBodyText = response.text();
        //console.log(responseBodyText);
        return responseBodyText;
      }
    })
    .then((htmlTextBody) => {
      //console.log(htmlTextBody);
      const DOM = new DOMParser(htmlTextBody);
      const docu = DOM.window.document;

      const allValuesArr = Array.from(docu.getElementsByClassName("c0")).map(
        (text) => text.textContent
      );
      const valuesArr = allValuesArr.slice(5);
      const numsArr = [];
      const shapesArr = [];
      const xArr = [];
      const yArr = [];
      const shapeNumSeparator = () => {
        for (const char of valuesArr) {
          if (isNaN(char)) {
            shapesArr.push(char);
          }
          if (!isNaN(char)) {
            numsArr.push(char);
          }
        }
      };
      const xySeparator = () => {
        for (let i = 0; i < numsArr.length; i++) {
          if (i % 2 === 0) {
            xArr.push(numsArr[i]);
          } else yArr.push(numsArr[i]);
        }
      };
      shapeNumSeparator();
      xySeparator();
      const coordShapesObjArr = [];
      const createShapeObjArr = (xArr, yArr, shapesArr) => {
        for (let i = 0; i < shapesArr.length; i++) {
          const obj = { x: xArr[i], y: yArr[i], character: shapesArr[i] };
          coordShapesObjArr.push(obj);
        }
      };
      createShapeObjArr(xArr, yArr, shapesArr);

      const graphicDisplay = coordShapesObjArr
        .map((obj, index) => {
          const uniCode1 = 9608;
          const uniCode2 = 9617;
          const blockChar = String.fromCharCode(uniCode1);
          const shadeChar = String.fromCharCode(uniCode2);
          const color =
            coordShapesObjArr.character === blockChar ? "black" : "grey";
          return `<rect x="${obj.x}" y="${obj.y}" width="1" height="2" fill=${color}/>`;
        })
        .join("");
      const svg = `<svg width="200" height="200" viewBox="0 0 200 200" id="renderer">${graphicDisplay}</svg>`;
      let outputArea = document.getElementById("outputArea");
      outputArea.innerHTML = svg;
      console.log(graphicDisplay);
    })
    .catch((error) => {
      console.error("Failed to fetch page: ", error);
    });
}

getHtmlData(urlDoc);
//console.log(rawData);
