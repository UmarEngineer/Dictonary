
const btnSubmit = document.getElementById('btn-submit');
const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
let audio = document.getElementById('audio');
const infoSection = document.querySelector('.info-section');
let inputt = document.getElementById('tekst');
const loader = document.querySelector("#loading");
let word;


function displayLoading() {
   loader.classList.add("display");
   // to stop loading after some time
   // setTimeout(() => {
   //    loader.classList.remove("display");
   // }, 8000);
}
function hideLoading() {
   loader.classList.remove("display");
}

window.addEventListener('keydown', (e) => {

   if (e.keyCode == 13) {
      btnSubmit.style.transform = 'scale(1)'
      setTimeout(() => {
         btnSubmit.style.transform = 'scale(0.97)'
      }, 50)
      searchFunc()
   }
});
btnSubmit.addEventListener('click', () => {
   searchFunc()
});

const searchFunc = () => {
   inputValue = document.getElementById('tekst').value;
   if (inputValue == '') {
      infoSection.innerHTML = `
         <p style="text-align:center; "><b>Iltimos, oldin biror so'z kiriting</b></p>
      `
      setTimeout(() => {
         infoSection.innerHTML = ""
      }, 1500)
   }
   else if(word != inputValue) {
      displayLoading();
      fetch(`${url}${inputValue}`)
         .then(response => response.json())
         .then(data => {
            console.log(data);
            if (data.title == null) {
               hideLoading()
               let secondDef;
               if(data[0].meanings[0].definitions.length == 1){
                  secondDef = data[0].meanings[1].definitions[0].definition
               } else {
                  secondDef = data[0].meanings[0].definitions[1].definition
               }
               data.map((e) => {
                  word = data[0].word
                  infoSection.innerHTML = `
                  <div class="word">
                  <h3>${inputValue}</h3>
                  <button onclick="playSound()" id="soundBtn">
                     <i class="fas fa-volume-up"></i>
                  </button>
                  </div>
                  <div class="details">
                        <p>"${data[0].meanings[0].partOfSpeech}"</p>
                        <p>/${data[0].phonetic}/</p>
                  </div>
                  <p class="word-meaning">
                     <b>1.</b> ${data[0].meanings[0].definitions[0].definition}
                  </p>
                  <p class="word-meaning">
                     <b>2.</b> ${secondDef}
                  </p>
                  <p class="word-example">
                        ${data[0].meanings[0].definitions[0].example || ""}
                  </p>`;

                  let haveAudio;
                  function check() {
                     for (let i of e.phonetics) {
                        if (i.audio != '') {
                           haveAudio = i.audio
                        }
                     }
                  }
                  check();
                  console.log(haveAudio);
                  audio.setAttribute('src', `${haveAudio}`)
               })}else{
                  infoSection.innerHTML = `<b> Afsus, bu so'z lug'atimizda mavjud emas</b>`
                  setTimeout(() => {
                     infoSection.innerHTML = ""
                     inputt.value = ''
                     
                  }, 2000)
                  hideLoading()
               }
            })
         .catch(err => {
            hideLoading()
            console.log(err.url);
            console.error(err)
         });
   }




}


function playSound() {
   audio.play()
}



