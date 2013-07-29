/*!
 *  Responsive TeamRaiser Tables - version 1.2
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
            tableType: 'team',
            sort: 'amount'
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
            console.error('responsiveTeamRaiserTable - four labels must be specified');
        }
        
        if(this.options.order.length != 4){
            console.error('responsiveTeamRaiserTable - invalid order');
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
                        console.error( 'responsiveTeamRaiserTable - invalid order: "' + this + '" is not a valid column name. '
                                     + 'options are: "name", "milestones", "amount", or "donate"'
                                     );
                        break;
                }
            });
        }
        
        this.init();
    }

    Plugin.prototype.init = function() {
        
        var plugin = this,
            records = [],
            captains = [];
            
        // retrieve records from TR table
        if (plugin.options.tableType === 'team') {
            $(plugin.element).find('tbody').find('tr').each(function(i, row) { 
                var n = $(row).find('td')[0].innerHTML;
                var amt = $(row).find('td')[1].innerHTML;
                var px = getParticipantId($(row).find('a:first').attr('href'));
                
                // rows not linked to a participant are removed (such as Team Gifts)
                if (px == 'null') return;
                
                records.push({ name: n.substring(3,n.length-2)
                             , amount_display: amt.substring(0,amt.length-3)
                             , amount: parseFloat(amt.substring(1,amt.length))
                             , id: px
                             }
                );
            });
        }
        else if (plugin.options.tableType === 'S42') {
            
            var names = [],
                ids = [],
                amountsRaised = [],
                badges = [],
                records = [];
                
            //gather all of the participant names and ids
            $(plugin.element).find('a').each(function(i, entry) {
                names.push($(entry).prop('outerHTML'));
                ids.push(getParticipantId($(entry).attr('href')));
            });

            //gather corresponding amounts raised
            $(plugin.element).contents().filter(function() {
                return this.nodeType == 3 && this.nodeValue.indexOf('$') > 0;
            }).wrap('<span class="amountRaised"></span>');
            
            $('span.amountRaised').each(function(i, entry) {
                var $amt = $(entry).html();
                $amt = $amt.replace('&nbsp;', '');
                $amt = $amt.replace('\(', '');
                $amt = $amt.replace('\)', '');
                $amt = $amt.substring(0, $amt.length-3);
                amountsRaised.push($amt);
            });
            
            //extract badges from each row
            $(plugin.element).prepend('</br>');
            $(plugin.element).find('br').each(function() {
                var $set = $();
                var nxt = this.nextSibling;
                while(nxt) {
                    if (!$(nxt).is('br')) {
                        $set.push(nxt);
                        nxt = nxt.nextSibling;
                    } else break;
                } 
               $set.wrapAll('<div class="old-tablerow" />');
            });
            
            $('.old-tablerow').each(function(i) {
                badges[i] = ""
                $(this).find('img').each(function() {
                    badges[i] += this.outerHTML;
                });
            });
            
            //combine all extracted data
            $(names).each(function(i) {
                records.push({ id: ids[i]
                             , name: names[i]
                             , amount_display: amountsRaised[i]
                             , amount: parseInt(amountsRaised[i].substring(1,amountsRaised[i].length))
                             , badges: badges[i]
                             }
                );
            });
        }
        
        // sort records
        if (plugin.options.sort === 'amount') {
            records.sort(function(a,b) {
                return b.amount - a.amount;
            });
        }
        else if (plugin.options.sort === 'name') {
            records.sort(function(a,b) {
                var nameA = a.name;
                    nameB = b.name;
                //trim all of the unneccesary tags
                nameA = nameA.replace(/<[a|A][^>]*>/g, '');
                nameB = nameB.replace(/<[a|A][^>]*>/g, '');
                nameA = nameA.replace(/<\/[a|A]>/g, '');
                nameB = nameB.replace(/<\/[a|A]>/g, '');
                nameA = nameA.replace(/<[img|IMG][^>]*>/g, '');
                nameB = nameB.replace(/<[img|IMG][^>]*>/g, '');
                nameA = nameA.replace(/^[ \t\n]+/g, '');
                nameB = nameB.replace(/^[ \t\n]+/g, '');
                return nameA.localeCompare(nameB);
            });
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
                switch(String(this)) {
                    case 'name':
                        rowContents += '<div class="tableCell name">'
                                    +    '<div class="cellContent">' + participant.name + '</div>'
                                    + '</div>';
                        break;
                    case 'milestones':  
                        rowContents += '<div class="tableCell milestones">'
                                    +    '<div class="cellContent">'
                                    +    (plugin.options.tableType === 'S42' ? participant.badges : '')
                                    +    '</div>'
                                    +  '</div>'; 
                        break;
                    case 'amount':      
                        rowContents += '<div class="tableCell amount">'
                                    +    '<div class="cellContent">' + participant.amount_display + '</div>'
                                    + '</div>';
                        break;
                    case 'donate':      
                        rowContents += '<div class="tableCell donate">'
                                    +    '<div class="cellContent">'
                                    +      '<a href="Donation2?df_id=[[S42:5910:form-id]]&FR_ID=[[S334:fr_id]]&PROXY_ID=' 
                                    +          participant.id 
                                    +          '&PROXY_TYPE=20&[[S42:5910:form-id]].donation=form1">'
                                    +        '<button>Donate</button>'
                                    +      '</a>'
                                    +    '</div>'
                                    + '</div>';
                        break;
                    default:
                        break;
                }                                        
            });
            $('#teamRosterTable').append('<div class="tableRow">' + rowContents + '</div>'); 
        });
        
        if (plugin.options.tableType === 'team') {
            // add milestones to each record
            $('.tableCell.name .cellContent img').each(function(i, element) {
               $(element).parent().parent().parent().find('.tableCell.milestones .cellContent')
                         .append($(element).clone());
            })
            .remove();

            // assign captain designations
            $('td.tr_captain a').each(function(i, element) {
                captains.push($(element).html());
            });
            $(captains).each(function(i, name) {
                $('.tableCell.name .cellContent a').each(function(j, element) {
                    if (element.innerHTML == name) {
                        $(element).parent().parent().parent().find('.tableCell.milestones .cellContent')
                                  .prepend('<img src="img/yellow-star.png" title="Team Captain" />');
                        return false;
                    }
                });
            });
        }
        
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
    
    //helper function used to get variables from query string in url
    function getParticipantId(url) {
        if(url !== undefined){
            var query = url.split('?')[1];
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == 'px'){return pair[1];}
           }
        }
        return 'null';
    }

})(jQuery, window, document);