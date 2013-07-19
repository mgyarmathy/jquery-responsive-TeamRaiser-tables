/*!
 *  Responsive TeamRaiser Tables - version 1.0
 *  Michael Gyarmathy, Web Development Intern, Blackbaud
 *  Description: a jQuery Plugin that converts TeamRaiser tables into a
 *               responsive <div> format
 */

;(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'responsiveTeamRaiserTable',
        defaults = {
            labels: ['Participant', 'Milestones', 'Amount Raised', '&nbsp'],
            order: ['name', 'milestones', 'amount', 'donate'], 
            sort: true
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        
        if(this.options.labels.length != 4){
            $.error("responsiveTeamRaiserTable - four labels must be specified");
            this.options.labels = defaults.labels;
        }
        
        this.init();
    }

    Plugin.prototype.init = function() {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        // retrieve records from TR table
        var records = [],
            captains = [];
        $(this.element).find('tbody').find('tr').each(function(i, row) { 
            var n = $(row).find('td')[0].innerHTML;
            var amt = $(row).find('td')[1].innerHTML;
            records.push({ name: n.substring(3,n.length-2), 
                           amount_display: amt.substring(0,amt.length-3) , 
                           amount: parseFloat(amt.substring(1,amt.length)) 
                        });
        });
        
        // sort records
        if(this.options.sort){
            records.sort(function(a,b) {return (b.amount - a.amount)} );
        }
        
        // create div where new table will go
        $(this.element).before('<div id="teamRosterTable"></div>');   

        // create heading for table
        $('#teamRosterTable').append( '<div class="tableRow tableHeading">'
                                    +   '<div class="tableCell teamMember">'
                                    +      '<div class="cellContent">' + this.options.labels[0] + '</div>'
                                    +   '</div>'
                                    +   '<div class="tableCell achievements">'
                                    +      '<div class="cellContent">' + this.options.labels[1] + '</div>'
                                    +   '</div>'
                                    +   '<div class="tableCell raised">'
                                    +      '<div class="cellContent">' + this.options.labels[2] + '</div>'
                                    +   '</div>'
                                    +   '<div class="tableCell donate">'
                                    +      '<div class="cellContent">' + this.options.labels[3] + '</div>'
                                    +   '</div>'
                                    + '</div>'
                                    ); 
                                    
        // add sorted records to the table
        $(records).each(function(i, participant) {
            $('#teamRosterTable').append( '<div class="tableRow">'
                                        +    '<div class="tableCell teamMember">'
                                        +       '<div class="cellContent">' + participant.name + '</div>'
                                        +    '</div>'
                                        +    '<div class="tableCell achievements">'
                                        +       '<div class="cellContent">'
                                        +       '</div>'
                                        +    '</div>'
                                        +    '<div class="tableCell raised">'
                                        +       '<div class="cellContent">' + participant.amount_display + '</div>'
                                        +    '</div>'
                                        +    '<div class="tableCell donate">'
                                        +       '<div class="cellContent">'
                                        +          '<button>Donate</button>'
                                        +       '</div>'
                                        +    '</div>'
                                        + '</div>'
                                        );
        });
        
        // add achievements to each record
        $('.tableCell.teamMember .cellContent img').each(function(i, element) {
           $(element).parent().parent().parent().find('.tableCell.achievements .cellContent')
                     .html($(element).clone());
        })
        .remove();

        
        // assign captain designations
        $('td.tr_captain a').each(function(i, element) {
            captains.push($(element).html());
        });
        $(captains).each(function(i, name) {
            $('.tableCell.teamMember .cellContent a').each(function(j, element) {
                if(element.innerHTML == name){
                    $(element).parent().parent().parent().find('.tableCell.achievements .cellContent')
                              .prepend('<img src="img/yellow-star.png" title="Team Captain" />');
                    return false;
                }
            });
        });
        
        $(this.element).remove();
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if(!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);