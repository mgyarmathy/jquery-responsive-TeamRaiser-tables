/*!
 *  Responsive TeamRaiser Tables - version 1.1
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
        
        //error checking on options
        if(this.options.labels.length != 4){
            $.error('responsiveTeamRaiserTable - four labels must be specified');
        }
        
        if(this.options.order.length != 4){
            $.error('responsiveTeamRaiserTable - invalid order');
        }
        else {
            $(this.options.order).each(function(){
                switch(String(this)){
                    case 'name':
                    case 'milestones':
                    case 'amount':
                    case 'donate':
                        break;
                    default:
                        $.error( 'responsiveTeamRaiserTable - invalid order: "' + this + '" is not a valid column name. '
                               + 'options are: "name", "milestones", "amount", or "donate"'
                               );
                        break;
                }
            });
        }
        
        this.init();
    }

    Plugin.prototype.init = function() {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        
        // retrieve records from TR table
        var plugin = this,
            records = [],
            captains = [];
        $(plugin.element).find('tbody').find('tr').each(function(i, row) { 
            var n = $(row).find('td')[0].innerHTML;
            var amt = $(row).find('td')[1].innerHTML;
            records.push({ name: n.substring(3,n.length-2), 
                           amount_display: amt.substring(0,amt.length-3) , 
                           amount: parseFloat(amt.substring(1,amt.length)) 
                        });
        });
        
        // sort records
        if(plugin.options.sort){
            records.sort(function(a,b) {return (b.amount - a.amount)} );
        }
        
        // create div where new table will go
        $(plugin.element).before('<div id="teamRosterTable"></div>');   

        // create heading for table
        var headingContents = '';
        $(plugin.options.order).each(function(i) {
                switch(String(this)){
                    case 'name':
                        headingContents +=  '<div class="tableCell name">'
                                        +      '<div class="cellContent">' + plugin.options.labels[i] + '</div>'
                                        +   '</div>'
                        break;
                    case 'milestones':  
                        headingContents +=  '<div class="tableCell milestones">'
                                        +      '<div class="cellContent">' + plugin.options.labels[i] + '</div>'
                                        +   '</div>' 
                        break;
                    case 'amount':      
                        headingContents +=  '<div class="tableCell amount">'
                                        +      '<div class="cellContent">' + plugin.options.labels[i] + '</div>'
                                        +   '</div>'
                        break;
                    case 'donate':      
                        headingContents +=  '<div class="tableCell donate">'
                                        +      '<div class="cellContent">' + plugin.options.labels[i] + '</div>'
                                        +   '</div>'
                        break;
                    default:
                        break;
                }                                        
        });
        $('#teamRosterTable').append( '<div class="tableRow tableHeading">' + headingContents + '</div>');
                                    
        // add sorted records to the table
        $(records).each(function(i, participant) {
            var rowContents = '';
            $(plugin.options.order).each(function() {
                switch(String(this)){
                    case 'name':
                        rowContents += '<div class="tableCell name">'
                                    +    '<div class="cellContent">' + participant.name + '</div>'
                                    + '</div>';
                        break;
                    case 'milestones':  
                        rowContents += '<div class="tableCell milestones">'
                                    +    '<div class="cellContent"></div>'
                                    +  '</div>'; 
                        break;
                    case 'amount':      
                        rowContents += '<div class="tableCell amount">'
                                    +    '<div class="cellContent">' + participant.amount_display + '</div>'
                                    + '</div>';
                        break;
                    case 'donate':      
                        rowContents += '<div class="tableCell donate">'
                                    +    '<div class="cellContent"><button>Donate</button></div>'
                                    + '</div>';
                        break;
                    default:
                        break;
                }                                        
            });
            $('#teamRosterTable').append('<div class="tableRow">' + rowContents + '</div>'); 
        });
        
        // add milestones to each record
        $('.tableCell.name .cellContent img').each(function(i, element) {
           $(element).parent().parent().parent().find('.tableCell.milestones .cellContent')
                     .html($(element).clone());
        })
        .remove();

        
        // assign captain designations
        $('td.tr_captain a').each(function(i, element) {
            captains.push($(element).html());
        });
        $(captains).each(function(i, name) {
            $('.tableCell.name .cellContent a').each(function(j, element) {
                if(element.innerHTML == name){
                    $(element).parent().parent().parent().find('.tableCell.milestones .cellContent')
                              .prepend('<img src="img/yellow-star.png" title="Team Captain" />');
                    return false;
                }
            });
        });
        
        $(plugin.element).remove();
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