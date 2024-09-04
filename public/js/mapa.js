/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// esto es para que el mapa aparesca,L.map('mapa') este mapa de aqui es un div con el id de mapa para la ubicacion\r\n// la formar de llamar esto es con un scripts que tenemos que crear en:packege.js ejemplo:  \"js\":\"webpack --watch\" si no creamos esto no ppodemos utilizar\r\n(function() {\r\n    // lat an lng this is para la ubicacion if we want change the city we have to change these values\r\n    // este document.querySelector es para mantene la ubicacion que le agrege al mover el pin del mapa \r\n    const lat = document.querySelector(\"#lat\").value || 6.25184; \r\n    const lng =  document.querySelector(\"#lng\").value ||-75.56359;\r\n    const mapa = L.map('mapa').setView([lat, lng ], 16);\r\n    let marker;\r\n\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n    \r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n \r\n    // this code is to put pint\r\n    marker = new L.marker([lat, lng],{\r\n        draggable: true, //and this is to move pint\r\n        autoPan:true// and this is when we move the pint the mapa is center\r\n    })\r\n    .addTo(mapa)\r\n   // this code is to read the la ubicacion del pint\r\n    marker.on(\"moveend\",(e) => {\r\n        marker = e.target\r\n        const posicion = marker.getLatLng();\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)) //esto es para cundo yo suelte el pin del mapa el mapan se centre\r\n\r\n        //esto es para octener el nombre,la latud y la longitud\r\n        geocodeService.reverse().latlng(posicion,13).run(function (error,resultado) {\r\n            console.log(resultado);\r\n            marker.bindPopup(resultado.address.LongLabel)\r\n\r\n             document.querySelector(\".calle\").textContent= resultado?.address?.Address ?? \"\";\r\n             document.querySelector(\"#calle\").value= resultado.address.Address ?? \"\";\r\n             document.querySelector(\"#lat\").value= resultado.latlng.lat ?? \"\";\r\n             document.querySelector(\"#lng\").value= resultado.latlng.lng ?? \"\";\r\n\r\n\r\n            \r\n        })  \r\n\r\n        \r\n    })\r\n\r\n})()\n\n//# sourceURL=webpack://boienesraices/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;