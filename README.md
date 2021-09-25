# APP Maker
APP Maker is a PHP and Javascript framework design to quickly build advanced databases.

## License
MIT License

## Copyright
Copyright © 2019-2021 Les Entreprises LaswitchTech. All rights reserved.

## Features
 * Complete Framework built around a centralized database
 * Support your existing user base using LDAP, SMTP, PAM and SQL authentication.

## Command Line Interface
The command line interface can be used to perform some pre-programmed functions.

Here is a list of available commands:
 * --version : Display the current running version
 * --debug-mode : [TRUE|FALSE] -> Enable or Disable Debug Mode
 * --maintenance-mode : [TRUE|FALSE] -> Enable or Disable Maintenance Mode
 * --cron : Execute CRON tasks
 * --publish : publish an update on the configured repository.
 * --update : install the latest updates from the configured repository.

## Setup CRON

Open your crontab witht the LAMP user
```bash
crontab -u [LAMP USERNAME] -e
```
And add the following:
```bash
* * * * * "php [WEBROOT]/cli.php --cron"
```

## Change-log
### Version 21.09-dev Build 8
#### Features
 * General:

#### Bug-fixes
 * 9001:

## To Do
 * Ticket System
 * Documents Management
 * Creating an Update system
 * Add Progress Bar to Installer
 * Shipment management system
 * Shipment tracking system
 * Cloud Integration for Calendar Events and Contacts
 * Create small installation script for servers
 * List available hooks in documentations
 * CARL integration for SKU's
 * Add a paging system for long tables
 * Adding scalability options such as Splitting the database into multiple databases
 * Adding SAMBA support for local shares
 * Adding FTP/WebDAV support for remote shares
 * Integrate VoIP system
 * Add default sets of options for groups.
 * Add default dashboard layout for groups.
 * Add an import/export options in the user settings.
 * Client's Inventory in Transit
 * Updating the software should change the id of the server. This would limit cURL tempering/unauthorized automation further by changing the name of the login cookie. (This will logout every users though)
 * digital contracts (2 tables)
 * Add check boxes to table for multi-edit
 * Cache system => https://dzone.com/articles/how-to-create-a-simple-and-efficient-php-cache
