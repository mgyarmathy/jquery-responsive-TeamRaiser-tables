/*    
*    responsive_TeamRaiser_tables.js
*    Author: Michael Gyarmathy, Web Developer Intern, Blackbaud
*    Last Updated: July 15, 2013
*    Description: uses DOM traversal to extract information from a TR table and generate a new table with a responsive DIV format. 
*                 also sorts table entries by amount raised. (requires jQuery)
*                 example here: http://site.wish.org/site/TR?team_id=1011&fr_id=1041&pg=team
*/

(function($) { 
  $(function() {
    // create div where new table will go
    $('div.content').prepend( '<div id="teamRoster" class="row_12">'
                            +   '<h2 style="color:rgb(3,106,147);">Team Roster</h2>'
                            +   '<div id="teamRosterTable"></div>'
                            + '</div>'
                            );
   
    // create heading for table
    $('#teamRosterTable').append( '<div class="tableRow tableHeading">'
                                +   '<div class="tableCell teamMember">'
                                +      '<div class="cellContent">Team Member</div>'
                                +   '</div>'
                                +   '<div class="tableCell achievements">'
                                +      '<div class="cellContent">Achievements</div>'
                                +   '</div>'
                                +   '<div class="tableCell raised">'
                                +      '<div class="cellContent">Raised</div>'
                                +   '</div>'
                                +   '<div class="tableCell donate">'
                                +      '<div class="cellContent">&nbsp;</div>'
                                +   '</div>'
                                + '</div>'
                                );

    // retrieve records from TR table
    var records = [];
    $('table.tr_roster tbody').find('tr').each(function(i, element) { 
        var n = $(element).find('td')[0].innerHTML;
        var amt = $(element).find('td')[1].innerHTML;
        records.push({ name: n.substring(3,n.length-2), 
                       amount_display: amt.substring(0,amt.length-3) , 
                       amount: parseFloat(amt.substring(1,amt.length)) 
                    });
    });

    // sort records
    records.sort(function(a,b) {return (b.amount - a.amount)} );
    
    // add sorted records to the table
    $(records).each(function(i, participant) {
        $('#teamRosterTable').append( '<div class="tableRow">'
                                    +    '<div class="tableCell teamMember">'
                                    +       '<div class="cellContent">' + participant.name + '</div>'
                                    +    '</div>'
                                    +    '<div class="tableCell achievements">'
                                    +       '<div class="cellContent">'
                                    +          '<img src="http://i.imgur.com/ePB8oVU.png" />'
                                    +          '<img src="http://i.imgur.com/ePB8oVU.png" />'
                                    +          '<img src="http://i.imgur.com/ePB8oVU.png" />'
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
    });

    // assign captain designations
    var captains = [];
    $('td.tr_captain a').each(function(i, element) {
        captains.push($(element).html());
    });
    $(captains).each(function(i, name) {
        $('.tableCell.teamMember .cellContent a').each(function(j, element) {
            if(element.innerHTML == name){
                $(element).parent().parent().parent().find('.tableCell.achievements .cellContent')
                          .prepend('<img src="http://site.wish.org/images/friendraiser/yellow_star.gif" title="Team Captain" />');
                return false;
            }
        });
    });
    
    // hide achievement images from teamMember column
    $('#teamRosterTable div.teamMember img').hide();
    
  });
})(jQuery);
