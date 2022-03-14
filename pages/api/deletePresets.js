export default async function handler(req, res) {
    var data = 
    {
      id: req.body.id
    }
    await fetch('http://localhost:3030/delete-preset',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + req.body.token
            },
            body: JSON.stringify(data)
        })
        res.end()
}