var db = firebase.firestore().collection('chat');
$('#text').on("keydown", e => {
  if (e.keyCode === 13) $('#send').trigger("click");
  $('main').animate({ scrollTop: $('#output')[0].scrollHeight });
});

  // $('main').animate({ scrollTop: $('#output')[0].scrollHeight });
$("main").on('click', '#output', function () {
  // $('#main').animate({ scrollTop: $(this).height() }, "slow");
  $('main').animate({ scrollTop: $('#output')[0].scrollHeight });
});


$('#send').on('click', function () {
    db.add({
      name: $('#name').val(),
      time: firebase.firestore.FieldValue.serverTimestamp(),
      text: $('#text').val(),
    });
  $('#text').val('');
  $('main').animate({ scrollTop: $('#output')[0].scrollHeight});
  // $('main').animate({ scrollTop: $('#output').offset().top }, 0);
});

$('#clear').on('click', function () {
  $('#name').val('');
  $('#text').val('');
});

let idArray = [];

// orderBy()で並び替えができる! ここでは新しい順!
db.orderBy('time', 'asc').onSnapshot(function (querySnapshot) {
  //deleteAllでつかう配列
  // console.log(querySnapshot);
  idArray = querySnapshot;
  // onSnapshotでデータ変更時に実行される! // querySnapshotにデータが配列形式で
  let str = '';
  querySnapshot.forEach(function (doc){

    const data = doc.data();
    // console.log(data);
    str += '<div id=' + doc.id + 'class="comment-area" style="padding:10px 0 0 20px; background-color:rgba(255,255,255,0.4);">';
    str += '<p>' + data.name + '</p>';
    // str += '<p>' + doc.uid + '</p>';
    str += '<p class="time" style="padding:5px 0;">' + timestampToDatetime(doc.data().time.seconds) + '</p>';
    str += '<p>' + data.text + '</p>';
    //comment-menu
    str += '<div id="' + doc.id + '" id="counter" class="comment-menu">';
    str += '<div class="reply btn">返信</div><div class="delete btn" id="">削除</div>';
    // div class="like btn" > like</div >
    str += '</div>'; // comment-menuの閉じタグ
    str += '</div>';
    str += '<hr>';


  });
  $('#output').html(str);
});

  // すべてのドキュメントの削除処理  
$('#deleteAll').on('click', function () {
  // console.log(idArray);
    // dco('id名')
  if (confirm('Are you sure?')) {
     
        idArray.forEach(function (doc) {
          console.log('id表示' + doc.id);
          db.doc(doc.id).delete().then(function () {
            console.log("Document successfully deleted!");
          }).catch(function (error) {
            console.error("Error removing document: ", error);
          });
        });
    
  };
    
  });

  // firebaseからのデータを表示しているとき
  // 親要素に対して処理を行う
$('#output').on('click', '.delete',function () {
  let idVal = $(this).parent().attr('id');
  // let idVal = $(this).parent();
  // console.log(idVal);
  db.doc(idVal).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
});

// -------------------------------------------------------------------------

// 画像アップロード
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', function (e) {
  console.log(e);
  var file = e.target.files[0];

  var storageRef = firebase.storage().ref('img/' + file.name);

  var task = storageRef.put(file);
  // プログレスバー
  task.on('state_changed',
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
    },
    function error(err) {
      console.log("upload error: " + err);
    },
    function complete() {
      console.log("upload");

      // アップロード完了後その画像を表示させる処理
      storageRef.getDownloadURL().then(function (url) {
        // // console.log(url);
        // let str = '';
        // str += `<img src="${url}" alt="" class="downloadedImg">`
        // $('#show').html(str); 
        $('main').css('background-image', `url(${url})`);
      })
    }
  );
});

// 画像選択のとこ

$('#choices').on('focus', function () {
  // Create a reference under which you want to list
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var listRef = storageRef.child('img');
  console.log(listRef.listAll());
  listRef.listAll().then(function (res) {
    // console.log(res.items[0].name);
    // console.log(res.items[1].name);
    let str = '';
    for (let i = 0; i < res.items.length; i++) {
      str += `<option value="${res.items[i].name}">${res.items[i].name}</option>`;
    };
    $('#choices').html(str);
    
  }).catch(function (error) {
    // Uh-oh, an error occurred!
    console.log('error: ' + error);
  });

  // Delete dataの
  $('#dataDelete').on('click', function (e) {
      var dataName = $('[name=choices]').val();
      // Get a reference to the storage service, which is used to create references in your storage bucket
      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();
      // console.log(storageRef.bucket);
      // var imagesRef = storageRef.child('img');
      var spaceRef = storageRef.child(`img/${dataName}`);
    
      console.log(spaceRef);
      // Delete the file
      spaceRef.delete().then(function () {
        console.log('The pic was deleted.');
        // File deleted successfully
        confirm('削除されました。');
      }).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log('error: ' + error);
      });
    
  });


  // Show

  $('#download').on('click', function () {
    let dataName = $('[name=choices]').val();
    // console.log(dataName);
    // Create a reference with an initial file path and name
    var storage = firebase.storage();
    var pathReference = storage.ref(`img/${dataName}`);
    pathReference.getDownloadURL().then(function (url) {
      // console.log(url);  OK
      // let str = '';
      $('main').css('background-image', `url(${url})`)
      console.log('show');
    }).catch(function (error) {
      // Handle any errors
      console.log('error: ' + error)
    });

  })
});

// 時間

function timestampToDatetime(timestamp) {
  let date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const min = ('0' + date.getMinutes()).slice(-2);
  const sec = ('0' + date.getSeconds()).slice(-2);
  return `${year}/${month}/${day} ${hour}:${min}`
}

// 返信

$('#output').on('click', '.reply', '.comment-area',function () {
  // let idName = $(this).parent()[0].firstChild.innerText;
  let idName = $(this).parent()[0].parentNode.firstChild.innerText;
  console.log(idName);
  $('#text').val(">>> " + idName);
});
