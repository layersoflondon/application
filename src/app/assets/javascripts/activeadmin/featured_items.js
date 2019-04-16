$(function() {
  if ($('#featured_item_item_type_input').length) {
    $('select[disabled]').parent().addClass('is-disabled');
    $('#featured_item_item_type_input input').change(function(e) {
      switch($(e.currentTarget).val()) {
        case "Record":
          var elem = $('select.record-options');
          var otherElem = $('select.collection-options');
          break;
        case "Collection":
          var elem = $('select.collection-options');
          var otherElem = $('select.record-options');
          break;
      }

      elem.prop('disabled', false);
      otherElem.prop('disabled', true);
      elem.siblings('.select2').parent().removeClass('is-disabled');
      otherElem.siblings('.select2').parent().addClass('is-disabled');
    })
  }
});