import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/DatePicker.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/Switch.js";
import "@ui5/webcomponents/dist/Title.js";

import { getTheme, setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import {  } from "@ui5/webcomponents-base/dist/config/Theme.js";
import "@ui5/webcomponents/dist/Assets";

fetch("/user-api/currentUser").then((res) => {
  return res.json();
}).then((user) => {
  document.getElementById("title").textContent = `Hi ${user.firstname}, Welcome to UI5 Web Components!`
});

function switchTheme() {
    if (getTheme() !== "sap_horizon") {
        setTheme("sap_horizon")
    } else {
        setTheme("sap_fiori_3")
    }
  
  displayTheme()
}

function displayTheme() {
    document.getElementById("myThemeLabel").textContent = `Current Theme: ${getTheme()}`
}

displayTheme()

const themeBtn = document.getElementById("themeDialogButton")
themeBtn.addEventListener("click", () => {
  switchTheme()
});

const openBtn = document.getElementById("openDialogButton");
const closeBtn = document.getElementById("closeDialogButton");
const dialog = document.getElementById("hello-dialog");
openBtn.addEventListener("click", () => {
  dialog.show();
});
closeBtn.addEventListener("click", () => {
  dialog.close();
});

// SuccessFactors API 호출 (User 데이터 조회)
function callSuccessFactorsAPI() {
  fetch("/sfsf-api/odata/v2/User?$format=JSON&$top=10")
    .then(response => {
      if (!response.ok) {
        throw new Error('SuccessFactors API 호출 실패');
      }
      return response.json();
    })
    .then(data => {
      console.log("SuccessFactors 사용자 데이터:", data);
      // 여기서 사용자 데이터 처리 로직 수행
    })
    .catch(error => {
      console.error("SuccessFactors API 오류:", error);
    });
}

// ECP API 호출 (UserCollection 데이터 조회)
function callECPAPI() {
  fetch("/ecp-api/UserCollection?$format=json&$top=10")
    .then(response => {
      if (!response.ok) {
        throw new Error('ECP API 호출 실패');
      }
      return response.json();
    })
    .then(data => {
      console.log("ECP 사용자 데이터:", data);
      // 여기서 사용자 데이터 처리 로직 수행
    })
    .catch(error => {
      console.error("ECP API 오류:", error);
    });
}


// 기존 코드 아래에 테스트 버튼 추가 코드
document.addEventListener('DOMContentLoaded', () => {
  // API 테스트 버튼 추가
  const btnContainer = document.createElement('div');
  btnContainer.style.margin = '20px 0';
  
  // SFSF API 테스트 버튼
  const sfsfButton = document.createElement('ui5-button');
  sfsfButton.innerText = 'SuccessFactors 사용자 데이터 조회';
  sfsfButton.addEventListener('click', callSuccessFactorsAPI);
  
  // ECP API 테스트 버튼
  const ecpButton = document.createElement('ui5-button');
  ecpButton.innerText = 'ECP 사용자 데이터 조회';
  ecpButton.style.marginLeft = '10px';
  ecpButton.addEventListener('click', callECPAPI);
  
  btnContainer.appendChild(sfsfButton);
  btnContainer.appendChild(ecpButton);
  
  // 페이지에 버튼 추가
  const bodyElement = document.body;
  bodyElement.insertBefore(btnContainer, bodyElement.lastChild);
});