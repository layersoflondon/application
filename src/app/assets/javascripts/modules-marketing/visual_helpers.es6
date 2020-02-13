class VisualHelpers {

  constructor() {

    this.setupVisibleTriggers();
    this.slideshows();
    this.setupRandomImages();
    this.setupRandomTitles();
    this.parallax();
    this.equalHeights();
    this.childTagPopovers();

  }

  childTagPopovers() {

    $(".m-tag-groups-list .child-tags").hide();

    $(".m-tag-groups-list > li").on({
      'mouseenter': function () {
        var elem = $(this).find('.child-tags');
        elem.css('transform', 'translate3d(0,0,0)');
        elem.find('.spike').css('transform', 'translate3d(0,0,0)');
        elem.fadeIn(200);

        var elemOffset = elem.offset();
        var overhangRight = (elemOffset.left + elem.outerWidth()) - elem.closest('.m-home-tags').outerWidth();

        if (overhangRight < 0) {
          overhangRight = 0;
        } else {
          elem.css('transform', 'translate3d(' + (overhangRight * -1) + 'px,0,0)');
          elem.find('.spike').css('transform', 'translate3d(' + overhangRight + 'px,0,0)');
        }

        var overhangLeft = elemOffset.left;

        if (overhangLeft > 0) {
          overhangLeft = 0;
        } else {
          console.log(overhangLeft);
          elem.css('transform', 'translate3d(' + (overhangLeft * -1) + 'px,0,0)');
          elem.find('.spike').css('transform', 'translate3d(' + overhangLeft + 'px,0,0)');
        }
      },
      'mouseleave': function () {
        $(this).find('.child-tags').fadeOut(200);
      }
    });
  }

  slideshows() {

    $(".rslides").responsiveSlides({
      pager: true,
      navContainer: ".m-layers-slideshow .controls",
      before: function(index) {
        if($(".rslides").data().before && VisualHelpers[$(".rslides").data().before]) {
          VisualHelpers.updateCurrentSlide(index);
        }
      }
    });
  }

  static updateCurrentSlide(index) {
    const text = $(".rslides").find("li[data-slide-index="+index+"] .caption").text();
    $(".m-layers-slideshow .sidebar .current-slide-information p span").text(text).fadeIn();
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

$(function () {
  new VisualHelpers();
})

