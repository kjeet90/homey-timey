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
* 9:3
* 24:00
* 24.0
* 24


# Changelog

## 1.2.0
* Added support 'H' format

## 1.1.1

* Bugfixes

## 1.1.0

* Added support for 'H.decimal' format

## 1.0.1

* Updated app description

## 1.0.0

* Initial version
