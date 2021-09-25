# ALB Connect
ALB Connect is a software built for Logistics, Brokerage and Customs Consulting. This software is intended to be used by ALB's divisions.

## License
GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

## Copyright
Copyright © 2019-2020 ALB Compagnie International. All rights reserved.

## Features
 * Customer relationship management system
 * Enterprise resource planning system
 * Customer Access
 * Unlimited Users
 * LDAP Support
 * SMTP Support
 * Roles and Permissions Builtin System
 * Complete Framework built around a centralized database

## ACC Command Line Interface
The command line interface can be used to perform some pre-programmed functions.

Here is a list of available commands:
 * --version : Display the current running version
 * --debug-mode : [TRUE|FALSE] -> Enable or Disable Debug Mode
 * --maintenance-mode : [TRUE|FALSE] -> Enable or Disable Maintenance Mode
 * --cron : Execute CRON tasks
 * --importCSV : Force the execution of an import task.
 * --updater :
   * list : List available updates
   * update : Performs the necessary actions to update the software
   * backup : Performs a complete backup of the application, it's content and database

## Setup CRON

Open your crontab witht the LAMP user
```bash
crontab -u [LAMP USERNAME] -e
```
And add the following:
```bash
* * * * * "php [WEBROOT]/acc --cron"
```

## Change-log
### Version 1.09.16d2
#### Features
 * General: Adding new branches to git. Master => Production, Beta => Feature Testing, Dev => Development
 * LSP: Added a chgBranch method.
 * My Clients/View: Added the history integration
 * Clients/View: Share to modal will now also create a note in the client file.
 * My Clients/View: Share to modal will now also create a note in the client file.
 * General: Breadcrumb View will now redirect to the current record.
 * General: Added a new favicon
 * Clients/View: Rescheduling a call now creates a callback.
 * My Clients/View: Rescheduling a call now creates a callback.
 * General: ID column added to all tables.
 * Builder: No longer removes a column that a user does not have permission for. The field simply stays empty.
 * Builder: Removed the ID field from the modalNew method.
 * Clients/View : Share to's note now includes links to the users.
 * Divisions : Added status Appointment.
 * Issues : Added status Appointment.

#### Bug-fixes
 * Fixed _POST data in Debug menu
 * Fixed permissions for edit button and modal
 * We can access clients without the button, using the URL or link. Even when we don't have permissions to it. => Fixed!
 * Clients/Index: The assigned_to column does not display the username when multiple IDs are assigned. => Fixed!
 * Unable to change the status of a client. PHP Notice:  Undefined index: link_to in /var/www/clients/client1/web14/private/ALB-Connect/plugins/clients/src/helpers/helper.php on line 32. => Fixed!
 * Fatal error: Uncaught Error: Call to a member function fetchArray() on null in /var/www/clients/client1/web14/private/ALB-Connect/plugins/share/src/helpers/helper.php:120 => Fixed!
 * Messages nav widget does not display the unread message in the inbox. => Fixed!
 * Unable to unassign a call. => Fixed!
 * Unable to unassign a callback. => Fixed!
 * Unable to unassign a appointment. => Fixed!
 * While sharing a file with someone, if I leave the users field empty, the form submits and creates various errors. => Fixed!
 * If database is large, exporting the database generates a timeout error. => Fixed!
 * Remove ID from all create forms. => Fixed!
 * The cron warning does reflect the last time the cron job actually ran. => Fixed!

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

## Possible Services
 * Supplier Broker (not disclosing prices and authorized by buyer, buyers need to accept sharing their list of suppliers to access the public listing)
 * Marketplace (Find products of public suppliers)
 * Secured Data Storage

## Known Bugs
 * Nothing prevents callbacks double booking.
 * Modals are not triggered when the action buttons are hidden due to having to many columns
 * Installer : The application is not properly activated during the installation process and requires a second activation.
 * My Calls : List assigned clients with active calls (Current and Past)
 * My Callbacks : List assigned clients with active callbacks (Current and Past)
 * My Appointments : List assigned clients with active appointments (Current and Past)
 * Documents : Hierarchy and permissions
 * I can end a call without a note. It should prevent me if note is empty.
 * Calls : Should have the saved status reflected in the division and issue fields.
 * Callbacks : Should have the saved status reflected in the division and issue fields.
 * Appointments : Should have the saved status reflected in the division and issue fields.
 * Issues : Test plugin permissions for assign au unassign. (not the button).
 * Calls : When I end a call, the call reopens.
 * Callbacks : When I end a callback, the callback reopens.
 * Appointments : When I end a appointment, the appointment reopens.
 * Contracts Module
 * Reports Module
 * Settings/DEV : Add re-install button.
 * Settings/DEV : Update repository button.
 * LSP : Add list of repository branches
 * LSP : Set default branch
 * LSP : Show README.MD in first tab and a second tab for licenses
 * LSP : Add Favicon
 * LSP : Create Framework
 * Transfer all plugins in AJAX and API calls
