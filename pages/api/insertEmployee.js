export default async function handler(req, res) {
    await fetch('http://localhost:3030/insert-employee',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + req.body.token
            },
            body: JSON.stringify(req.body.employee)
        })
    res.end()
}