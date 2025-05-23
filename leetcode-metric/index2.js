document.addEventListener("DOMContentLoaded",function(){
    let user = document.getElementById("user");
    let btn = document.getElementById("btn");


    function validateUserName(username){
        if(username.trim === ""){
            alert("Username should not be empty");
            return false;
        }
        else{
            const regex = /^[a-zA-Z0-9_-]{1,15}$/;
            const isMatching  = regex.test(username);
            if(!isMatching){
                alert("Invalid username");
            }
            return isMatching;
        }
    }
  async function fetchUserDetails(username){
        const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
        const url = `https://leetcode.com/graphql`;
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
        query: `
            query userSessionProgress($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                }
            }
            }
        `,
        variables: {
            "username": `${username}`
        }
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow"
        };

        try{
            // button ka content searching... and disabled=true
            const response = await fetch(proxyUrl + url,requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch ");
            }
            const parsedData = await response.json();
            console.log(parsedData);
            displayUserData(parsedData);
        }catch(err){
            console.log(err);
            // add no data found inside the stats container
        }
    }
    function displayUserData(parsedData){
        const totalQuestions = parsedData.data.allQuestionsCount[0].count;
        const easyQuestions = parsedData.data.allQuestionsCount[1].count;
        const mediumQuestions = parsedData.data.allQuestionsCount[2].count;
        const hardQuestions = parsedData.data.allQuestionsCount[3].count;

        const totalSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const easySolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const mediumSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const hardSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        let all_per = (totalSolved / totalQuestions) * 100;
        let easy_per = (easySolved / easyQuestions) * 100;
        let medium_per = (mediumSolved / mediumQuestions) * 100;
        let hard_per = (hardSolved / hardQuestions) * 100;

        const all = (all_per/100)*360;
        const easy = (easy_per/100)*360;
        const medium = (medium_per/100)*360;
        const hard = (hard_per/100)*360;

        document.querySelector('.stats-box').style.setProperty('--all',`${all}deg`);
         document.querySelector('.stats-box').style.setProperty('--easy',`${easy}deg`);
        document.querySelector('.stats-box').style.setProperty('--medium',`${medium}deg`);
        document.querySelector('.stats-box').style.setProperty('--hard',`${hard}deg`);

        all_per =Math.round(all_per);
        easy_per = Math.round(easy_per);
        medium_per = Math.round(medium_per);
        hard_per = Math.round(hard_per);
        console.log(all_per,easy_per);
        let e1 = document.createElement('h4');
        let e2 = document.createElement('h4');
        let e3 = document.createElement('h4');
        let e4 = document.createElement('h4');
        e1.textContent=`${all_per}%`
        e2.textContent=`${easy_per}%`
        e3.textContent=`${medium_per}%`
        e4.textContent=`${hard_per}%`
        
        let allDiv = document.getElementsByClassName('all');
        let easyDiv = document.getElementsByClassName('easy');
        let mediumDiv = document.getElementsByClassName('medium');
        let hardDiv = document.getElementsByClassName('hard');
        console.log(allDiv);
        console.log(easyDiv)
        allDiv[0].insertAdjacentElement("afterbegin",e1);
        easyDiv[0].insertAdjacentElement('afterbegin',e2);
        mediumDiv[0].insertAdjacentElement('afterbegin',e3);
        hardDiv[0].insertAdjacentElement('afterbegin',e4);
    }
    btn.addEventListener("click",function (){
        const username = user.value;
        console.log(username);
        if(validateUserName(username)){
            fetchUserDetails(username);
        }
    })
})