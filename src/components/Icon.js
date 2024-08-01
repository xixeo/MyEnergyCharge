// import React from 'react';
// import PropTypes from 'prop-types';

// // SvgIcon 컴포넌트 정의
// const SvgIcon = ({
//   iconClass = '', // 아이콘 이름
//   className = '', // 추가적인 CSS 클래스
//   options = {}, // 추가적인 옵션
//   fill = 'currentColor', // 기본 색상
//   width = '24', // 기본 너비
//   height = '24', // 기본 높이
//   ...props // 기타 props
// }) => {
//   // 아이콘의 viewBox, 경로, 색상 등을 설정
//   const viewBox = options?.viewBox || '0 0 24 24';
//   const iconName = `#icon-${iconClass}`;
//   const gradientId = `svg-${iconClass}-${Math.random().toString(36).substr(2, 9)}`;

//   // Fill 옵션이 활성화된 경우
//   const gradient = options?.fill?.use ? (
//     <defs>
//       <linearGradient id={gradientId} x1={options.fill.x1} y1={options.fill.y1} x2={options.fill.x2} y2={options.fill.y2}>
//         <stop offset={`${options.fill.percent}%`} stopColor={options.fill.color} />
//         <stop offset={`${options.fill.percent}%`} stopColor={options.fill.backColor} />
//       </linearGradient>
//     </defs>
//   ) : null;

//   return (
//     <svg
//       className={`svg-icon ${className}`}
//       viewBox={viewBox}
//       fill={fill}
//       width={width}
//       height={height}
//       aria-hidden="true"
//       {...props}
//     >
//       <use xlinkHref={iconName} />
//       {gradient}
//       {options?.fill?.use && (
//         <path fill={`url(#${gradientId})`} d={options.pathD || ''} />
//       )}
//     </svg>
//   );
// };

// // PropTypes 설정
// SvgIcon.propTypes = {
//   iconClass: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   options: PropTypes.shape({
//     viewBox: PropTypes.string,
//     fill: PropTypes.shape({
//       use: PropTypes.bool,
//       percent: PropTypes.number,
//       color: PropTypes.string,
//       x1: PropTypes.string,
//       y1: PropTypes.string,
//       x2: PropTypes.string,
//       y2: PropTypes.string,
//     }),
//     pathD: PropTypes.string,
//   }),
//   fill: PropTypes.string,
//   width: PropTypes.string,
//   height: PropTypes.string,
// };

// export default SvgIcon;

// import React, { useMemo } from "react";
// import PropTypes from "prop-types";

// // SVG 파일을 동적으로 가져오기 위한 require.context 사용
// const svgContext = require.context("../assets/icons/svg", false, /\.svg$/);

// const SvgIcon = ({
//     iconClass = "", // 아이콘 이름
//     className = "", // 추가적인 CSS 클래스
//     options = {}, // 추가적인 옵션
//     fill = "currentColor", // 기본 색상
//     width = "24", // 기본 너비
//     height = "24", // 기본 높이
//     ...props // 기타 props
// }) => {
//     const svgData = useMemo(() => {
//         try {
//             // 아이콘 이름에 해당하는 SVG 파일을 로드
//             const svgFile = svgContext(`./${iconClass}.svg`);            
//             const svgContent = svgFile.default || svgFile;
//             // // 정규 표현식을 사용하여 파일 이름을 추출합니다.
//             // const match = svgContent.match(/\/([^\/]+\.svg)$/);
//             // const fileName = match ? match[1] : "";
//             // console.log("svgContent", svgContent);

//             // // 파일 이름에서 버전 정보를 제거하고 기본 파일 이름만 남깁니다.
//             // const baseFileName = fileName.split(".").slice(0, -2).join(".");
//             // const resultFileName = `${baseFileName}.svg`;

//             // // 결과를 출력합니다.
//             console.log("SVG Content:", svgContent);
//             // console.log("Extracted File Name:", resultFileName);
//             // SVG 문자열을 DOM으로 파싱
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(svgContent, "image/svg+xml");
//             const svgElement = doc.querySelector("svg");
//             const pathElement = doc.querySelector("path");

//             console.log("path", pathElement);
//             // `viewBox`와 `path` 데이터를 추출
//             const viewBox = svgElement
//                 ? svgElement.getAttribute("viewBox")
//                 : "0 0 24 24";
//             const d = pathElement ? pathElement.getAttribute("d") : "";

//             if (!d) {
//                 console.error(
//                     `Path data is missing in SVG file for iconClass ${iconClass}`
//                 );
//             }

//             return { viewBox, d };
//         } catch (error) {
//             console.error(
//                 `Error loading SVG for iconClass ${iconClass}:`,
//                 error
//             );
//             return { viewBox: "0 0 24 24", d: "" };
//         }
//     }, [iconClass]);

//     const gradientId = `svg-${iconClass}-${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//     const gradient = options?.fill?.use ? (
//         <defs>
//             <linearGradient
//                 id={gradientId}
//                 x1={options.fill.x1}
//                 y1={options.fill.y1}
//                 x2={options.fill.x2}
//                 y2={options.fill.y2}
//             >
//                 <stop
//                     offset={`${options.fill.percent}%`}
//                     stopColor={options.fill.color}
//                 />
//                 <stop
//                     offset={`${options.fill.percent}%`}
//                     stopColor={options.fill.backColor}
//                 />
//             </linearGradient>
//         </defs>
//     ) : null;

//     return (
//         <svg
//             className={`svg-icon ${className}`}
//             viewBox={svgData.viewBox}
//             fill={fill}
//             width={width}
//             height={height}
//             aria-hidden="true"
//             {...props}
//         >
//             {gradient}
//             {options?.fill?.use ? (
//                 <path fill={`url(#${gradientId})`} d={svgData.d} />
//             ) : (
//                 <path d={svgData.d} />
//             )}
//         </svg>
//     );
// };

// SvgIcon.propTypes = {
//     iconClass: PropTypes.string.isRequired,
//     className: PropTypes.string,
//     options: PropTypes.shape({
//         fill: PropTypes.shape({
//             use: PropTypes.bool,
//             percent: PropTypes.number,
//             color: PropTypes.string,
//             x1: PropTypes.string,
//             y1: PropTypes.string,
//             x2: PropTypes.string,
//             y2: PropTypes.string,
//         }),
//     }),
//     fill: PropTypes.string,
//     width: PropTypes.string,
//     height: PropTypes.string,
// };

// export default SvgIcon;


import React from 'react'

export default function Icon() {
  return (
    <div>
      
    </div>
  )
}
