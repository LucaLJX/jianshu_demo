$(document).ready(function () {
    watch();
});

function watch () {
    var length = $('.menu ul li').length;
    for (var i = 0; i < length; i++) {
        var checkClass = 'item-' + i.toString();
        var hasActive = $('.' + checkClass).hasClass('item-active');
        if (hasActive) {
            $('.' + checkClass).css('background-image', 'url("./icons/' + checkClass + '-red.png")');
        } else {
            $('.' + checkClass).css('background-image', 'url("./icons/' + checkClass + '-blue.png")')
        }
    }
}

function clickItem (index) {
    var length = $('.menu ul li').length;
    for (var i = 0; i < length; i++) {
        var clickClass = 'item-' + i.toString();
        if (index == i) {
            $('.' + clickClass).addClass('item-active');
        } else {
            $('.' + clickClass).removeClass('item-active');
        }
    }
    watch ();
}

