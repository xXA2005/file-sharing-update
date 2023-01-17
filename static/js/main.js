const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area"),
uploadbtn = document.querySelector(".upload-btn"),
names = document.querySelector(".names")
document.querySelector('.up').addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0];
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    names.innerHTML = `<p>${fileInput.files[0].name}</p>`
    if (fileName.length != 0){
    uploadbtn.addEventListener("click", () =>{
      uploadFile(fileName)
      fileInput.value = ""
      console.log(fileInput.value)
      uploadbtn.removeEventListener()
    })
  }
  }
}



function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");
  xhr.responseType = 'text'
  xhr.onload = () => {
    document.querySelector('.url').innerHTML = `<a>${xhr.response}</a> <button class="copybtn" onclick="navigator.clipboard.writeText(document.querySelector('.url a').innerHTML)">click to copy</button>`
  }
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    if (total > 5 * 1024 * 1024 * 1024) {
      alert('your file is too large')
      return
    }
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    names.innerHTML = `<p>Uploading...</p>`
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
      names.innerHTML = `<p>Done</p>`
    }
  })
  let data = new FormData(form);
  xhr.send(data);
}