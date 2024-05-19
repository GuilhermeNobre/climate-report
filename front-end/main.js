import axios from "axios";
// src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=default&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=-22.715&lon=-48.34&detailLat=-19.024&detailLon=-48.343&marker=true&pressure=true&message=true"

export function returnUrlToIframe(typeMap, lat, long) {
  return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=default&zoom=12&overlay=${typeMap}&product=ecmwf&level=surface&lat=${lat}&lon=${long}&detailLat=${lat}&detailLon=${long}&marker=true&pressure=true&message=true`;
}

buttonClick.addEventListener("click", function () {
  var speech = true;

  let arrayIndividual = [];

  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener('result', e=>{
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)

    console.log(transcript)

    document.getElementById('userInput').value = transcript;

    arrayIndividual = transcript;
    console.log(arrayIndividual[0]);
  })

  recognition.onspeechend = function() {
    setTimeout(function() {
      if (!recognition.speaking) {
        console.log('Nenhuma voz ativa após 2 segundo, finalizando...');
        if(arrayIndividual[0] == undefined || arrayIndividual[0] == ''){  
          alert('Fale uma localização válida');
          return;
        }
        mainFunction(arrayIndividual[0]);
      } else {
        console.log('Voz ativa detectada após 2 segundo, esperando mais...');
      }
    }, 1000);
  }

  if (speech == true) {
    recognition.start();
  }
});


async function mainFunction(location) {
  
  console.log(location);
  let dataFromApi = await getInfoFromApi(location);

  createDivsWheater(
    dataFromApi.source,
    dataFromApi.message,
    dataFromApi.location[0],
    dataFromApi.location[1],
    dataFromApi.message[1]
  );
}

window.sendText = async function () {
  let locationFromUser = document.getElementById("userInput").value;
  if (locationFromUser === "") {
    alert("Digite uma localização válida");
    return;
  }
  mainFunction(locationFromUser);
};

async function getInfoFromApi(textLocation) {
  let dataFromApi;
  await axios
    .post("http://localhost:8000/coordanates", {
      location: textLocation,
      source: "web",
    })
    .then((response) => {
      console.log(response.data);
      dataFromApi = response.data;
    });
    return dataFromApi;
}

function createDivsWheater(source, messageLocation, lat, long) {
  console.log(lat);
  console.log(long);
  let wheaterInfo = document.getElementById("wheaterInfos");

  wheaterInfo.innerHTML = "";
  document.getElementById("titleWheater").innerText = "";

  const list_all_maps = [
    "temp",
    "rain",
    "rh",
    "wind",
    "solarpower",
    "uvindex",
    "rainAccu",
    "radar",
  ];

  const list_titles_maps = {
    temp: "Temperatura",
    rain: "Chuva",
    rh: "Umidade",
    wind: "Vento",
    solarpower: "Energia Solar",
    uvindex: "Índice UV",
    rainAccu: "Chuva Acumulada",
    radar: "Radar Meteorológico",
  };

  document.getElementById(
    "titleWheater"
  ).innerText = `Relatório Climático para ${messageLocation}`;

  for (let i = 0; i < list_all_maps.length; i++) {
    let divTag = document.createElement("div");
    let h3Tag = document.createElement("h3");
    let hrTag = document.createElement("hr");
    h3Tag.innerText = list_titles_maps[list_all_maps[i]];

    let iframeTag = document.createElement("iframe");
    iframeTag.src = returnUrlToIframe(list_all_maps[i], lat, long);
    iframeTag.width = "600";
    iframeTag.height = "350";

    divTag.appendChild(h3Tag);
    divTag.appendChild(hrTag);
    divTag.appendChild(iframeTag);

    wheaterInfo.appendChild(divTag);
  }
}

