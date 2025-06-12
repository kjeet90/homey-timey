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


# Changelog

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
