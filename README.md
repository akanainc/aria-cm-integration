# Akana Community Manager Integration
![Image of Akana] 
(https://www.akana.com/img/formerlyLOGO8.png) 
[Akana.com](http://akana.com)

## Aria Community Manager Integration
This integration demostrates the integration of Aria Systems billing solution with Akana Community Manager to give you powerfull subscription billing capabilities for your APIs. 
## Aria Systems 
### About the Aria Systems

### Pre-Reqs
- You must have an account with Aria Systems
    + You must have a Global Master Plan defined as the default
    + You must have sub-plans defined that automatically get rolled up to the Global Master Plan (GMP)
    + Sub-Plans map to licenses defined in Community Manager
        + Note when an App gets created in Community Manager an account is create in Aria and assigned the Global Master Plan.  When that App subscribes to an API with a license that is mapped to a subplan in Aria, an account is created with the GMP and the sub-plan. All accounting is rolled up to the GMP which allows us to send out one invoice per App with all of its APIs.  
- You need Policy Manager v7.2.11 or later
- You need Community Manager v7.2.4.1 or later
- you must install the pso extensions custom polices:
    + unzip the com.akana.pso.apihooks.extensions_7.2.3.zip (available in this repository) into the <Policy Manager Home>/sm70 directory. 
    + unzip the com.akana.pso.apihooks.technology.preview_7.2.92.zip (available in this repository) into the <Policy Manager Home>/sm70 directory
    + stop all PM and ND(s)
    + run the configurator in update mode for all the PM and ND instances:
        + To run in configuration mode delete the cache directory of the container instance you are updating.
        + run this command, depending on whether you are running on Windows or Linux:
            Windows: 
            [Gateway base dir]\sm70\bin>startup.bat configurator "-Dsilent=true" "-DdeploymentName=Standalone" "-Dproperties=C:/<property file directory location>/myprops.properties" 
     
            UNIX 
            [Gateway base dir]/sm70/bin>startup.sh configurator "-Dsilent=true" "-DdeploymentName=Standalone" "-Dproperties=/export/home/username/<property file directory location>\myprops.properties"
        + the myprops.properties path must be the fully qualified path, and the file contnents will look like:
            container.instance.name=[intance name, e.g. PM]
            credential.username = [administrator login] 
            credential.password = [administrator password] 
            default.host=[instance Host, e.g. localhost] 
            default.port=[instance Port, e.g. 9905]
            wizard.mode=update
    + Using the SOA Admin Console, install the following Plug-ins in each PM container:
        * Akana PSO API Gateway Extensions for API Hooks
        * Akana PSO Simple Things API
    + Using the SOA Admin Console, install the following Plug-ins in each ND container:
        * Akana PSO API Gateway Extension for API Hooks
    + restart all PM and ND(s)
- You need to install the Aria trusted CA certs into Policy Manager
    + From the Policy Manager console (example: http://localhost:9900) 
        + click on Configure -> Security -> Certificates -> Trusted CA Certificates
        + click Add Trusted CA Certificates
            + Add the complete hierarchy (Note: you need to download the certs by pointing your browser at the Aria System's secure endpoint and saving each cert in the hierarchy)

### Getting Started Instructions
#### Download and Import
- Download Aria_Hooks.zip
- Login to PolicyManager  example: http://localhost:9900
- Select the root "Registry" organisation and click on the "Import Package" from the Actions navigation window on the right side of the screen
  - click on button to browse for the Aria_Hooks.zip archive file 
  - click Okay to start the importation of the hook.
  - when prompted click Okay to deploy the virtual service to the container later.
- this will create a Aria Hooks Organisation with the requisite artefacts needed to run the API.

#### Verify Import
- Expand the services folder in the Aria Hooks you imported and find Box_API_Hook VS

#### Host Virtual Services
- There are two virtual services that need hosting on your nd container
    + Aria_BillingComplete_REST_API_vs0
        + location:  /aria/v2
    + Aria_Object_Query_API_vs0
        + location:  /ariaquery/v2

#### Activate Anonymous Contract
- Expand the contracts folder in the Google Sheets API Hook you imported and find the "AriaOpen"  and "AriaQueryOpen" contracts under the "Provided Contracts" folder
- for each contract click on the "Activate Contract" workflow activity in the right-hand Activities portlet
- ensure that the status changes to "Workflow Is Completed"


#### Run the Aria Setup Postman transactions:
- Load the collection into Postman
- Change the host/port in all the URLs to be your system
- Change the Basic Auth settings if you have something besides administrator/password
- Run the “TenantInfo” and the “Make xxx container” transactions
- You will need to create/customize the LicenseMap transactions for your own system. You will need to know: 
    # LicenseId for all licenses to be mapped
    # the Master Plan and Supplemental Plan numbers to be mapped. The easiest/only way of getting the LicenseId is to:
        + export the license
        + Look at the objectdata.xml file inside the export zip.
        + Get the content of the <LicenseID> element. It should look something like: e86a94ba-b8f7-4321-8c7e-6795144e412c.acme
    - The LicenseId needs to go in the Postman “LicenseMap” transactions two places:
        + In the URL path: /simplethings/Aria/license/<licenseid>.json
        +  In the $/CM/id JSON element
    - The Aria Master Plan number needs to go into the …/AccountProperties/master_plan_no element in both sandbox and production
    - The Aria Supplemental Plan number needs to go two places in the sandbox and production elements:
        + $/Aria/plans/(sandbox|production)/plan
        + $/Aria/plans/(sandbox|production)/accountProperties/supp_plans
- You need a separate “LicenseMap” transaction for each license that needs ot be mapped to an Aria plan

### License
Copyright 2015 Akana, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

