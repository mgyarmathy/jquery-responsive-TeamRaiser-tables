jquery-responsive-TeamRaiser-tables
=============
Version: 1.1 (19-JUL-2013)

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
    labels: ['Badges', 'Team Member', 'Raised', '&nbsp'],
    order: ['milestones', 'name', 'amount', 'donate'],
    sort: false
});
```

`labels` - labels for each of the four table columns 

`order` - ordering of columns

`sort` - sorts the table in descending order by a participant's amount raised (default: true)





