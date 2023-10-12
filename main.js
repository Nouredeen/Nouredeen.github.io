let value;
let nickname;
let username;
let bio;
let company;
let locationInfo;
let email;
let avatarLinkSRC;
let repositories;

let repoTemplate;

window.onload = Init;

function Init() {
    input = document.querySelector("#username");

    username = document.getElementById("username");
    nickname = document.getElementById("nickname");
    nickname = document.getElementById("nickname");
    bio = document.getElementById("bio");
    company = document.getElementById("company-info");
    locationInfo = document.getElementById("location-info");
    email = document.getElementById("mail-info");
    avatarLinkSRC = document.getElementById("profile-picture");
    repositories = document.getElementById("repositories-list-container");

    repoTemplate = document.querySelector(".repository");
    
    input.addEventListener("change", UpdateUser);
    input.addEventListener("change", UpdateRepositories);
}

async function UpdateUser() {
    let user = await GetUserJSON(input.value);
    console.log(user);

    if (user == false) {
        ResetPage();
        return;
    }

    if (user["name"] == null) {
        username.value = "Username";
    } else {
        username.value = user["name"];
    }
    if (user["login"] == null) {
        nickname.setAttribute("style", "display:none");
    } else {
        nickname.innerHTML = user["login"];
        nickname.setAttribute("style", "display:block");
    }
    if (user["bio"] == null) {
        bio.setAttribute("style", "display:none");
    } else {
        bio.innerHTML = user["bio"];
        bio.setAttribute("style", "display:block");
    }
    if (user["company"] == null) {
        company.setAttribute("style", "display:none");
    } else {
        company.lastElementChild.innerHTML = user["company"];
        company.setAttribute("style", "display:block");
    }
    if (user["location"] == null) {
        locationInfo.setAttribute("style", "display:none");
    } else {
        locationInfo.lastElementChild.innerHTML = user["location"];
        locationInfo.setAttribute("style", "display:block");
    }
    if (user["email"] == null) {
        email.setAttribute("style", "display:none");
    } else {
        email.lastElementChild.value = user["email"];
        email.setAttribute("style", "display:block");
    }

    avatarLinkSRC.setAttribute("src", user["avatar_url"]);
    let followers = document.createTextNode(`${kFormatter(user["followers"])} followers • ${kFormatter(user["following"])} following`);
    avatarLinkSRC.parentElement.replaceChild(followers, avatarLinkSRC.parentElement.lastChild);
}

async function UpdateRepositories() {
    let repos = await GetUserRepositores(input.value);
    repositories.replaceChildren();

    repos.forEach(element => {
        let repo = repoTemplate.cloneNode(true);
        repo.querySelector(".repository-title").innerHTML = `<a href="${element["html_url"]}" target="_blank">${element["name"]}</a>`;
        repo.querySelector(".repository-description").innerHTML = element["description"];
        repo.querySelector(".repository-language").innerHTML = element["language"];
        repo.querySelector(".repository-publicity").innerHTML = element["private"] ? "private" : "public";
        repositories.appendChild(repo);
        repo.style.display = "block";
    });
}

function ResetPage() {
    avatarLinkSRC.setAttribute("src", "Media/profile-pic.png");

    let followers = document.createTextNode("0 followers • 0 following");
    avatarLinkSRC.parentElement.replaceChild(followers, avatarLinkSRC.parentElement.lastChild);

    repositories.replaceChildren();
    
    company.setAttribute("style", "display:none");
    email.setAttribute("style", "display:none");
    locationInfo.setAttribute("style", "display:none");
    bio.setAttribute("style", "display:none");
    username.value = "Enter a username";
    nickname.innerHTML = "username";
}

function kFormatter(num) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num;
}

async function GetUserJSON(username) {
    let response = await fetch(`https://api.github.com/users/${username}`);
    if (response.status == 200) {
        return await response.json();
    } else {
        return false;
    }
}

async function GetUserRepositores(username) {
    let response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (response.status == 200) {
        return await response.json();
    } else {
        return false;
    }
}

function DisplayJSON(json) {
    let text;
    for (const item in json) {
        text += item + ":  " + json[item] + '\n';
    }

    return text;
}