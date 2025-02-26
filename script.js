function checkHex(string) {
  if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(string)) {
    string = "#" + string;
  }
  return string;
}
function createSVG() {
  const badgeHeight = "20";
  const badgeFontSize = "110";

  const finalColor = checkHex(paramColor || "green");
  const finalLabel = paramLabel || "hello";
  const finalMsg = paramMsg || "world";

  const fontColor = "white";
  const labelColor = "#555555";

  const font = "10px Verdana, Geneva, DejaVu Sans, sans-serif";
  const labelWidth = getTextWidth(finalLabel, font) + 20;
  const msgWidth = getTextWidth(finalMsg, font) + 20;
  const totalWidth = labelWidth + msgWidth;

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("width", totalWidth);
  svg.setAttribute("height", badgeHeight);
  svg.setAttribute("role", "img");

  const title = document.createElementNS(svgNS, "title");
  title.textContent = `${finalLabel}: ${finalMsg}`;
  svg.appendChild(title);

  const linearGradient = document.createElementNS(svgNS, "linearGradient");
  linearGradient.setAttribute("id", "s");
  linearGradient.setAttribute("x2", "0");
  linearGradient.setAttribute("y2", "100%");
  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0");
  stop1.setAttribute("stop-color", "darkgrey");
  stop1.setAttribute("stop-opacity", ".1");
  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "1");
  stop2.setAttribute("stop-opacity", ".1");
  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);
  svg.appendChild(linearGradient);

  const clipPath = document.createElementNS(svgNS, "clipPath");
  clipPath.setAttribute("id", "r");
  const rectClip = document.createElementNS(svgNS, "rect");
  rectClip.setAttribute("width", totalWidth);
  rectClip.setAttribute("height", badgeHeight);
  rectClip.setAttribute("rx", "3");
  rectClip.setAttribute("fill", fontColor);
  clipPath.appendChild(rectClip);
  svg.appendChild(clipPath);

  const gRects = document.createElementNS(svgNS, "g");
  gRects.setAttribute("clip-path", "url(#r)");

  const rectLabelBg = document.createElementNS(svgNS, "rect");
  rectLabelBg.setAttribute("width", labelWidth);
  rectLabelBg.setAttribute("height", badgeHeight);
  rectLabelBg.setAttribute("fill", labelColor);
  gRects.appendChild(rectLabelBg);

  const rectColor = document.createElementNS(svgNS, "rect");
  rectColor.setAttribute("x", labelWidth);
  rectColor.setAttribute("width", msgWidth);
  rectColor.setAttribute("height", badgeHeight);
  rectColor.setAttribute("fill", finalColor);
  gRects.appendChild(rectColor);

  const rectOverlay = document.createElementNS(svgNS, "rect");
  rectOverlay.setAttribute("width", totalWidth);
  rectOverlay.setAttribute("height", badgeHeight);
  rectOverlay.setAttribute("fill", "url(#s)");
  gRects.appendChild(rectOverlay);

  svg.appendChild(gRects);

  // Text
  const gText = document.createElementNS(svgNS, "g");
  gText.setAttribute("fill", fontColor);
  gText.setAttribute("text-anchor", "middle");
  gText.setAttribute("font-family", "Verdana,Geneva,DejaVu Sans,sans-serif");
  gText.setAttribute("text-rendering", "geometricPrecision");
  gText.setAttribute("font-size", badgeFontSize);

  // Shadow
  const labelB = document.createElementNS(svgNS, "text");
  labelB.setAttribute("aria-hidden", "true");
  labelB.setAttribute("x", (labelWidth / 2) * 10);
  labelB.setAttribute("y", "150");
  labelB.setAttribute("fill", "black");
  labelB.setAttribute("fill-opacity", ".3");
  labelB.setAttribute("transform", "scale(.1)");
  labelB.textContent = finalLabel;
  gText.appendChild(labelB);

  const labelF = document.createElementNS(svgNS, "text");
  labelF.setAttribute("x", (labelWidth / 2) * 10);
  labelF.setAttribute("y", "140");
  labelF.setAttribute("fill", fontColor);
  labelF.setAttribute("transform", "scale(.1)");
  labelF.textContent = finalLabel;
  gText.appendChild(labelF);

  // Shadow
  const msgB = document.createElementNS(svgNS, "text");
  msgB.setAttribute("aria-hidden", "true");
  msgB.setAttribute("x", (labelWidth + msgWidth / 2) * 10);
  msgB.setAttribute("y", "150");
  msgB.setAttribute("fill", "black");
  msgB.setAttribute("fill-opacity", ".3");
  msgB.setAttribute("transform", "scale(.1)");
  msgB.textContent = finalMsg;
  gText.appendChild(msgB);

  const msgF = document.createElementNS(svgNS, "text");
  msgF.setAttribute("x", (labelWidth + msgWidth / 2) * 10);
  msgF.setAttribute("y", "140");
  msgF.setAttribute("fill", fontColor);
  msgF.setAttribute("transform", "scale(.1)");
  msgF.textContent = finalMsg;
  gText.appendChild(msgF);

  svg.appendChild(gText);
  svg.style.cursor = "pointer";
  svg.style.userSelect = "none";

  svg.addEventListener("click", () => {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "badge.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  const comment = document.createComment(" Generated by thi747/badger on GitHub ");
  svg.appendChild(comment);

  return svg;
}

function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function obterParametroURL(paramName) {
  const queries = window.location.search;
  const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);
  const resultados = regex.exec(queries);
  if (!resultados?.[2]) return null;
  return decodeURIComponent(resultados[2].replace(/\+/g, " "));
}

// Main
const paramColor = obterParametroURL("color");
const paramLabel = obterParametroURL("label");
const paramMsg = obterParametroURL("msg");

const svg = createSVG();
document.body.appendChild(svg);

if (!paramColor && !paramLabel && !paramMsg) {
  const instructions = document.createElement("div");
  instructions.style.fontFamily = "Verdana,Geneva,DejaVu Sans,sans-serif";
  const URL = `<em>${window.location.href.split("?")[0]}</em>`;

  instructions.innerHTML = `<strong>Usage: color/label/msg</strong><br/>
        ${URL}?<strong>color</strong>=<span style='background-color: green; color: white'>green</span>&<strong>label</strong>=hello&<strong>msg</strong>=world<br/>
        ${URL}?<strong>color</strong>=<span style='background-color: #008000; color: white'>008000</span>&<strong>label</strong>=hello&<strong>msg</strong>=world<br/>
        ${URL}?<strong>color</strong>=<span style='background-color: #008000; color: white'>%23008000</span>&<strong>label</strong>=hello&<strong>msg</strong>=world (%23 = #)`;
  document.body.appendChild(instructions);
}
