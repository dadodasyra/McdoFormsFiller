const puppeteer = require('puppeteer');
const config = require('./config.json');
const randomOpinions = require('./opinions.json'); //list of random opinions

const headless = config["headless"];
const waitTime = config["waitTime"]; //50 ms should be safe
const restaurantId = config["restaurantId"]; //last 4 digits of the restaurant

//execute startProcess every 11 hours
startProcess();
setInterval(startProcess, config["interval"] * 1000);

async function startProcess () {
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage();
    const startTimestamp = Date.now();

    console.log('Page opened');
    await page.goto('https://survey2.medallia.eu/?hellomcdo', {waitUntil: 'networkidle2'});

    console.log("Page 1");
    await page.evaluate(() => document.querySelector("#buttonBegin").click()); // load the default button to generate a new id

    console.log("Page 2");
    //page 2, age selection
    await page.waitForNavigation({waitUntil: 'networkidle2'}); //wait for page to load
    await page.evaluate(() => document.getElementsByClassName("option_caption")[Math.floor((Math.random() * (5 - 2)) + 2)].click()); //select the age (2 to 5 input)
    await sleep(waitTime); //wait for the animation to end, this is hardcoded but idk how to do it better
    await buttonNext(page);

    console.log("Page 3");
    //page 3, restaurant id
    let yesterdayDate = getYesterdayDate();
    await page.evaluate((yesterdayDate) => document.querySelector("#cal_q_mc_q_date_").value = yesterdayDate, yesterdayDate); // day
    await page.evaluate(() => document.querySelector("#spl_rng_q_mc_q_hour").value = Math.random() * (22 - 6) + 6); // hour, 7 to 22
    await page.evaluate(() => document.querySelector("#spl_rng_q_mc_q_minute").value = Math.floor(Math.random() * 60)); // minute, 0 to 59
    await page.evaluate((restaurantId) => document.querySelector("#spl_rng_q_mc_q_idrestaurant").value = restaurantId, restaurantId); // restaurant id
    await buttonNext(page);

    console.log("Page 4");
    //page 4, type of command
    await page.evaluate(() => document.getElementsByClassName("option_caption")[Math.floor(Math.random() * 2)].click()); //select the type of command (0 to 6), in reality 1 or 2 because the other need other questions
    await sleep(waitTime); //wait for the animation to end, this is hardcoded but idk how to do it better
    await buttonNext(page);

    console.log("Page 5");
    //page 5, take-away or not
    await page.evaluate(() => document.getElementsByClassName("option_caption")[1].click()); //select take away
    await sleep(waitTime); //wait for the animation to end, this is hardcoded but idk how to do it better
    await buttonNext(page);

    console.log("Page 6");
    //page 6, are you satisfied of the restaurant
    await page.evaluate(() => document.querySelector("#onf_q_feedback_m_based_upon_this_visit_to_this_6_1").click()); //select the satisfaction always max
    await page.evaluate((randomOpinion) => document.querySelector("#spl_q_feedback_m_why_are_you_saying_this").value = randomOpinion, randomOpinions[Math.floor(Math.random() * randomOpinions.length)]); //text justification, random from list
    await buttonNext(page); //no sleep time needed ?

    console.log("Page 7");
    //page 7, number of stars for the experience
    await page.evaluate(() => document.querySelector("#onf_q_feedback_satisfaction_score_by_stars_5").click()); //select the satisfaction always max
    await buttonNext(page); //stars does not need any sleep time ?? wtf

    console.log("Page 8");
    //page 8, are you satisfied of all dimensions
    await page.evaluate(() => document.querySelector("#onf_q_mc_q_quality_of_food_and_drink_1").click()); //select the satisfaction always max
    await page.evaluate(() => document.querySelector("#onf_q_mc_q_speed_service_1").click()); //select the satisfaction always max
    await page.evaluate(() => document.querySelector("#onf_q_mc_q_friendliness_crew_1").click()); //select the satisfaction always max
    await page.evaluate(() => document.querySelector("#onf_q_mc_q_cleanliness_exterior_aspect_restaurant_1").click()); //select the satisfaction always max
    await buttonNext(page); //no sleep time

    //page 9, command exact or not
    console.log("Page 9");
    await page.evaluate(() => document.querySelector("#onf_q_feedback_m_was_your_order_accurate_1").click()); //yes
    await buttonNext(page); //no sleep time

    //page 10, problem during visiting or not
    console.log("Page 10");
    await page.evaluate(() => document.querySelector("#onf_q_feedback_m_did_you_experience_a_problem_d_2").click()); //yes
    await buttonNext(page); //no sleep time

    //page 11, sanitary rules
    console.log("Page 11");
    await page.evaluate(() => document.querySelector("#onf_q_feedback_m_health_1").click());
    await page.evaluate(() => document.querySelector("#buttonFinish").click()); //submit button

    //Log end
    console.log("End, tooked " + (Date.now() - startTimestamp) + "ms");
    await browser.close();
}

async function buttonNext(page) {
    await page.evaluate(() => document.querySelector("#buttonNext").click()); //next button
    await page.waitForNavigation({waitUntil: 'networkidle2'}); //wait for page to load
}

function getYesterdayDate () {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate() - 1;

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (dd < 1) {
        dd = '29';
        mm = mm - 1;
    }

    return dd + '/' + mm + '/' + yyyy;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}