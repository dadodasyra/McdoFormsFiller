# McDo Forms Filler

This is a bot who auto-fill with some random data into the forms available [here](https://survey2.medallia.eu/?hellomcdo) from McDonald's.

This code is pretty hardcoded and pretty slow (8 sec to fill a form).

### Installation

You must have :
- A browser installed on the current machine
- Node JS installed
- git (optional, otherwise download from source)

```
git clone https://github.com/dadodasyra/McdoFormsFiller.git
npm install puppeteer
```
Then you can start it using PM2 (if installed) `pm2 start index.js` otherwise `node index.js` (need an active bash session)

### Config
You can configure the bot with the following parameters:
- restaurantId: The last four digits of the restaurant id (showed on a ticket)
- waitTime: Some animations need to wait, 50ms should be safe
- headless: true = no browser showed, false = debug mode with browser UI
- interval: The interval between each form fill, in seconds, default 39600 sec/11 hours

`opinions.json` can be modified, it's a list of opinions (currently in French) which are randomly inputted into the form.

### Which data is injected ?
- Random age (between 15 and 50+)
- Random hour (between 7 and 22)
- Random minute
- Yesterday Date
- At terminal OR at the counter
- Take away (fewer questions than others)
- Max satisfactions (for each satisfaction questions), 5
- Random opinions from the list
- Yes the command is accurate
- No problems
- Max sanitary rules

### Disclaimer
This is only for **Educational purposes.**

By the way this method could be very easily fixed by McDonald's and the code will not be updated if it's the case.