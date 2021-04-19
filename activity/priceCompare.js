let puppeteer = require("puppeteer");
let fs = require("fs");
console.log("Before");
let product=process.argv[2];
let lists=["https://www.amazon.in","https://www.flipkart.com","https://paytmmall.com"];
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized",]
        });
        let amazonDetails=await getAmazonListings(lists[0],browserInstance,product)
        let flipkartDetails=await getFlipkartListings(lists[1],browserInstance,product)
        let paytmDetails=await getPaytmListings(lists[2],browserInstance,product)

        console.table(amazonDetails);
        console.table(flipkartDetails);
        console.table(paytmDetails);
    } catch (err) {
        console.log(err);
    }
})();
async function getAmazonListings(url,browserInstance,product){
    let newTab = await browserInstance.newPage();
    await newTab.goto(url);
    await newTab.type("#twotabsearchtextbox", product, { delay: 200 });
    await newTab.click("#nav-search-submit-button", newTab);
    await newTab.waitForSelector(".a-section.a-spacing-medium", { visible: true });
    function consoleFn(priceSelector,nameSelector){
        let priceArr=document.querySelectorAll(priceSelector);
        let nameArr=document.querySelectorAll(nameSelector);
        let details=[];
        for(let i=0;i<5;i++){
            let price=priceArr[i].innerText;
            let name=nameArr[i].innerText;
            details.push({
                price,name
            })
        }
        return details;
    }
    return newTab.evaluate(consoleFn,".a-price-whole",".a-size-medium.a-color-base.a-text-normal")
}
async function getFlipkartListings(link, browserInstance, pName) {
    let newPage = await browserInstance.newPage();
    await newPage.goto(link);
    await newPage.click("._2KpZ6l._2doB4z");
    await newPage.type("._3704LK", pName);
    await newPage.click("button[type='submit']");
    await newPage.waitForSelector("._30jeq3._1_WHN1", { visible: true });
    await newPage.waitForSelector("._4rR01T", { visible: true });
    function consoleFn(priceSelector, pNameSelector) {
        let priceArr = document.querySelectorAll(priceSelector);
        let PName = document.querySelectorAll(pNameSelector);
        let details = [];
        for (let i = 0; i < 5; i++) {
            
            let price = priceArr[i].innerText;
            let Name = PName[i].innerText;
            details.push({
                price, Name
            })
        }
        return details;
    }
    return newPage.evaluate(consoleFn,
        "._30jeq3._1_WHN1",
        "._4rR01T");
}
async function getPaytmListings(link,browserInstance,product){
let newPage=await browserInstance.newPage();
await newPage.goto(link);
await newPage.type("#searchInput",product,{delay:2000});
await newPage.keyboard.press("Enter",{delay:2000})
await newPage.keyboard.press("Enter")
await newPage.waitForSelector(".UGUy",{visible:true});
await newPage.waitForSelector("._1kMS",{visible:true});
function consoleFn(priceSelector,nameSelector){
    let priceArr=document.querySelectorAll(priceSelector);
    let nameArr=document.querySelectorAll(nameSelector);
    let details=[];
    for(let i=0;i<5;i++){
        let price=priceArr[i].innerText; 
        let name=nameArr[i].innerText; 
        details.push({
            price,name
        })
    }
    return details;
}
return newPage.evaluate(consoleFn,"._1kMS",".UGUy");
}
console.log("after");
