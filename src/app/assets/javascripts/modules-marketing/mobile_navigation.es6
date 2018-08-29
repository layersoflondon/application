class mobileNavigation {

    constructor() {

        this.setupMobileNavigation();

    }

    setupMobileNavigation() {

        $('.m-fixed-logo').hide();

        if($(window).width()>1150) {
            $('.m-hamburger').hide();
        }

        var newNav = $('.m-navigation .main-navigation').clone().insertAfter(".m-navigation");
        $(newNav).wrap('<div class="m-navigation-mobile"></div>');
        $(newNav).wrap('<div class="wrap"></div>');
        $(newNav).addClass('site-navigation');
        $('.m-navigation ul.user-actions').clone().appendTo('.m-navigation-mobile .wrap').addClass('actions');

        var menuOpen = false;

        $(".hamburger").click( function (e) {

            if (menuOpen) { // Hide
                $(this).removeClass('is-active');
                menuOpen = false;
                $('.m-navigation-mobile').animate({ opacity: 0 }, 200, function() {
                    $(this).removeClass("is-visible");
                    $(this).addClass("is-hidden");
                });
                $("body").removeClass("has-mobile-menu-open");
            }
            else { // Show
                $(this).addClass('is-active');
                menuOpen = true;
                $('.m-navigation-mobile').css('visibility', 'visible');
                $('.m-navigation-mobile').css('z-index', '300');
                $(".m-navigation-mobile").removeClass("is-hidden");
                $(".m-navigation-mobile").addClass("is-visible");
                $('.m-navigation-mobile').animate({ opacity: 1 }, 200, function() {
                });

                $("body").addClass("has-mobile-menu-open");
            }
        })

    }

};

$(function() {
    new mobileNavigation();
})
