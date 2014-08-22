(function($) {
    var applyMarkDown = function(el) {

        var length = $(el).text().length,
            underline = '';

        for(var i = 0; i < length;  i++) {
            underline += '=';
        }

        console.log(underline);

        $(el).after('<span class="heading-underline">' + underline + '</span>');

        console.log(length);
    };

    $(document).ready(function() {

        var headings = $('.heading');

        $(headings).each(function() {
            applyMarkDown($(this));
        });

    });
})(jQuery);
