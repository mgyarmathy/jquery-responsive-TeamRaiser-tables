jquery-responsive_TeamRaiser_tables
=============
Version: 1.0 (17-JUL-2013)

a jQuery Plugin that converts TeamRaiser tables into a responsive 'div' format

Usage
-------------
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
$('table.tr_roster').responsiveTeamRaiserTable();
```

Options
-------------
This plugin also currently supports an (optional) options argument:
```javascript
$('table.tr_roster').responsiveTeamRaiserTable( {
    labels: ['Team Member', 'Badges', 'Raised', '&nbsp'],
    sort: false
});
```

`labels` - labels for each of the four table columns 

`sort` - sorts the table in descending order by a participant's amount raised (default: true)





