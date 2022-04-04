export default async function handler(req, res) {
    await fetch('http://localhost:4000/register',
        {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        })
        .then((res) => res.json())
        .then((data) => {
            res.status(200).json(data);
        })

}