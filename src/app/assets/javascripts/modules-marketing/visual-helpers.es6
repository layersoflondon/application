class VisualHelpers {

    constructor() {

        this.setupScrolling();
        this.setupVisibleTriggers();
        this.setupRandomImages();
        this.setupRandomTitles();

    }


    setupVisibleTriggers() {

        $(document).ready(function () {
            $(".viewable").each(function (i, el) {
                var el = $(el);
                el.addClass("has-viewable-action");
                el.addClass("is-not-viewable");
            });


            setTimeout(function(){
                $(".viewable").each(function (i, el) {
                    var el = $(el);
                    if (el.visible(true)) {
                        el.removeClass("is-not-viewable");
                        el.addClass("is-viewable");
                    }
                });
            },100);

        });

        $(window).scroll(function (event) {

            $(".viewable").each(function (i, el) {
                var el = $(el);
                if (el.visible(true)) {
                    el.removeClass("is-not-viewable");
                    el.addClass("is-viewable");
                }
            });

        });

    }


    setupScrolling() {

        $(document).ready(function () {
            window.targ = $('.m-highlighted-content');

            $(window).scroll(function () {
                window.targ.css('transform', 'translate3d(0px,' + ((window.scrollY / 2) * -1) + 'px, 0px)');
            });

        });

    }

    setupRandomImages() {

        $(document).ready(function () {
            $('.random-image').each(function () {
                $(this).css('background-image', 'url(/example/' + (Math.floor(Math.random() * 16) + 1) + '.jpg');
            });

            $('.random-image-large').each(function () {
                $(this).css('background-image', 'url(/example/' + (Math.floor(Math.random() * 16) + 1) + '-large.jpg');
            });
        });
    }

    setupRandomTitles() {

        var pungle = ['Graffiti bridges of North London',
            'Drums at Notting Hill Carnival',
            'Victorian cafes of Camden Town',
            'Skateboarders boarding at half-board billboard',
            'Shoreditch\'s stylised bike stands'];

        $(document).ready(function () {
            $('.random-title').each(function () {
                //$(this).css('background-image', 'url(/example/' + (Math.floor(Math.random() * 16) + 1) + '.jpg');
                $(this).text(pungle[Math.floor(Math.random() * 5)]);
            });
        });


    }


}

new VisualHelpers();
