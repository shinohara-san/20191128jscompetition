$('.fadeOutBtn').on('click', function () {
  $('#bigPic').fadeOut(3000);
  $('html, body').animate({ scrollTop: 0 });
  $('#first_window').fadeOut(3000);
});

// ぐるなび

$('#btn').on('click', function () {
  const input = $('input').val();
  if (!input) {
    return;
  };
  const url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=b0c52aa4269b785f3a299e06a7d83548&freeword=${input}`;
 
  $.getJSON(url)
    .done(function (data) {
      // console.log(data.rest[0]);
      let str = '';
      for (i = 0; i < data.rest.length; i++) {
        str += `<div class="restaurant"><div>`;
        if (!data.rest[i].image_url.shop_image1) {
          str += `<img src="img/noimg.jpg" alt="" class="restaurant_img">`;
        } else {
          str += `<img src="${data.rest[i].image_url.shop_image1}" alt="" class="restaurant_img">`;
        }
        str += `</div><a href="${data.rest[i].url}" target="_blank" class="restaurant_name">`
        str += `${data.rest[i].name}`;
        str += `</a>`;
        str += `</div>`;
      }
      $('#food').html(str);

    }).fail(function (error) {
      console.log('error' + error);
    }).always(function () {
      console.log('ok');
    });

});

// ーーーーーーーーーーーーーーーーーーーーーーーーーーー
// // セクションタイトル
// ーーーーーーーーーーーーーーーーーーーーーーーーーーー
$('#btn').on('click', function () {
  $('.section_title').fadeIn(2000);
})


// ーーーーーーーーーーーーーーーーーーーーーーーーーーー
// // グーグルマップ
// ーーーーーーーーーーーーーーーーーーーーーーーーーーー


$('#btn').on('click', function () {
  let map;
  let lat;
  let lng;
  const input = $('input').val();
  if (!input) {
    return;
  };
  geocode();

  function geocode(e) {
    console.log(e);
    var location = input;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: 'AIzaSyBILh5OBPethAGwAYYtvftskjvkuTvBIgs'
      }
    })
      // 地図
      .then(function (response) {
        // console.log(response);
        // console.log(response.data.results[0].geometry.location.lat);
        // console.log(response.data.results[0].geometry.location.lng);
        lat = response.data.results[0].geometry.location.lat;
        lng = response.data.results[0].geometry.location.lng;
        initMap();
        function initMap() {
          var place = { lat: lat, lng: lng };
          map = new google.maps.Map(document.getElementById('map'), {
            center: place,
            zoom: 13
          });
          // ストリートビュー
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), {
            position: place,
            pov: {
              heading: 34,
              pitch: 10
            }
          });
          map.setStreetView(panorama);

          // 天気  
          getWeather();
          function getWeather() {
            const key = "a4a7acea1e0ea9e5bca035dbb595e041";
            let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}`;

            fetch(api)
              .then(function (response) {
                let data = response.json();
                console.log(data);
                return data;
              })
              .then(function (data) {
                console.log(data);
                let celsius = Math.floor(data.main.temp - 273);
                var iconcode = data.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                
                $('#wicon').attr('src', iconurl);
                $('#weather').text(data.weather[0].description);
                $('#cel').text(celsius + ' ℃');
              })
              .then(function () {
                console.log('ok');
              });
          }
        }
      })
      .catch(function (error) {
        console.log('error' + error);
      })
  }
});


// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// // YOUTUBE
// ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
$('#btn').on('click', function () {
  const input = $('input').val();
  if (!input) {
    return;
  };
  $.ajax({
    type: "get",
    dataType: "jsonp",
    url: "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=" + input + "&key=AIzaSyBILh5OBPethAGwAYYtvftskjvkuTvBIgs"
  }).done(function (evt) {
    console.log(evt);
    // console.log(evt.items[0].id.videoId);
    // // console.log(evt.items[0].title);
    // console.log(evt.items[0].snippet.thumbnails.medium.url);

    let str = '';
    for (let i = 0; i < evt.items.length; i++) {
      let videoId = evt.items[i].id.videoId;
      let videoThumbnails = evt.items[i].snippet.thumbnails.medium.url;
      let videoTitle = evt.items[i].snippet.title;

      str += `<div class="video_wrapper"><a href = "https://www.youtube.com/watch?v=${videoId}" class="videoTitle" target="_blank">`
      str += `<div><img src="${videoThumbnails}" alt=""></div>`
      str += `<div class="videoTitle">${videoTitle}</div>`
      str += `</a></div>`
    }
    $('#video-container').html(str);
  });
  (this, document, $);
});

