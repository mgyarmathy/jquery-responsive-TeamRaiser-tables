jquery-responsive-TeamRaiser-tables
=============
Version: 1.2 (29-JUL-2013)

a jQuery Plugin that converts TeamRaiser tables into a responsive 'div' format

Usage
-------------

### General Use

Include the javascript file after jQuery:
```html
<script type="text/javascript" src="jquery-responsive-TeamRaiser-tables.js"></script>
```

Also include the provided stylesheet file:
```html
<link rel="stylesheet" href="jquery-responsive-TeamRaiser-tables.css">
```

Select your TeamRaiser table and voilà!
```javascript
$('.tr_roster').responsiveTeamRaiserTable();
```

Note: when using this plugin to convert S42-tables, wrap the S-tag in another element (preferably
a div) and use that selector.
```html
<div id="S42">[[S42:0:top-participants:10]]</div>
```

```javascript
$('#S42').responsiveTeamRaiserTable({
    tableType: 'S42'
});
```

### Via PageBuilder Reusables

Create a reusable pagebuilder page with a single HTML component containing the plugin's Javascript/CSS 
(wrapping each in their respective tags). Also include a jQuery CDN if needed. Name the 
page something that is easy to remember, such as **plugin_jquery_responsive_TeamRaiser_tables**.

On the page using the plugin, pull in the content of your reusable using the S51 tag:
```html
[[S51:plugin_jquery_responsive_TeamRaiser_tables:false]]
```

Select your TeamRaiser table and ker-pow!
```javascript
$('.tr_roster').responsiveTeamRaiserTable();
```

Options
-------------
This plugin also currently supports an (optional) configuration argument:
```javascript
$('.tr_roster').responsiveTeamRaiserTable( {
    labels: ['Badges', 'Team Member', 'Raised', '&nbsp'],
    order: ['milestones', 'name', 'amount', 'donate'],
    tableType: 'S42',
    sort: 'amount'
});
```

`labels` - labels for each of the four table column headings

`order` - ordering of columns (keywords: 'name', 'milestones', 'amount', and 'donate')

`tableType` - specify which type of table is being selected ('team' or 'S42' / default: 'team')

`sort` - sorts the table in descending order by a participant's amount raised ('amount', 'name', or 'none' / default: 'amount')





