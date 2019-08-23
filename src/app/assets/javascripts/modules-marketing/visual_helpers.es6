class VisualHelpers {

    constructor() {

        this.setupVisibleTriggers();
        this.setupRandomImages();
        this.setupRandomTitles();
        this.parallax();
        this.equalHeights();

    }

    setupVisibleTriggers() {

        $(document).ready(function () {
            $(".viewable").each(function (i, el) {
                var el = $(el);
                el.addClass("has-viewable-action");
                el.addClass("is-not-viewable");
            });


            setTimeout(function () {
                $(".viewable").each(function (i, el) {
                    var el = $(el);
                    if (el.visible(true)) {
                        el.removeClass("is-not-viewable");
                        el.addClass("is-viewable");
                    }
                });
            }, 100);

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

    parallax() {
        $(document).ready(function () {
            var parallaxSidebar = document.getElementById('m-sidebar');
            var parallaxHeader = document.getElementById('m-page-header-image');
            var parallaxBackground = document.getElementById('motion-background');
            window.onscroll = function (e) {
                if ($(window).width() > 768) {
                    var amount = Math.round(window.scrollY / 4);
                    if (parallaxSidebar) {
                        parallaxSidebar.style.transform = 'translate3d(0px,' + amount + 'px, 0px)';
                    }
                    if (parallaxHeader) {
                        parallaxHeader.style.transform = 'translate3d(0px,' + amount + 'px, 0px)';
                    }
                    if (parallaxBackground) {
                        parallaxBackground.style.transform = 'translate3d(0px,' + amount + 'px, 0px)';
                        //parallaxBackground.style.backgroundPosition = 'center ' + amount + 'px';
                    }
                }
            }
        });

    }

    equalHeights() {

        var heights = [];

        setTimeout(() => {
            $('.m-guides .guide a').each(function (index) {
                heights.push($(this).outerHeight());
            });

            var largest = Math.max.apply(Math, heights);
            $('.m-guides .guide a').css('min-height', largest + 'px');

        }, 50);
    }


}

$(function() {
    new VisualHelpers();
})

