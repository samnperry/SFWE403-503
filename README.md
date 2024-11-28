# SFWE403-503
This is the repository for the SFWE403/503 class project.
# How to Run the Code
1. Have [Node.js](https://nodejs.org/en) (including NPM) downloaded
2. In the command line, enter:
    ```bash npm install```
3. Next, in the command line enter:
    ```bash cd ./pharmacy-frontend```
4. Next, in the command line enter:
    ```bash npm run dev```
The program should boot up on localhost along with the backend.
# Top Level Breakdown

## Server.js

This file is the backend server for a pharmacy management system built with Node.js and Express. It provides API endpoints for retrieving and updating data related to inventory, staff, pharmacy details, fiscal records, patient information, and purchase history. Additionally, it implements logging functionality for tracking system updates and actions.
## Assets Folder
This folder contains images used in the frontend development.
## Components Folder
This folder contains all the CSS and GUI(TSX) files that our system uses to display the content on the webpage. Each individual component is separated into folders based on their user/functionality. 
# Page Breakdown


## Cashier  - Cashier.tsx
This page allows the Cashier user to create a cart that contains a patient's prescription or non-prescription items and check out the items out of the inventory for purchase. When an item is purchased it prompts the user for a signature and if the transaction is successful then the item is removed from the inventory and the patient's prescription is filled on the patient's record page. 
## Inventory - Inventory.tsx
This file contains the functionality of viewing the inventory that is stored in the backend to the Pharmacy Manager. The Pharmacy Manager is able to view all inventory, edit the current inventory, and add//delete items in the inventory.
## Manager
This is the folder that contains functionality for the Pharmacy Manager user in our system.
### ManagerMain.tsx
This is the main page that the Pharmacy Manager user sees upon logging in. They are met with a “Home” page that contains buttons to direct them to the Inventory page and Staff Overview page. There is also a notification button at the top in the navigation bar that notifies the Pharmacy Manager if an item in the inventory is low stock or expired.
### StaffOverview.tsx
This file contains the functionality for the Pharmacy Manager to create/delete/edit Pharmacy Personnel accounts. In the event that a Pharmacy Personnel locks their account (incorrect password entered 5 times) then this is the page where the Pharmacy Manager can unlock their account.
## Patient - Patient.tsx
This is a sub-page that pharmacists can access through the pharmacist home page. It allows pharmacists to edit all information stored on patients, add or delete patients, view prescriptions that patients may have, and mark these prescriptions as filled or delete them. If a prescription is picked up the prescription will stay in the patient’s file but will be marked as un-filled.
## Pharm - Pharm.tsx
This is a navigation page for the Pharmacist user that links to the inventory, patient records, cashier, and edit profile pages.  
## Pharmacist/Cashier - PharmacistCashier.tsx
This page allows the Pharmacist user to create a cart that contains a patient's prescription or non-prescription items and check out the items out of the inventory for purchase. When an item is purchased it prompts the user for a signature and if the transaction is successful then the item is removed from the inventory and the patient's prescription is filled on the patient's record page.
## Pharmacist Inventory - PharmacistInventory.tsx
This page contains the viewable inventory for the pharmacist. In this page you are able to see the index of the item, name, amount, supplier, price per quantity,and the expiration date of each medication in the pharmacy.   
## Profile - Profile.tsx
This page allows the pharmacist to change their password. 
## sysAdmin - UserContext.tsx
This is a main that allows the System Admin user to set the current pharmacy and create a main manager account. 


#Database


## fiscal.json
This database contains information about any medications the pharmacy manager purchases.
## inventory.json
This database contains information on all items stored in the inventory.
## patients.json
This database contains information on all patients registered with the pharmacy.
## pharmacy.json
This database stores the information of the pharmacy as well as the account information for the Pharmacy Manager.
## staff.json
This database stores the information on all staff members employed by the pharmacy.


# Logging


## PurchaseHistory.txt
This is the output file for all logging related to purchases and purchase history.
## system-log.txt
This is the output file for the system logging functionalities like logging in and out of user accounts.

