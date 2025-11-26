# Timey

A Homey app for using text variables in time flow cards with a 24-hour format: 'H:mm', 'H.decimal' or 'H'. This will enable the option to change the time in one place and it will update across all your flows.

00:00 is the earliest timestamp
23:59 is the latest timestamp

## Example of valid timestamp
* 09:30
* 9:30
* 09.50
* 9.50
* 09.5
* 9.5
* 9

## Example of invalid timestamp
* 09:3
* 9:3
* 9:5
* 24:00
* 24.0
* 24

# Expressions

You can use expressions to set the timestamp. You have two options, BLL or Homeys built in logic, but the result of the expressions needs to match the valid timestamps as mentioned above.

## Better Logic Library
You need to first have the Better Logic Library (BLL) installed: [Homey App Store](https://homey.app/en-us/app/net.i-dev.betterlogic/Better-Logic-Library/)

Then wrap your expressions with brackets like this: `{[ expression ]}` and the result must match one of the valid formats mentioned above

Read more about BLL here: [Community Topic](https://community.homey.app/t/app-pro-better-logic-library-for-users/71876)

## Homeys built in logic

Use Homeys built in expression brackets: `{{ expression }}`

# Changelog

## 1.4.1
### Bugfix
* Fixed issue where decimal to timestamp would sometimes be incorrect

## 1.4.0
### Feature
* Added time1 is earlier/later than time2 flow cards. 
### Bugfix
* Fixed wording in existing earlier/later flow cards

## 1.3.0
### Feature
* Added support for BetterLogicLibrary

## 1.2.0
### Feature
* Added support 'H' format

## 1.1.1
* Bugfixes

## 1.1.0

### Feature
* Added support for 'H.decimal' format

## 1.0.1

* Updated app description

## 1.0.0

* Initial version
