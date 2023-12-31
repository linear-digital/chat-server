const container = document.querySelector('#main-container');

const getData = async () => {
    if (window.location) {
        const res = await fetch('http://localhost:4000/api/bot')
        const data = await res.json()
        main(data.data)
    }


}
getData()
const searchHandler = async (e) => {
    const searchInput = document.getElementById("search-input").value;
    if (searchInput === "") {
        const res = await fetch('http://localhost:4000/api/bot')
        const data = await res.json()
        main(data.data)
    }
    else {
        const res = await fetch('http://localhost:4000/api/bot/search', {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ search: searchInput })
        })
        const data = await res.json()
        main(data.data)
    }
}
const alertSuccess = document.getElementById('alert')
const alertError = document.getElementById('alert-error')

const formHandler = async (e) => {
    e.preventDefault()
    const title = document.getElementById("title").value;
    const tag = document.getElementById("tags").value;
    const question = document.getElementById("questions").value;
    const answer = document.getElementById("answers").value;
    const type = document.getElementById("type").value;
    const tags = tag.split(',')
    const questions = question.split('&&')
    const answers = [answer]

    const newData = {
        title, tags, answers, type, questions
    }
    const res = await fetch('http://localhost:4000/api/bot', {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newData)
    })
    const data = await res.json()
    console.log(data)
    if (res.status === 200) {
        // e.target.reset()
        alertSuccess.classList.remove("hidden")
        alertError.classList.add("hidden")
    }
    else {
        alertError.classList.remove("hidden")
        alertSuccess.classList.add("hidden")
    }
}


document.getElementById('add-form').addEventListener("submit", formHandler)



const main = (data) => {
    console.log(data)
    data.map((d) => (
        container.innerHTML += `
        <div className="border data-card glass w-full rounded-lg  bg-base-300 shadow-xl">
            <div className="">
                <h2 className="card-title">${d.title}</h2>
                <p>${d.questions}</p>
                hello
            </div>
        </div>
        `
    ))
}

