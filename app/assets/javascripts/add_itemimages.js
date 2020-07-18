window.addEventListener('load', function() {
  $(function() {
    function buildPreviewboxGroup(image) {
      //インプットで新規追加した画像は"unsaved"
      let html = `<div class="previewbox__group previewbox__group_unsaved">
                    <div>
                      <img src="${image}" class="previewbox__group--img">
                    </div>
                    <div class="previewbox__group--btn">
                      削除
                    </div>
                  </div>`;
      return html;
    }

    function buildImageboxGroup(num_unsaved) {
      let html = `<div class="imagebox__group" data-index_unsaved="${num_unsaved}" >
                    <input class="imagebox__field" 
                            type="file"
                            accept="image/*"
                            name="item[itemimages_attributes][${num_unsaved}][image]"
                            id="item_itemimages_attributes_${num_unsaved}_image">
                    </input>
                  </div>`;
      return html;
    }

    $(document).on('change', 'input[type= "file"]', function(e) {

      let reader = new FileReader();  //画像を読み込む（ファイルリーダーオブジェクトをインスタンス化）
      let file = e.target.files[0];   //inputから1つ目のfileを取得
      reader.readAsDataURL(file);     //画像ファイルのURLを取得

      reader.onload = function(e) {
        //preview-------------------------------
        //【新規】previewbox__group_unsavedを後ろから追加（この時点ではindex等指定していない）
        $('.previewbox').append(buildPreviewboxGroup(e.target.result));
        
        let previewbox_unsaved_count = $('.previewbox__group_unsaved').length;
        let previewbox_count = $('.previewbox__group').length;

        //input-----------------------------------
        //【新規】データの入ったinputタグ（未保存）のクラス名をimagebox__group_filled変更して、imageboxの後ろから追加（非表示）
        $('.imagebox__group').removeClass('imagebox__group').addClass('imagebox__field_filled').appendTo('.imagebox');
        $('.imagebox__field_filled').hide();
        //【新規】画像追加用inputタグを追加
        $('.imagebox').prepend(buildImageboxGroup(previewbox_unsaved_count + 1));
        // $('.imagebox').prepend(buildImageboxGroup(previewbox_count + 1, previewbox_unsaved_count + 1));

        //識別のための管理番号をつけ直す(先頭は１(=i+1))
        
        //（１）と（２）により追加分（＝未保存）のpreviweboxとinputタグのインデックス番号が揃う（削除時に、previewboxのインデックス情報から、削除すべきinputタグが指定できる）
        //【新規】追加分（＝未保存）のpreviewboxについて、changeの都度１から採番・・・（１）
        $('.previewbox__group_unsaved').each(function(i) {
          $(this).attr('data-index_unsaved', (i+1));
        });
        //【新規】追加分（＝未保存）のinputタグについて、changeの都度１から採番・・・（２）
        $('.imagebox__field_filled').each(function(i) {
          $(this).attr('data-index_unsaved', (i+1));
        });

        if (previewbox_count >=1) {
          $('.imagebox__info--comments').css('display', 'none');
        }
        if (previewbox_count == 5) {
          $('.imagebox').css('visibility', 'hidden');
        }
      } 
    });
  });
});