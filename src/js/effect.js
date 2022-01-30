var newImageZIndex = 1;  // Для того, чтобы только что загруженное изображение размещалось самым верхним на столе
var loaded = false;      // Используется для предотвращения  запуска initPhotos() дважды
var imageBeingRotated = false;  // Элемент изображения DOM, который вращается в текущий момент
var mouseStartAngle = false;    // Угол отклонения положения курсора мыши от центра изображения в начале вращения
var imageStartAngle = false;    // Угол поворота изображения вначале вращения

// Когда документ загружен, инициализируем стол!
$( init );

// Когда загружено изображение стола, запускаем размещение изображений
function init() {
    var woodenTable = $('#wooden-table img');
    woodenTable.load( initPhotos );

    // Код для браузеров, которые не запускают события загрузки для кешированных изображений
    if ( woodenTable.get(0).complete ) $(woodenTable).trigger("load");
}

// Устанавливаем каждую фотографию на столе

function initPhotos() {

    // (Убеждаемся, что функция не запущена дважды)
    if ( loaded ) return;
    loaded = true;

    // Изображение стола загружено
    $('#lighttable').fadeIn('fast');

    // Добавляем обработчик события для остановки вращения, когда кнопка мыши будет отпущена
    $(document).mouseup( stopRotate );

    // Обрабатываем каждую фотографию ...
    $('#lighttable img').each( function(index) {

        // Устанавливаем случайное положение и угол поворота для фотографии
        var left = Math.floor( Math.random() * 450 + 100 );
        var top = Math.floor( Math.random() * 100 + 100 );
        var angle = Math.floor( Math.random() * 60 - 30 );
        $(this).css( 'left', left+'px' );
        $(this).css( 'top', top+'px' );
        $(this).css( 'transform', 'rotate(' + angle + 'deg)' );
        $(this).css( '-moz-transform', 'rotate(' + angle + 'deg)' );
        $(this).css( '-webkit-transform', 'rotate(' + angle + 'deg)' );
        $(this).css( '-o-transform', 'rotate(' + angle + 'deg)' );
        $(this).data('currentRotation', angle * Math.PI / 180 );

        // Делаем фотографию перемещаемой
        $(this).draggable( { containment: 'parent', stack: '#lighttable img', cursor: 'pointer', start: dragStart } );

        // Делаем фотографию способной вращаться
        $(this).mousedown( startRotate );

        // Вызываем лайтбокс, когда на фотографии нажимают кнопку мыши
        $(this).bind( 'click', function() { openLightbox( this ) } );


        // Прячем фотографию в случае если она еще не загружена до конца
        $(this).hide();

        // После окончания загрузки изображения...
        $(this).load( function() {

            // (Убеждаемся, что функция не запущена дважды)
            if ( $(this).data('loaded') ) return;
            $(this).data('loaded', true);

            // Записываем реальные размеры изображения
            var imgWidth = $(this).width();
            var imgHeight = $(this).height();

            // Делаем фотографию больше, так что она будет выглядеть значительно больше стола
            $(this).css( 'width', imgWidth * 1.5 );
            $(this).css( 'height', imgHeight * 1.5 );

            // Делаем ее полностью прозрачной
            $(this).css( 'opacity', 0 );

            // Устанавливаем z-index больше, чем у фотографий, уже размещенных на столе
            $(this).css( 'z-index', newImageZIndex++ );

            // Постепенно уменьшаем размеры фотографии до нормальных размеров и одновременно уменьшаем ее прозрачность
            $(this).animate( { width: imgWidth, height: imgHeight, opacity: .95 }, 1200 );
        } );

        // Код для браузеров, которые не запускают события загрузки для кешированных изображений
        if ( this.complete ) $(this).trigger("load");

    });
}

// Предотвращаем перетаскивание изображения, если оно уже вращается

function dragStart( e, ui ) {
    if ( imageBeingRotated ) return false;
}

// Открываем лайтбокс только если изображение не вращается в текущий момент

