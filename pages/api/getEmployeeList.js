export default async function handler(req, res) {
    await fetch('http://localhost:3030/get-data',
        {
            headers: { Authorization: 'Bearer ' + req.body }
        })
        .then((res) => res.json())
        .then((data) => {
            res.status(200).json(data);
        })

}