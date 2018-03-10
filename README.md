# material-searchselect
Material design searchable multiselect JQuery component

## Demo
Check out some predefined select boxes:
https://codepen.io/qtipet/pen/BryPrg

## Dependencies
This is a lightweight JQuery plugin, the dependencies:
> JQuery (2.0 or higher)

> Google Material Icons

## Getting started / installing
- You need to include the dependencies first:
```
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
```
- Then, you can include the Searchselect stylesheet + js files:
```
<link rel="stylesheet" href="https://rawgit.com/qtipet/material-searchselect/master/material-searchselect.min.css" />
<script type="text/javascript" src="https://rawgit.com/qtipet/material-searchselect/master/material-searchselect.js"></script>
```
- Now, you need to create your select component inside your HTML file:
```
<div class="searchselect">
  <label class="searchselect-label">Select options</label>
  <select multiple="">
      <option value="a">Option 1</option>
      <option value="b">Option 2</option>
      <option value="c">Option 3</option>
      <option value="e">Option 5</option>
      <option value="f">Option 6</option>
  </select>
</div>
```
- And as a final step, you need to call searchselect on your element:
```
$(".searchselect").searchselect({
    separator: ",",
    showCheckboxes: true
});
```

## Configurables
You can manipulate your selector by:
1. setting two options through the initial 'searchselect' call
   - separator: the character(s) to be displayed between the selected options
   - showCheckboxes: a boolean to switch on or off the box (unselected) or the tickmark (selected) in front of the options
2. explicitly specifying CSS values for your ".searchselect" div
   - for example setting the width of this will affect the displayed elements
3. setting or unsetting "multiple" on your select will be reflected in the behavior

## Getting the selected values
The displayed elements are completely bound to the select elementyou defined. So you can go on and retrive the selected values just as you would anyway, you can bind it with some binding libraries (like KnockoutJs) or else.

## Contribution, requests
Any feedback is very much appreciated, and of course, any useful contribution is. Please, let me know if you have any ideas on how to make this plugin cover even more demands, or even if you just have the demand, we'll try to find a solution! :)
