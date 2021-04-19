let puppeteer=require("puppeteer");
let fs=require('fs')
console.log("Before");
(async function(){
    try{
        let browserInstance=await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"]
        })
        let newPage=await browserInstance.newPage();
        await newPage.goto("https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph");
        let arr=await newPage.evaluate(consoleFn);
        let videosCount=arr[0].split(" ")[0];
        videosCount=Number(videosCount);
        console.log(arr[0]);
        console.log(arr[1]);
        let pCurrentVideosCount=await scrollToBottom(newPage,"#video-title");
        while(pCurrentVideosCount<videosCount-50){
            pCurrentVideosCount=await scrollToBottom(newPage,"#video-title");
        }
        let DurTitleArr=await newPage.evaluate(getStats,"span.style-scope.ytd-thumbnail-overlay-time-status-renderer","#video-title");
        console.table(DurTitleArr);
    }catch(err){
        console.log(err);
    }
})();
function consoleFn(){
    let arr=document.querySelectorAll("#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer");
    let newArr=[];
    newArr.push(arr[0].innerText,arr[1].innerText);
    return newArr;
}
async function getStats(durationSelector,titleSelector){
    let durationArr=document.querySelectorAll(durationSelector);
    let titleArr=document.querySelectorAll(titleSelector);
    let newArr=[];
    for(let i=0;i<durationArr.length;i++){
        let duration=durationArr[i].innerText;
        let title=titleArr[i].innerText;
        newArr.push({duration,title});
    }
    return newArr;
}
function scrollToBottom(page,title){
    function getlengthConsoleFn(title){
        window.scrollBy(0,window.innerHeight);
        let titleElemArr=document.querySelectorAll(title);
        console.log(titleElemArr.length);
        return titleElemArr.length;
    }
    page.evaluate(getlengthConsoleFn,title);
}