function openLightbox( image ) {
    if ( !imageBeingRotated ) {
        var imageFile = $(image).attr('src');
        imageFile = imageFile.replace ( /^slides\//, "" )
        var imageCaption = $(image).attr('alt');
        $.colorbox( {
            href:'slides_big/'+imageFile,
            maxWidth: "900px",
            maxHeight: "600px",
            title: imageCaption
        } );
        return false;
    }
}

// Запускаем вращение изображения

function startRotate( e ) {

    // Выходим, если клавиша shift не удерживается, когда кнопка мыши нажата
    if ( !e.shiftKey ) return;

    // Изображение, которое будет вращаться
    imageBeingRotated = this;

    // Сохраняем начальное значение угла положения курсора мыши относительно центра изображения
    var imageCentre = getImageCentre( imageBeingRotated );
    var mouseStartXFromCentre = e.pageX - imageCentre[0];
    var mouseStartYFromCentre = e.pageY - imageCentre[1];
    mouseStartAngle = Math.atan2( mouseStartYFromCentre, mouseStartXFromCentre );

    // Сохраняем текущее значение угла поворота изображения
    imageStartAngle = $(imageBeingRotated).data('currentRotation');

    // Устанавливаем обработчик события для вращения изображения перемещениями курсора мыши
    $(document).mousemove( rotateImage );

    return false;
}


// Останавливаем вращение изображения

function stopRotate( e ) {

    // Выходим, если изображение не вращалось
    if ( !imageBeingRotated ) return;

    // Удаляем обработчик события, который отслеживал пермещения курсора мыши во время вращения
    $(document).unbind( 'mousemove' );

    // Сбрасываем флаг вращения устанавливая перменной imageBeingRotated значение false.
    // Делаем это с небольшой задержкой - после генерации события click -
    // для предотвращения появления лайтбокса, как только клавищу Shift отпустят.
    setTimeout( function() { imageBeingRotated = false; }, 10 );
    return false;
}

// Вращение изображения на основе текущего положения курсора мыши

function rotateImage( e ) {

    // Выходим, если процесс вращения не запущен
    if ( !e.shiftKey ) return;
    if ( !imageBeingRotated ) return;

    // Вычисляем новый угол положения курсора мыши относительно центра изображения
    var imageCentre = getImageCentre( imageBeingRotated );
    var mouseXFromCentre = e.pageX - imageCentre[0];
    var mouseYFromCentre = e.pageY - imageCentre[1];
    var mouseAngle = Math.atan2( mouseYFromCentre, mouseXFromCentre );

    // Вычисляем новый угол поворота изображения
    var rotateAngle = mouseAngle - mouseStartAngle + imageStartAngle;

    // Поворачиваем изображение на новый угол и сохраняем его значение
    $(imageBeingRotated).css('transform','rotate(' + rotateAngle + 'rad)');
    $(imageBeingRotated).css('-moz-transform','rotate(' + rotateAngle + 'rad)');
    $(imageBeingRotated).css('-webkit-transform','rotate(' + rotateAngle + 'rad)');
    $(imageBeingRotated).css('-o-transform','rotate(' + rotateAngle + 'rad)');
    $(imageBeingRotated).data('currentRotation', rotateAngle );
    return false;
}

// Вычисляем центральную точку изображения

function getImageCentre( image ) {

    // Поворачиваем изображение к углу 0 радиан
    $(image).css('transform','rotate(0rad)');
    $(image).css('-moz-transform','rotate(0rad)');
    $(image).css('-webkit-transform','rotate(0rad)');
    $(image).css('-o-transform','rotate(0rad)');

    // Вычисляем центр изображения
    var imageOffset = $(image).offset();
    var imageCentreX = imageOffset.left + $(image).width() / 2;
    var imageCentreY = imageOffset.top + $(image).height() / 2;

    // Поворачиваем изображение обратно к исходному углу
    var currentRotation = $(image).data('currentRotation');
    $(imageBeingRotated).css('transform','rotate(' + currentRotation + 'rad)');
    $(imageBeingRotated).css('-moz-transform','rotate(' + currentRotation + 'rad)');
    $(imageBeingRotated).css('-webkit-transform','rotate(' + currentRotation + 'rad)');
    $(imageBeingRotated).css('-o-transform','rotate(' + currentRotation + 'rad)');

    // Возвращаем вычисленные координаты центра
    return Array( imageCentreX, imageCentreY );
}