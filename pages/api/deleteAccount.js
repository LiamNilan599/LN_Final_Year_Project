export default async function handler(req, res) {
    await fetch('http://localhost:3030/delete-account',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + req.body.token
            },
            body: JSON.stringify(req.body)
        })
        res.end()
}